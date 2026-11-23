import uuid
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase
from accounts.models import Institution
from courses.models import Trade, Module, Procedure, ProcedureStep
from practice.models import PracticeSubmission
from .models import StepScore, TrainerReview

User = get_user_model()


class AssessmentModelTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(
            name="Government ITI Mumbai",
            code="GITI-MUMBAI",
            contact_email="principal@giti-mumbai.edu",
        )
        self.learner = User.objects.create_user(
            username="learner_devraj",
            email="devraj@iti.edu",
            password="SecurePassword123!",
            role=User.Role.LEARNER,
            institution=self.institution,
        )
        self.trainer = User.objects.create_user(
            username="trainer_verma",
            email="verma@iti.edu",
            password="SecurePassword123!",
            role=User.Role.TRAINER,
            institution=self.institution,
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
            procedure_code="PROC-ELEC-01",
            title="Single-Pole Switch & Lamp",
            safety_instructions="Isolate first.",
        )
        self.step = ProcedureStep.objects.create(
            procedure=self.procedure,
            step_number=1,
            step_code="SWS-01",
            title="Verify Isolation",
            description="Dead circuit test",
            visual_evidence_cue="Multimeter 0.0V",
            is_safety_critical=True,
        )
        self.submission = PracticeSubmission.objects.create(
            procedure=self.procedure,
            learner=self.learner,
            processing_status=PracticeSubmission.Status.SCORED,
        )

    def test_step_score_creation_and_status_choices(self):
        score = StepScore.objects.create(
            submission=self.submission,
            procedure_step=self.step,
            ai_status=StepScore.AIStatus.CORRECT,
            confidence_score=0.95,
            timestamp_start=10.0,
            timestamp_end=25.0,
            ai_feedback="Isolation verified correctly.",
        )
        self.assertIsInstance(score.id, uuid.UUID)
        self.assertEqual(score.ai_status, StepScore.AIStatus.CORRECT)
        self.assertIn("SWS-01: Correct (0.95)", str(score))

    def test_step_score_unique_together(self):
        StepScore.objects.create(
            submission=self.submission,
            procedure_step=self.step,
            ai_status=StepScore.AIStatus.CORRECT,
            confidence_score=0.90,
        )
        with self.assertRaises(IntegrityError):
            StepScore.objects.create(
                submission=self.submission,
                procedure_step=self.step,
                ai_status=StepScore.AIStatus.INCORRECT,
                confidence_score=0.50,
            )

    def test_trainer_review_creation_and_final_grade(self):
        review = TrainerReview.objects.create(
            submission=self.submission,
            trainer=self.trainer,
            final_grade=TrainerReview.FinalGrade.COMPETENT,
            trainer_comments="Excellent cable stripping and terminal torque.",
            is_overridden=False,
        )
        self.assertIsInstance(review.id, uuid.UUID)
        self.assertEqual(review.final_grade, TrainerReview.FinalGrade.COMPETENT)
        self.assertIn(f"Review for {self.submission.id}", str(review))
        self.assertIn("Competent / Pass", str(review))
