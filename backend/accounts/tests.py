import uuid
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from .models import Institution

User = get_user_model()


class InstitutionModelTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(
            name="Government ITI Mumbai",
            code="GITI-MUMBAI",
            address="Kurla, Mumbai, Maharashtra",
            contact_email="principal@giti-mumbai.edu",
        )

    def test_institution_creation(self):
        self.assertIsInstance(self.institution.id, uuid.UUID)
        self.assertEqual(self.institution.name, "Government ITI Mumbai")
        self.assertEqual(self.institution.code, "GITI-MUMBAI")
        self.assertTrue(self.institution.is_active)
        self.assertEqual(str(self.institution), "Government ITI Mumbai (GITI-MUMBAI)")


class CustomUserModelTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(
            name="Government ITI Pune",
            code="GITI-PUNE",
            contact_email="admin@giti-pune.edu",
        )
        self.learner = User.objects.create_user(
            username="devraj_sharma",
            email="devraj.sharma@iti.edu",
            password="SecurePassword123!",
            role=User.Role.LEARNER,
            trainee_id_number="TRN-2026-045",
            phone_number="+919876543210",
            institution=self.institution,
        )

    def test_user_creation_and_auth_user_model(self):
        self.assertEqual(User, get_user_model())
        self.assertIsInstance(self.learner.id, uuid.UUID)
        self.assertEqual(self.learner.role, User.Role.LEARNER)
        self.assertEqual(self.learner.trainee_id_number, "TRN-2026-045")
        self.assertEqual(self.learner.institution, self.institution)
        self.assertTrue(self.learner.is_active)
        self.assertFalse(self.learner.is_deleted)
        self.assertIsNone(self.learner.deleted_at)
        self.assertIn("devraj_sharma (Learner)", str(self.learner))

    def test_trainer_and_admin_roles(self):
        trainer = User.objects.create_user(
            username="rk_verma",
            email="rk.verma@iti.edu",
            password="SecurePassword123!",
            role=User.Role.TRAINER,
            institution=self.institution,
        )
        self.assertEqual(trainer.role, User.Role.TRAINER)

        inst_admin = User.objects.create_user(
            username="principal_pune",
            email="principal@iti.edu",
            password="SecurePassword123!",
            role=User.Role.INSTITUTION_ADMIN,
            institution=self.institution,
        )
        self.assertEqual(inst_admin.role, User.Role.INSTITUTION_ADMIN)

    def test_user_soft_delete(self):
        self.learner.is_deleted = True
        self.learner.deleted_at = timezone.now()
        self.learner.save()

        refreshed = User.objects.get(id=self.learner.id)
        self.assertTrue(refreshed.is_deleted)
        self.assertIsNotNone(refreshed.deleted_at)
