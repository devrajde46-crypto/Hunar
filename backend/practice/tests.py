import os
import shutil
import tempfile
import uuid
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import Institution
from courses.models import Module, Procedure, Trade
from .models import ConsentRecord, PracticeSubmission

User = get_user_model()

# Minimal valid MP4/MOV container headers with an 'ftyp' box
# [0..3]: box length, [4..7]: 'ftyp', [8..11]: major brand
TINY_MP4_CONTENT = b'\x00\x00\x00\x18ftypisom\x00\x00\x02\x00isommp42' + b'\x00' * 64
TINY_MOV_CONTENT = b'\x00\x00\x00\x14ftypqt  \x00\x00\x00\x00qt  ' + b'\x00' * 64
FAKE_MP4_CONTENT = b'Plain text content pretending to be an mp4 video file.'


class PracticeModelTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(
            name="Government ITI Mumbai",
            code="GITI-MUMBAI",
            contact_email="principal@giti-mumbai.edu",
        )
        self.learner = User.objects.create_user(
            username="devraj_sharma",
            email="devraj@iti.edu",
            password="SecurePassword123!",
            role=User.Role.LEARNER,
            institution=self.institution,
            trainee_id_number="TRN-045",
        )
        self.trade = Trade.objects.create(
            institution=self.institution,
            name="Electrician",
            code="ELEC",
        )
        self.module = Module.objects.create(
            trade=self.trade,
            title="Domestic Wiring",
            sequence_order=1,
        )
        self.procedure = Procedure.objects.create(
            module=self.module,
            procedure_code="PROC-ELEC-02",
            title="Switch-Controlled Socket Outlet",
            description="Socket wiring practice",
            safety_instructions="Isolate power.",
        )

    def test_consent_record_creation_and_str(self):
        consent = ConsentRecord.objects.create(
            user=self.learner,
            consent_version="v1.0-2026",
            is_granted=True,
            ip_address="192.168.1.100",
            user_agent="Mozilla/5.0",
        )
        self.assertIsInstance(consent.id, uuid.UUID)
        self.assertTrue(consent.is_granted)
        self.assertIn("Consent for devraj_sharma (v1.0-2026) - Granted", str(consent))

    def test_practice_submission_status_choices_and_verdict(self):
        submission = PracticeSubmission.objects.create(
            procedure=self.procedure,
            learner=self.learner,
            video_file_url="",
            video_file_path="videos/dummy.mp4",
            video_duration_seconds=360.5,
            duration_seconds=360.5,
            file_size_bytes=84000000,
            processing_status=PracticeSubmission.Status.UPLOADED,
            overall_ai_verdict=PracticeSubmission.OverallVerdict.PENDING,
        )
        self.assertIsInstance(submission.id, uuid.UUID)
        self.assertEqual(submission.processing_status, PracticeSubmission.Status.UPLOADED)
        self.assertIn("Uploaded", str(submission))

        submission.processing_status = PracticeSubmission.Status.QUEUED
        submission.save()
        self.assertEqual(submission.processing_status, PracticeSubmission.Status.QUEUED)

        submission.processing_status = PracticeSubmission.Status.PROCESSING
        submission.save()
        self.assertEqual(submission.processing_status, PracticeSubmission.Status.PROCESSING)

        submission.processing_status = PracticeSubmission.Status.SCORED
        submission.overall_ai_verdict = PracticeSubmission.OverallVerdict.PASS
        submission.save()
        self.assertEqual(submission.processing_status, PracticeSubmission.Status.SCORED)

        submission.processing_status = PracticeSubmission.Status.REVIEWED
        submission.save()
        self.assertEqual(submission.processing_status, PracticeSubmission.Status.REVIEWED)

        submission.processing_status = PracticeSubmission.Status.FAILED
        submission.failure_reason = "Corrupted video frame"
        submission.save()
        self.assertEqual(submission.processing_status, PracticeSubmission.Status.FAILED)

    def test_submission_soft_delete(self):
        submission = PracticeSubmission.objects.create(
            procedure=self.procedure,
            learner=self.learner,
            processing_status=PracticeSubmission.Status.UPLOADED,
        )
        self.assertFalse(submission.is_deleted)
        submission.is_deleted = True
        submission.save()
        self.assertTrue(PracticeSubmission.objects.get(id=submission.id).is_deleted)


class PracticeSubmissionApiTests(TestCase):
    def setUp(self):
        # Create isolated temporary media root outside the repository
        self.test_dir = tempfile.mkdtemp(prefix="hunar_media_test_")
        self.media_root = Path(self.test_dir)
        self.settings_override = override_settings(
            HUNAR_MEDIA_ROOT=self.media_root,
            HUNAR_MAX_UPLOAD_MB=5,
        )
        self.settings_override.enable()

        self.client = APIClient()

        # Primary Institution & Users
        self.institution = Institution.objects.create(
            name="Government ITI Mumbai",
            code="GITI-MUMBAI",
            contact_email="principal@giti-mumbai.edu",
        )
        self.learner = User.objects.create_user(
            username="learner_rahul",
            email="rahul@iti.edu",
            password="SecurePassword123!",
            role=User.Role.LEARNER,
            institution=self.institution,
            trainee_id_number="TRN-101",
        )
        self.learner_two = User.objects.create_user(
            username="learner_priya",
            email="priya@iti.edu",
            password="SecurePassword123!",
            role=User.Role.LEARNER,
            institution=self.institution,
            trainee_id_number="TRN-102",
        )
        self.trainer = User.objects.create_user(
            username="trainer_anand",
            email="anand@iti.edu",
            password="SecurePassword123!",
            role=User.Role.TRAINER,
            institution=self.institution,
        )

        # Secondary Institution & Users
        self.other_institution = Institution.objects.create(
            name="Government ITI Delhi",
            code="GITI-DELHI",
            contact_email="principal@giti-delhi.edu",
        )
        self.other_trainer = User.objects.create_user(
            username="trainer_delhi",
            email="trainer@delhi.edu",
            password="SecurePassword123!",
            role=User.Role.TRAINER,
            institution=self.other_institution,
        )
        self.other_trade = Trade.objects.create(
            institution=self.other_institution,
            name="Electrician Delhi",
            code="ELEC-DELHI",
        )
        self.other_module = Module.objects.create(
            trade=self.other_trade,
            title="Industrial Wiring",
            sequence_order=1,
        )
        self.other_procedure = Procedure.objects.create(
            module=self.other_module,
            procedure_code="PROC-ELEC-OTHER",
            title="Staircase Wiring Other",
            description="Other institution procedure",
            safety_instructions="Isolate power.",
        )

        # Primary Trade & Procedure
        self.trade = Trade.objects.create(
            institution=self.institution,
            name="Electrical Wiring",
            code="ELEC",
        )
        self.module = Module.objects.create(
            trade=self.trade,
            title="Domestic Wiring",
            sequence_order=1,
        )
        self.procedure = Procedure.objects.create(
            module=self.module,
            procedure_code="PROC-ELEC-01",
            title="Single-Pole Switch Controlling Batten Lamp",
            description="Domestic lamp circuit",
            safety_instructions="Isolate power before beginning.",
        )

        # Active Consent for Primary Learner
        self.consent = ConsentRecord.objects.create(
            user=self.learner,
            consent_version="v1.0-2026",
            is_granted=True,
            ip_address="127.0.0.1",
        )

    def tearDown(self):
        self.settings_override.disable()
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_anonymous_gets_401(self):
        res = self.client.get("/api/v1/practice/submissions/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        res_post = self.client.post("/api/v1/practice/submissions/", {})
        self.assertEqual(res_post.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_upload_without_consent_is_refused(self):
        # Learner 2 has no consent
        self.client.force_authenticate(user=self.learner_two)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.data["error"]["code"], "CONSENT_REQUIRED")

    def test_upload_with_consent_works_for_tiny_valid_mp4_and_mov(self):
        self.client.force_authenticate(user=self.learner)

        # 1. Test MP4 upload
        mp4_file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res_mp4 = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": mp4_file},
            format="multipart",
        )
        self.assertEqual(res_mp4.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res_mp4.data["processing_status"], "UPLOADED")
        self.assertEqual(res_mp4.data["content_type"], "video/mp4")
        self.assertTrue(len(res_mp4.data["sha256"]) == 64)
        self.assertEqual(res_mp4.data["procedure_code"], self.procedure.procedure_code)

        # 2. Test MOV upload
        mov_file = SimpleUploadedFile("practice.mov", TINY_MOV_CONTENT, content_type="video/quicktime")
        res_mov = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": str(self.procedure.id), "video": mov_file},
            format="multipart",
        )
        self.assertEqual(res_mov.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res_mov.data["content_type"], "video/quicktime")

    def test_fake_file_named_mp4_is_rejected(self):
        self.client.force_authenticate(user=self.learner)
        fake_file = SimpleUploadedFile("renamed_text.mp4", FAKE_MP4_CONTENT, content_type="video/mp4")
        res = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": fake_file},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.data["error"]["code"], "INVALID_CONTAINER")

    def test_wrong_extension_is_rejected(self):
        self.client.force_authenticate(user=self.learner)
        avi_file = SimpleUploadedFile("recording.avi", TINY_MP4_CONTENT, content_type="video/x-msvideo")
        res = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": avi_file},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.data["error"]["code"], "INVALID_FILE_TYPE")

    def test_file_over_limit_is_rejected(self):
        self.client.force_authenticate(user=self.learner)
        # Limit set to 5MB in setUp; generate 5.5MB file
        oversized_content = TINY_MP4_CONTENT + (b'0' * (6 * 1024 * 1024))
        big_file = SimpleUploadedFile("large_video.mp4", oversized_content, content_type="video/mp4")
        res = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": big_file},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.data["error"]["code"], "PAYLOAD_TOO_LARGE")

    def test_procedure_from_another_institution_is_404(self):
        self.client.force_authenticate(user=self.learner)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.other_procedure.procedure_code, "video": file},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_path_traversal_filename_never_affects_stored_path(self):
        self.client.force_authenticate(user=self.learner)
        malicious_filename = r"..\..\evil.mp4"
        file = SimpleUploadedFile(malicious_filename, TINY_MP4_CONTENT, content_type="video/mp4")
        res = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        submission = PracticeSubmission.objects.get(id=res.data["id"])
        # Ensure stored path is relative and strictly under videos/<institution_id>/<uuid>.mp4
        expected_prefix = f"videos/{self.institution.id}/"
        self.assertTrue(submission.video_file_path.startswith(expected_prefix))
        self.assertNotIn("evil", submission.video_file_path)
        self.assertNotIn("..", submission.video_file_path)

        stored_file = self.media_root / submission.video_file_path
        self.assertTrue(stored_file.exists())

    def test_responses_never_contain_filesystem_path(self):
        self.client.force_authenticate(user=self.learner)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        response_str = str(res.data)
        self.assertNotIn(str(self.media_root), response_str)
        self.assertNotIn("videos/", response_str)
        self.assertNotIn("hunar_media", response_str)

        # Check detail GET
        sub_id = res.data["id"]
        res_get = self.client.get(f"/api/v1/practice/submissions/{sub_id}/")
        get_str = str(res_get.data)
        self.assertNotIn(str(self.media_root), get_str)
        self.assertNotIn("videos/", get_str)

        # Check list GET
        res_list = self.client.get("/api/v1/practice/submissions/")
        list_str = str(res_list.data)
        self.assertNotIn(str(self.media_root), list_str)
        self.assertNotIn("videos/", list_str)

    def test_learner_cannot_see_or_stream_another_learner_video(self):
        # Create submission for learner 1
        self.client.force_authenticate(user=self.learner)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res_create = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        sub_id = res_create.data["id"]

        # Learner 2 attempts to inspect and stream
        self.client.force_authenticate(user=self.learner_two)
        res_detail = self.client.get(f"/api/v1/practice/submissions/{sub_id}/")
        self.assertEqual(res_detail.status_code, status.HTTP_404_NOT_FOUND)

        res_stream = self.client.get(f"/api/v1/practice/submissions/{sub_id}/video/")
        self.assertEqual(res_stream.status_code, status.HTTP_404_NOT_FOUND)

    def test_trainer_from_another_institution_gets_404(self):
        self.client.force_authenticate(user=self.learner)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res_create = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        sub_id = res_create.data["id"]

        # Other institution's trainer gets 404
        self.client.force_authenticate(user=self.other_trainer)
        res_detail = self.client.get(f"/api/v1/practice/submissions/{sub_id}/")
        self.assertEqual(res_detail.status_code, status.HTTP_404_NOT_FOUND)

        res_stream = self.client.get(f"/api/v1/practice/submissions/{sub_id}/video/")
        self.assertEqual(res_stream.status_code, status.HTTP_404_NOT_FOUND)

    def test_trainer_from_same_institution_can_stream(self):
        self.client.force_authenticate(user=self.learner)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res_create = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        sub_id = res_create.data["id"]

        # Same institution's trainer can stream
        self.client.force_authenticate(user=self.trainer)
        res_stream = self.client.get(f"/api/v1/practice/submissions/{sub_id}/video/")
        self.assertEqual(res_stream.status_code, status.HTTP_200_OK)
        self.assertEqual(res_stream["Accept-Ranges"], "bytes")
        self.assertEqual(res_stream["Cache-Control"], "private, no-store")
        self.assertEqual(res_stream["X-Content-Type-Options"], "nosniff")
        self.assertEqual(b"".join(res_stream.streaming_content), TINY_MP4_CONTENT)

    def test_range_requests_return_206(self):
        self.client.force_authenticate(user=self.learner)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res_create = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        sub_id = res_create.data["id"]

        # Request bytes 0 through 15
        res_range = self.client.get(
            f"/api/v1/practice/submissions/{sub_id}/video/",
            HTTP_RANGE="bytes=0-15",
        )
        self.assertEqual(res_range.status_code, status.HTTP_206_PARTIAL_CONTENT)
        self.assertEqual(res_range["Content-Range"], f"bytes 0-15/{len(TINY_MP4_CONTENT)}")
        self.assertEqual(res_range["Content-Length"], "16")
        self.assertEqual(b"".join(res_range.streaming_content), TINY_MP4_CONTENT[0:16])

    def test_delete_removes_file_and_hides_record(self):
        self.client.force_authenticate(user=self.learner)
        file = SimpleUploadedFile("practice.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
        res_create = self.client.post(
            "/api/v1/practice/submissions/",
            {"procedure": self.procedure.procedure_code, "video": file},
            format="multipart",
        )
        sub_id = res_create.data["id"]
        sub = PracticeSubmission.objects.get(id=sub_id)
        file_path = self.media_root / sub.video_file_path
        self.assertTrue(file_path.exists())

        # Trainer cannot delete learner submissions
        self.client.force_authenticate(user=self.trainer)
        res_trainer_del = self.client.delete(f"/api/v1/practice/submissions/{sub_id}/")
        self.assertEqual(res_trainer_del.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(file_path.exists())

        # Learner deletes their own submission
        self.client.force_authenticate(user=self.learner)
        res_del = self.client.delete(f"/api/v1/practice/submissions/{sub_id}/")
        self.assertEqual(res_del.status_code, status.HTTP_204_NO_CONTENT)

        # File deleted from disk
        self.assertFalse(file_path.exists())

        # Record soft-deleted and hidden from GET
        sub.refresh_from_db()
        self.assertTrue(sub.is_deleted)
        self.assertIsNotNone(sub.deleted_at)

        res_get = self.client.get(f"/api/v1/practice/submissions/{sub_id}/")
        self.assertEqual(res_get.status_code, status.HTTP_404_NOT_FOUND)

    def test_upload_throttling_works(self):
        self.client.force_authenticate(user=self.learner)

        # Throttle set to 3/hour for this test
        with override_settings(
            REST_FRAMEWORK={
                **settings.REST_FRAMEWORK,
                'DEFAULT_THROTTLE_RATES': {
                    **settings.REST_FRAMEWORK.get('DEFAULT_THROTTLE_RATES', {}),
                    'upload': '3/hour',
                },
            }
        ):
            for i in range(3):
                file = SimpleUploadedFile(f"practice_{i}.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
                res = self.client.post(
                    "/api/v1/practice/submissions/",
                    {"procedure": self.procedure.procedure_code, "video": file},
                    format="multipart",
                )
                self.assertEqual(res.status_code, status.HTTP_201_CREATED)

            # 4th request must be throttled
            file_throttled = SimpleUploadedFile("throttled.mp4", TINY_MP4_CONTENT, content_type="video/mp4")
            res_throttled = self.client.post(
                "/api/v1/practice/submissions/",
                {"procedure": self.procedure.procedure_code, "video": file_throttled},
                format="multipart",
            )
            self.assertEqual(res_throttled.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
