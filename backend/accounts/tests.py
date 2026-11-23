import uuid
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from practice.models import ConsentRecord
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


class AuthAPITests(APITestCase):
    def setUp(self):
        self.institution = Institution.objects.create(
            name="Government ITI Mumbai",
            code="GITI-MUMBAI",
            contact_email="admin@giti-mumbai.edu",
        )
        self.user_password = "SecurePassword123!"
        self.learner = User.objects.create_user(
            username="existing_learner",
            email="existing@iti.edu",
            password=self.user_password,
            role=User.Role.LEARNER,
            institution=self.institution,
        )

    def test_health_check_endpoint(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_registration_always_creates_learner_and_consent(self):
        payload = {
            "username": "new_trainee",
            "email": "new.trainee@iti.edu",
            "password": "StrongPassword2026!",
            "first_name": "Rohan",
            "last_name": "Joshi",
            "role": "SUPER_ADMIN",  # Attempting privilege escalation
            "trainee_id_number": "TRN-999",
            "institution_code": "GITI-MUMBAI",
            "consent": {
                "consent_version": "v1.0-2026",
                "is_granted": True,
            },
        }
        response = self.client.post(reverse('auth_register'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data['role'], 'LEARNER')  # Role MUST be forced to LEARNER
        self.assertEqual(data['institution']['code'], 'GITI-MUMBAI')
        self.assertTrue(data['consent_granted'])

        # Verify database record
        created_user = User.objects.get(username='new_trainee')
        self.assertEqual(created_user.role, User.Role.LEARNER)
        self.assertTrue(ConsentRecord.objects.filter(user=created_user, is_granted=True).exists())

    def test_registration_does_not_reveal_email_existence(self):
        payload = {
            "username": "unique_username_123",
            "email": "existing@iti.edu",  # Already taken
            "password": "StrongPassword2026!",
            "institution_code": "GITI-MUMBAI",
        }
        response = self.client.post(reverse('auth_register'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_msg = str(response.json())
        self.assertIn("Unable to complete registration with the provided details.", error_msg)
        self.assertNotIn("Email already exists", error_msg)

    def test_registration_password_validation(self):
        payload = {
            "username": "weak_user",
            "email": "weak@iti.edu",
            "password": "123",  # Too short
            "institution_code": "GITI-MUMBAI",
        }
        response = self.client.post(reverse('auth_register'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.json())

    def test_login_success(self):
        payload = {
            "username": "existing_learner",
            "password": self.user_password,
        }
        response = self.client.post(reverse('auth_login'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertEqual(data['user']['role'], 'LEARNER')
        self.assertEqual(data['user']['institution_name'], 'Government ITI Mumbai')

    def test_login_refused_for_soft_deleted_user(self):
        deleted_user = User.objects.create_user(
            username="deleted_user",
            email="deleted@iti.edu",
            password=self.user_password,
            is_deleted=True,
            institution=self.institution,
        )
        payload = {
            "username": "deleted_user",
            "password": self.user_password,
        }
        response = self.client.post(reverse('auth_login'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("No active account found with the given credentials.", str(response.json()))

    def test_login_refused_for_inactive_user(self):
        inactive_user = User.objects.create_user(
            username="inactive_user",
            email="inactive@iti.edu",
            password=self.user_password,
            is_active=False,
            institution=self.institution,
        )
        payload = {
            "username": "inactive_user",
            "password": self.user_password,
        }
        response = self.client.post(reverse('auth_login'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("No active account found with the given credentials.", str(response.json()))

    def test_token_refresh_and_logout_blacklisting(self):
        # Login
        login_res = self.client.post(
            reverse('auth_login'),
            {"username": "existing_learner", "password": self.user_password},
            format='json',
        )
        access_token = login_res.json()['access']
        refresh_token = login_res.json()['refresh']

        # Refresh
        refresh_res = self.client.post(
            reverse('token_refresh'),
            {"refresh": refresh_token},
            format='json',
        )
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        new_access = refresh_res.json()['access']
        new_refresh = refresh_res.json()['refresh']

        # Access /me
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access}')
        me_res = self.client.get(reverse('auth_me'))
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.json()['username'], 'existing_learner')

        # Logout with new_refresh
        logout_res = self.client.post(
            reverse('auth_logout'),
            {"refresh": new_refresh},
            format='json',
        )
        self.assertEqual(logout_res.status_code, status.HTTP_204_NO_CONTENT)

        # Attempt to use blacklisted refresh token
        fail_res = self.client.post(
            reverse('token_refresh'),
            {"refresh": new_refresh},
            format='json',
        )
        self.assertEqual(fail_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_old_refresh_token_rejected_after_rotation(self):
        login_res = self.client.post(
            reverse('auth_login'),
            {"username": "existing_learner", "password": self.user_password},
            format='json',
        )
        original_refresh = login_res.json()['refresh']

        # Rotate token
        rotate_res = self.client.post(
            reverse('token_refresh'),
            {"refresh": original_refresh},
            format='json',
        )
        self.assertEqual(rotate_res.status_code, status.HTTP_200_OK)

        # Attempt to use the old (rotated) refresh token
        replay_res = self.client.post(
            reverse('token_refresh'),
            {"refresh": original_refresh},
            format='json',
        )
        self.assertEqual(replay_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_requests_return_401(self):
        # Accessing protected /me without credentials must fail with 401
        self.client.credentials()  # Clear auth
        response = self.client.get(reverse('auth_me'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_learner_profile_access_control(self):
        other_user = User.objects.create_user(
            username="other_trainee",
            email="other.trainee@iti.edu",
            password="OtherPassword123!",
            role=User.Role.LEARNER,
            trainee_id_number="TRN-OTHER-001",
            institution=self.institution,
        )

        # Authenticate as existing_learner
        self.client.force_authenticate(user=self.learner)
        res1 = self.client.get(reverse('auth_me'))
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertEqual(res1.json()['username'], "existing_learner")
        self.assertNotEqual(res1.json()['username'], "other_trainee")

        # Authenticate as other_user
        self.client.force_authenticate(user=other_user)
        res2 = self.client.get(reverse('auth_me'))
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.json()['username'], "other_trainee")
        self.assertEqual(res2.json()['trainee_id_number'], "TRN-OTHER-001")

