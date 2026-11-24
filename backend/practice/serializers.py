from rest_framework import serializers
from .models import PracticeSubmission, ConsentRecord


class PracticeSubmissionUploadSerializer(serializers.Serializer):
    procedure = serializers.CharField(
        help_text="Procedure code (e.g., 'PROC-ELEC-01') or UUID of the procedure."
    )
    video = serializers.FileField(
        help_text="Binary video file (.mp4 or .mov container, max 200MB)."
    )


class PracticeSubmissionSerializer(serializers.ModelSerializer):
    procedure_id = serializers.UUIDField(source='procedure.id', read_only=True)
    procedure_code = serializers.CharField(source='procedure.procedure_code', read_only=True)
    procedure_title = serializers.CharField(source='procedure.title', read_only=True)
    learner_id = serializers.UUIDField(source='learner.id', read_only=True)
    learner_username = serializers.CharField(source='learner.username', read_only=True)

    class Meta:
        model = PracticeSubmission
        fields = (
            'id',
            'procedure_id',
            'procedure_code',
            'procedure_title',
            'learner_id',
            'learner_username',
            'processing_status',
            'overall_ai_verdict',
            'file_size_bytes',
            'duration_seconds',
            'content_type',
            'sha256',
            'failure_reason',
            'submitted_at',
            'processed_at',
        )
        read_only_fields = fields


class PracticeSubmissionListSerializer(serializers.ModelSerializer):
    procedure_id = serializers.UUIDField(source='procedure.id', read_only=True)
    procedure_code = serializers.CharField(source='procedure.procedure_code', read_only=True)
    procedure_title = serializers.CharField(source='procedure.title', read_only=True)
    learner_id = serializers.UUIDField(source='learner.id', read_only=True)
    learner_username = serializers.CharField(source='learner.username', read_only=True)

    class Meta:
        model = PracticeSubmission
        fields = (
            'id',
            'procedure_id',
            'procedure_code',
            'procedure_title',
            'learner_id',
            'learner_username',
            'processing_status',
            'overall_ai_verdict',
            'file_size_bytes',
            'duration_seconds',
            'submitted_at',
        )
        read_only_fields = fields
