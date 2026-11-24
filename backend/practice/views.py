import hashlib
import os
import re
import uuid
from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, StreamingHttpResponse
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import User
from courses.models import Procedure
from .models import ConsentRecord, PracticeSubmission
from .permissions import IsLearner
from .serializers import (
    PracticeSubmissionListSerializer,
    PracticeSubmissionSerializer,
    PracticeSubmissionUploadSerializer,
)
from .throttles import SubmissionUploadThrottle


class PracticeSubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing learner practice submissions, video uploads, and secure playback.
    """
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsLearner()]
        return [IsAuthenticated()]

    def get_throttles(self):
        if self.action == 'create':
            return [SubmissionUploadThrottle()]
        return []

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return PracticeSubmission.objects.none()

        qs = PracticeSubmission.objects.filter(is_deleted=False).select_related(
            'procedure', 'learner', 'learner__institution'
        )

        if user.role == User.Role.LEARNER:
            return qs.filter(learner=user)
        elif user.role in (User.Role.TRAINER, User.Role.INSTITUTION_ADMIN):
            if not user.institution_id:
                return PracticeSubmission.objects.none()
            return qs.filter(learner__institution_id=user.institution_id)
        elif user.role == User.Role.SUPER_ADMIN:
            return qs

        return PracticeSubmission.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return PracticeSubmissionUploadSerializer
        elif self.action == 'list':
            return PracticeSubmissionListSerializer
        return PracticeSubmissionSerializer

    @extend_schema(
        summary="List Practice Submissions",
        description="List submissions scoped by user role (learners see own, trainers/admins see institution's). Soft-deleted submissions are omitted.",
        responses={200: PracticeSubmissionListSerializer(many=True)},
        tags=["Practice Submissions"],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Get Practice Submission Details",
        description="Retrieve submission metadata. Scoped to the learner owner or authorized trainers/admins from the same institution. Never exposes filesystem paths.",
        responses={200: PracticeSubmissionSerializer, 404: OpenApiTypes.OBJECT},
        tags=["Practice Submissions"],
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Upload Practice Video Submission",
        description=(
            "Upload a practice recording for automated evaluation. "
            "Requires active consent, LEARNER role, valid .mp4 or .mov container, and size under HUNAR_MAX_UPLOAD_MB."
        ),
        request=PracticeSubmissionUploadSerializer,
        responses={
            201: PracticeSubmissionSerializer,
            400: OpenApiTypes.OBJECT,
            403: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT,
        },
        tags=["Practice Submissions"],
    )
    def create(self, request, *args, **kwargs):
        # 1. Enforce active, granted consent
        consent = ConsentRecord.objects.filter(
            user=request.user,
            is_granted=True,
            revoked_at__isnull=True,
            is_deleted=False,
        ).order_by('-granted_at').first()

        if not consent:
            return Response(
                {
                    "error": {
                        "code": "CONSENT_REQUIRED",
                        "message": "Active video recording and data privacy consent is required before uploading practice submissions.",
                    }
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # 2. Procedure validation
        procedure_param = (
            request.data.get('procedure')
            or request.data.get('procedure_code')
            or request.data.get('procedure_id')
        )
        if not procedure_param:
            return Response(
                {
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Procedure identifier is required.",
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        procedure_qs = Procedure.objects.select_related(
            'module__trade__institution'
        ).filter(is_active=True)

        procedure = None
        try:
            uuid_val = uuid.UUID(str(procedure_param))
            procedure = procedure_qs.filter(id=uuid_val).first()
        except (ValueError, TypeError):
            pass

        if not procedure:
            procedure = procedure_qs.filter(procedure_code=str(procedure_param)).first()

        # The procedure must exist, be active, and belong to the learner's institution. Otherwise 404.
        if not procedure:
            raise NotFound("Procedure not found.")

        learner_institution = request.user.institution
        if not learner_institution or procedure.module.trade.institution_id != learner_institution.id:
            raise NotFound("Procedure not found for your institution.")

        # 3. Video file validation
        video_file = request.FILES.get('video') or request.FILES.get('video_file')
        if not video_file:
            return Response(
                {
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Video file is required.",
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Extension check
        orig_name = video_file.name or ""
        ext = os.path.splitext(orig_name)[1].lower()
        if ext not in ('.mp4', '.mov'):
            return Response(
                {
                    "error": {
                        "code": "INVALID_FILE_TYPE",
                        "message": "Only .mp4 and .mov video files are permitted.",
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Content-Length and size checks
        max_mb = getattr(settings, 'HUNAR_MAX_UPLOAD_MB', 200)
        max_bytes = max_mb * 1024 * 1024
        if video_file.size > max_bytes:
            return Response(
                {
                    "error": {
                        "code": "PAYLOAD_TOO_LARGE",
                        "message": f"File exceeds the maximum upload limit of {max_mb}MB.",
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            content_length = int(request.META.get('CONTENT_LENGTH', 0))
            if content_length > max_bytes:
                return Response(
                    {
                        "error": {
                            "code": "PAYLOAD_TOO_LARGE",
                            "message": f"File exceeds the maximum upload limit of {max_mb}MB.",
                        }
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except (ValueError, TypeError):
            pass

        # Inspect magic bytes for MP4/MOV container ("ftyp" box)
        sample_header = video_file.read(32)
        video_file.seek(0)
        if len(sample_header) < 8 or sample_header[4:8] != b'ftyp':
            return Response(
                {
                    "error": {
                        "code": "INVALID_CONTAINER",
                        "message": "Invalid video container. File does not contain a valid MP4 or QuickTime (ftyp) box.",
                    }
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        major_brand = sample_header[8:12]
        if major_brand == b'qt  ' or ext == '.mov':
            safe_ext = 'mov'
            content_type = 'video/quicktime'
        else:
            safe_ext = 'mp4'
            content_type = 'video/mp4'

        # 4. Safe server storage (never store client original filename)
        submission_id = uuid.uuid4()
        institution_id = learner_institution.id
        rel_path = f"videos/{institution_id}/{submission_id}.{safe_ext}"

        media_root = Path(settings.HUNAR_MEDIA_ROOT)
        target_dir = media_root / 'videos' / str(institution_id)
        target_dir.mkdir(parents=True, exist_ok=True)
        target_file = target_dir / f"{submission_id}.{safe_ext}"

        hasher = hashlib.sha256()
        bytes_written = 0

        try:
            with open(target_file, 'wb') as dst:
                for chunk in video_file.chunks(chunk_size=1024 * 1024):
                    bytes_written += len(chunk)
                    if bytes_written > max_bytes:
                        dst.close()
                        target_file.unlink(missing_ok=True)
                        return Response(
                            {
                                "error": {
                                    "code": "PAYLOAD_TOO_LARGE",
                                    "message": f"File exceeds the maximum upload limit of {max_mb}MB.",
                                }
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    hasher.update(chunk)
                    dst.write(chunk)
        except Exception as exc:
            target_file.unlink(missing_ok=True)
            raise exc

        sha256_hex = hasher.hexdigest()

        # 5. Create submission record
        submission = PracticeSubmission.objects.create(
            id=submission_id,
            procedure=procedure,
            learner=request.user,
            consent_record=consent,
            video_file_path=rel_path,
            file_size_bytes=bytes_written,
            video_format=safe_ext,
            content_type=content_type,
            sha256=sha256_hex,
            processing_status=PracticeSubmission.Status.UPLOADED,
            overall_ai_verdict=PracticeSubmission.OverallVerdict.PENDING,
        )

        serializer = PracticeSubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Delete Practice Submission",
        description="Soft-delete a submission and remove its video file from storage. Only the learner owner can delete.",
        responses={204: None, 403: OpenApiTypes.OBJECT, 404: OpenApiTypes.OBJECT},
        tags=["Practice Submissions"],
    )
    def destroy(self, request, *args, **kwargs):
        # Retrieve without role filter first to differentiate 403 vs 404
        submission_id = kwargs.get('pk')
        submission = PracticeSubmission.objects.filter(
            id=submission_id, is_deleted=False
        ).first()

        if not submission:
            raise NotFound("Submission not found.")

        # Learners can only delete their own
        if submission.learner_id != request.user.id:
            if request.user.role in (User.Role.TRAINER, User.Role.INSTITUTION_ADMIN):
                return Response(
                    {
                        "error": {
                            "code": "FORBIDDEN",
                            "message": "Trainers and administrators cannot delete learner submissions.",
                        }
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            raise NotFound("Submission not found.")

        # Soft-delete the database record
        submission.is_deleted = True
        submission.deleted_at = timezone.now()
        submission.save(update_fields=['is_deleted', 'deleted_at'])

        # Remove the file from storage
        if submission.video_file_path:
            full_path = (Path(settings.HUNAR_MEDIA_ROOT) / submission.video_file_path).resolve()
            full_path.unlink(missing_ok=True)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        summary="Secure Video Playback Stream",
        description="Stream video with HTTP Range request support for seeking. Scoped to the learner owner or authorized institutional trainers/admins.",
        parameters=[
            OpenApiParameter(
                name="Range",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.HEADER,
                description="Standard HTTP Range header (e.g. 'bytes=0-1048575')",
                required=False,
            ),
        ],
        responses={
            (200, 'video/mp4'): OpenApiTypes.BINARY,
            (206, 'video/mp4'): OpenApiTypes.BINARY,
            404: OpenApiTypes.OBJECT,
        },
        tags=["Practice Submissions"],
    )
    @action(detail=True, methods=['get'], url_path='video')
    def video(self, request, pk=None):
        submission = self.get_object()

        if not submission.video_file_path:
            raise NotFound("Video file not found.")

        full_path = (Path(settings.HUNAR_MEDIA_ROOT) / submission.video_file_path).resolve()
        if not full_path.exists():
            raise NotFound("Video file not found on disk.")

        file_size = full_path.stat().st_size
        range_header = request.META.get('HTTP_RANGE', '').strip()

        # Handle HTTP Range requests for seeking
        if range_header.startswith('bytes='):
            range_spec = range_header[6:].split(',')[0].strip()
            if '-' in range_spec:
                start_str, end_str = range_spec.split('-', 1)
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else file_size - 1

                if start >= file_size or end >= file_size or start > end:
                    response = HttpResponse(status=416)
                    response['Content-Range'] = f'bytes */{file_size}'
                    return response

                content_length = end - start + 1

                def file_range_iterator(path, start_pos, length, chunk_size=64 * 1024):
                    with open(path, 'rb') as f:
                        f.seek(start_pos)
                        remaining = length
                        while remaining > 0:
                            chunk = f.read(min(remaining, chunk_size))
                            if not chunk:
                                break
                            remaining -= len(chunk)
                            yield chunk

                response = StreamingHttpResponse(
                    file_range_iterator(full_path, start, content_length),
                    status=status.HTTP_206_PARTIAL_CONTENT,
                    content_type=submission.content_type or 'video/mp4',
                )
                response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
                response['Content-Length'] = str(content_length)
        else:
            def full_file_iterator(path, chunk_size=64 * 1024):
                with open(path, 'rb') as f:
                    while chunk := f.read(chunk_size):
                        yield chunk

            response = StreamingHttpResponse(
                full_file_iterator(full_path),
                status=status.HTTP_200_OK,
                content_type=submission.content_type or 'video/mp4',
            )
            response['Content-Length'] = str(file_size)

        response['Accept-Ranges'] = 'bytes'
        response['Cache-Control'] = 'private, no-store'
        response['X-Content-Type-Options'] = 'nosniff'
        response['Content-Disposition'] = f'inline; filename="{submission.id}.{submission.video_format}"'
        return response
