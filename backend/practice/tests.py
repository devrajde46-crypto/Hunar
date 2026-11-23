import uuid
from django.contrib.auth import get_user_model
from django.test import TestCase
from accounts.models import Institution
from courses.models import Trade, Module, Procedure
from .models import ConsentRecord, PracticeSubmission

User = get_user_model()


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
            video_file_url="submissions/2026/11/23/socket_test.mp4",
            video_duration_seconds=360.5,
            file_size_bytes=84000000,
            processing_status=PracticeSubmission.Status.UPLOADED,
            overall_ai_verdict=PracticeSubmission.OverallVerdict.PENDING,
        )
        self.assertIsInstance(submission.id, uuid.UUID)
        self.assertEqual(submission.processing_status, PracticeSubmission.Status.UPLOADED)
        self.assertIn("Uploaded", str(submission))

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
