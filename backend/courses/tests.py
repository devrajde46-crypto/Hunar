import uuid
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import Institution
from .models import Trade, Module, Procedure, ProcedureStep

User = get_user_model()


class CoursesModelTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(
            name="Government ITI Mumbai",
            code="GITI-MUMBAI",
            contact_email="principal@giti-mumbai.edu",
        )
        self.trade = Trade.objects.create(
            institution=self.institution,
            name="Electrician",
            code="ELEC",
            description="Domestic and light commercial wiring",
        )
        self.module = Module.objects.create(
            trade=self.trade,
            title="Domestic Wiring & Installation",
            sequence_order=1,
            description="Switch and socket basic installations",
        )
        self.procedure = Procedure.objects.create(
            module=self.module,
            procedure_code="PROC-ELEC-01",
            title="Single-Pole Switch Controlling a Batten Lamp",
            description="Wire SPST switch and lamp holder",
            difficulty=Procedure.Difficulty.BEGINNER,
            estimated_duration_minutes=20,
            safety_instructions="Supply must be verified dead before touching terminals.",
            required_tools=["1000V Pliers", "Wire Stripper", "Multimeter"],
        )

    def test_trade_creation_and_str(self):
        self.assertIsInstance(self.trade.id, uuid.UUID)
        self.assertEqual(str(self.trade), "Electrician (ELEC)")

    def test_module_creation_and_str(self):
        self.assertIsInstance(self.module.id, uuid.UUID)
        self.assertEqual(str(self.module), "ELEC - Module 1: Domestic Wiring & Installation")

    def test_procedure_creation_and_str(self):
        self.assertIsInstance(self.procedure.id, uuid.UUID)
        self.assertEqual(str(self.procedure), "PROC-ELEC-01: Single-Pole Switch Controlling a Batten Lamp")
        self.assertEqual(self.procedure.difficulty, Procedure.Difficulty.BEGINNER)

    def test_procedure_step_creation_and_safety_flag(self):
        step1 = ProcedureStep.objects.create(
            procedure=self.procedure,
            step_number=1,
            step_code="SWS-01",
            title="Verify Supply Isolation",
            description="Use multimeter to confirm 0.0V AC.",
            expected_tool="Digital Multimeter",
            visual_evidence_cue="Disconnected plug and multimeter reading 0.0V in frame.",
            is_safety_critical=True,
            hold_duration_seconds=2,
        )
        self.assertTrue(step1.is_safety_critical)
        self.assertEqual(str(step1), "PROC-ELEC-01 - Step 1: Verify Supply Isolation")

        step2 = ProcedureStep.objects.create(
            procedure=self.procedure,
            step_number=2,
            step_code="SWS-02",
            title="Inspect Tools & Materials",
            description="Visually inspect insulation of tools and switch body.",
            expected_tool="Visual Inspection",
            visual_evidence_cue="Holding up screwdriver and switch body.",
            is_safety_critical=False,
            hold_duration_seconds=2,
        )
        self.assertFalse(step2.is_safety_critical)

    def test_unique_step_order_constraint(self):
        ProcedureStep.objects.create(
            procedure=self.procedure,
            step_number=1,
            step_code="SWS-01",
            title="Step One",
            description="First step",
            visual_evidence_cue="Evidence 1",
            is_safety_critical=True,
        )
        with self.assertRaises(IntegrityError):
            ProcedureStep.objects.create(
                procedure=self.procedure,
                step_number=1,
                step_code="SWS-01-DUP",
                title="Duplicate Step Number",
                description="Duplicate order number step",
                visual_evidence_cue="Evidence duplicate",
                is_safety_critical=False,
            )


class CourseAPITests(APITestCase):
    def setUp(self):
        # Institution A
        self.inst_a = Institution.objects.create(
            name="Government ITI Mumbai",
            code="GITI-MUMBAI",
            contact_email="admin@mumbai.edu",
        )
        self.learner_a = User.objects.create_user(
            username="learner_a",
            email="learner_a@mumbai.edu",
            password="SecurePassword123!",
            role=User.Role.LEARNER,
            institution=self.inst_a,
        )
        self.trainer_a = User.objects.create_user(
            username="trainer_a",
            email="trainer_a@mumbai.edu",
            password="SecurePassword123!",
            role=User.Role.TRAINER,
            institution=self.inst_a,
        )

        # Institution B
        self.inst_b = Institution.objects.create(
            name="Government ITI Pune",
            code="GITI-PUNE",
            contact_email="admin@pune.edu",
        )
        self.learner_b = User.objects.create_user(
            username="learner_b",
            email="learner_b@pune.edu",
            password="SecurePassword123!",
            role=User.Role.LEARNER,
            institution=self.inst_b,
        )

        # Content in Inst A
        self.trade_a = Trade.objects.create(
            institution=self.inst_a,
            name="Electrician",
            code="ELEC",
        )
        self.module_a = Module.objects.create(
            trade=self.trade_a,
            title="Domestic Wiring",
            sequence_order=1,
        )
        self.proc_a = Procedure.objects.create(
            module=self.module_a,
            procedure_code="PROC-ELEC-01",
            title="Switch and Lamp",
            description="Single pole switch",
            safety_instructions="Isolate first.",
        )
        self.step_a = ProcedureStep.objects.create(
            procedure=self.proc_a,
            step_number=1,
            step_code="SWS-01",
            title="Isolate Supply",
            description="Check voltage",
            visual_evidence_cue="Multimeter 0.0V",
            is_safety_critical=True,
        )

    def test_learner_can_list_own_institution_procedures(self):
        self.client.force_authenticate(user=self.learner_a)
        response = self.client.get(reverse('procedure-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['procedure_code'], "PROC-ELEC-01")
        self.assertEqual(data['results'][0]['total_steps'], 1)
        self.assertEqual(data['results'][0]['safety_critical_steps_count'], 1)

    def test_users_never_see_another_institution_content(self):
        # Learner B from Inst B queries procedures
        self.client.force_authenticate(user=self.learner_b)
        response = self.client.get(reverse('procedure-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should be empty because Inst B has no procedures
        self.assertEqual(response.json()['count'], 0)

        # Learner B tries to retrieve Inst A procedure directly
        detail_res = self.client.get(reverse('procedure-detail', args=['PROC-ELEC-01']))
        self.assertEqual(detail_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_learner_cannot_create_or_modify_procedures(self):
        self.client.force_authenticate(user=self.learner_a)
        payload = {
            "module": str(self.module_a.id),
            "procedure_code": "PROC-ELEC-99",
            "title": "Hacked Procedure",
            "description": "Unauthorized",
            "safety_instructions": "None",
        }
        res = self.client.post(reverse('procedure-list'), payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_trainer_can_create_procedure_in_own_institution(self):
        self.client.force_authenticate(user=self.trainer_a)
        payload = {
            "module": str(self.module_a.id),
            "procedure_code": "PROC-ELEC-02",
            "title": "Socket Installation",
            "description": "3-pin socket",
            "safety_instructions": "Verify earth.",
        }
        res = self.client.post(reverse('procedure-list'), payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.json()['procedure_code'], "PROC-ELEC-02")

    def test_procedure_deactivation_instead_of_hard_delete(self):
        self.client.force_authenticate(user=self.trainer_a)
        delete_res = self.client.delete(reverse('procedure-detail', args=['PROC-ELEC-01']))
        self.assertEqual(delete_res.status_code, status.HTTP_204_NO_CONTENT)

        # Verify procedure still exists in DB but is inactive
        self.proc_a.refresh_from_db()
        self.assertFalse(self.proc_a.is_active)

        # Deactivated procedure is hidden from normal list
        list_res = self.client.get(reverse('procedure-list'))
        self.assertEqual(list_res.json()['count'], 0)

    def test_protected_delete_returns_409_conflict(self):
        # Trade is referenced by Module with CASCADE, but let's test deleting module directly
        # Procedure has module with PROTECT
        # If someone directly tries to delete module_a via ORM or a protected delete view,
        # our custom exception handler catches ProtectedError and returns 409
        from django.db.models import ProtectedError
        from config.exceptions import custom_exception_handler
        from rest_framework.views import APIView

        class DummyView(APIView):
            pass

        exc = ProtectedError("Cannot delete module because procedures reference it.", [self.proc_a])
        response = custom_exception_handler(exc, {'view': DummyView()})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['error']['code'], 'PROTECTED_RESOURCE')

    def test_unauthenticated_course_access_returns_401(self):
        self.client.credentials()  # Clear auth
        trade_res = self.client.get(reverse('trade-list'))
        self.assertEqual(trade_res.status_code, status.HTTP_401_UNAUTHORIZED)
        proc_res = self.client.get(reverse('procedure-list'))
        self.assertEqual(proc_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_learner_can_read_trades_modules_procedures_steps(self):
        self.client.force_authenticate(user=self.learner_a)
        # Trades
        trades_res = self.client.get(reverse('trade-list'))
        self.assertEqual(trades_res.status_code, status.HTTP_200_OK)
        self.assertEqual(trades_res.json()['count'], 1)
        self.assertEqual(trades_res.json()['results'][0]['code'], 'ELEC')

        # Modules
        modules_res = self.client.get(reverse('module-list'))
        self.assertEqual(modules_res.status_code, status.HTTP_200_OK)
        self.assertEqual(modules_res.json()['count'], 1)

        # Procedures
        procs_res = self.client.get(reverse('procedure-list'))
        self.assertEqual(procs_res.status_code, status.HTTP_200_OK)
        self.assertEqual(procs_res.json()['count'], 1)

        # Steps
        steps_res = self.client.get(reverse('step-list'))
        self.assertEqual(steps_res.status_code, status.HTTP_200_OK)
        self.assertEqual(steps_res.json()['count'], 1)

    def test_learner_cannot_create_update_or_delete_content(self):
        self.client.force_authenticate(user=self.learner_a)
        # Cannot create trade
        t_res = self.client.post(reverse('trade-list'), {"name": "Plumbing", "code": "PLUMB"}, format='json')
        self.assertEqual(t_res.status_code, status.HTTP_403_FORBIDDEN)

        # Cannot update trade
        tu_res = self.client.patch(reverse('trade-detail', args=[self.trade_a.id]), {"name": "Hacked"}, format='json')
        self.assertEqual(tu_res.status_code, status.HTTP_403_FORBIDDEN)

        # Cannot delete trade
        td_res = self.client.delete(reverse('trade-detail', args=[self.trade_a.id]))
        self.assertEqual(td_res.status_code, status.HTTP_403_FORBIDDEN)

        # Cannot create step
        s_res = self.client.post(
            reverse('step-list'),
            {
                "procedure": str(self.proc_a.id),
                "step_number": 2,
                "step_code": "SWS-02",
                "title": "Hacked Step",
                "description": "Unauthorized",
                "visual_evidence_cue": "Cue",
            },
            format='json',
        )
        self.assertEqual(s_res.status_code, status.HTTP_403_FORBIDDEN)

        # Cannot update step
        su_res = self.client.patch(reverse('step-detail', args=[self.step_a.id]), {"title": "Hacked"}, format='json')
        self.assertEqual(su_res.status_code, status.HTTP_403_FORBIDDEN)

        # Cannot delete step
        sd_res = self.client.delete(reverse('step-detail', args=[self.step_a.id]))
        self.assertEqual(sd_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_trainer_can_create_update_and_deactivate_procedures_and_steps(self):
        self.client.force_authenticate(user=self.trainer_a)
        # Create step
        create_step_res = self.client.post(
            reverse('step-list'),
            {
                "procedure": str(self.proc_a.id),
                "step_number": 2,
                "step_code": "SWS-02",
                "title": "Strip Cable",
                "description": "Strip 10mm cleanly",
                "visual_evidence_cue": "Stripped conductor with zero nicks",
                "is_safety_critical": False,
            },
            format='json',
        )
        self.assertEqual(create_step_res.status_code, status.HTTP_201_CREATED)
        new_step_id = create_step_res.json()['id']

        # Update procedure
        patch_proc_res = self.client.patch(
            reverse('procedure-detail', args=['PROC-ELEC-01']),
            {"estimated_duration_minutes": 25},
            format='json',
        )
        self.assertEqual(patch_proc_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_proc_res.json()['estimated_duration_minutes'], 25)

        # Update step
        patch_step_res = self.client.patch(
            reverse('step-detail', args=[new_step_id]),
            {"title": "Strip Cable Cleanly"},
            format='json',
        )
        self.assertEqual(patch_step_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_step_res.json()['title'], "Strip Cable Cleanly")

    def test_trainer_cross_institution_isolation(self):
        # Create Trade, Module, Procedure in Inst B
        trade_b = Trade.objects.create(
            institution=self.inst_b,
            name="Welding",
            code="WELD",
        )
        mod_b = Module.objects.create(
            trade=trade_b,
            title="Arc Welding",
            sequence_order=1,
        )
        proc_b = Procedure.objects.create(
            module=mod_b,
            procedure_code="PROC-WELD-01",
            title="Arc Strike",
            safety_instructions="Wear helmet.",
        )
        step_b = ProcedureStep.objects.create(
            procedure=proc_b,
            step_number=1,
            step_code="WLD-01",
            title="Inspect Electrode",
            description="Inspect coating",
            visual_evidence_cue="Close-up of rod",
        )

        # Trainer A (from Inst A) should not see or be able to modify Inst B content
        self.client.force_authenticate(user=self.trainer_a)

        # Detail read -> 404
        get_res = self.client.get(reverse('procedure-detail', args=['PROC-WELD-01']))
        self.assertEqual(get_res.status_code, status.HTTP_404_NOT_FOUND)

        # Step read -> 404
        step_get_res = self.client.get(reverse('step-detail', args=[step_b.id]))
        self.assertEqual(step_get_res.status_code, status.HTTP_404_NOT_FOUND)

        # Patch -> 404
        patch_res = self.client.patch(reverse('procedure-detail', args=['PROC-WELD-01']), {"title": "Tampered"})
        self.assertEqual(patch_res.status_code, status.HTTP_404_NOT_FOUND)

        # Delete -> 404
        del_res = self.client.delete(reverse('procedure-detail', args=['PROC-WELD-01']))
        self.assertEqual(del_res.status_code, status.HTTP_404_NOT_FOUND)

        # Attempt to create procedure under Inst B module -> 403 Forbidden
        post_proc_res = self.client.post(
            reverse('procedure-list'),
            {
                "module": str(mod_b.id),
                "procedure_code": "PROC-WELD-99",
                "title": "Cross Institution Hijack",
                "description": "Cross-institution attempt",
                "safety_instructions": "None",
            },
            format='json',
        )
        self.assertEqual(post_proc_res.status_code, status.HTTP_403_FORBIDDEN)

        # Attempt to create step under Inst B procedure -> 403 Forbidden
        post_step_res = self.client.post(
            reverse('step-list'),
            {
                "procedure": str(proc_b.id),
                "step_number": 2,
                "step_code": "WLD-02",
                "title": "Cross Inst Step Hijack",
                "description": "None",
                "visual_evidence_cue": "None",
            },
            format='json',
        )
        self.assertEqual(post_step_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_inactive_records_hidden_from_list(self):
        # Create an inactive trade, module, and procedure
        inactive_trade = Trade.objects.create(
            institution=self.inst_a,
            name="Carpentry",
            code="CARP",
            is_active=False,
        )
        inactive_mod = Module.objects.create(
            trade=self.trade_a,
            title="Archived Module",
            sequence_order=99,
            is_active=False,
        )
        inactive_proc = Procedure.objects.create(
            module=self.module_a,
            procedure_code="PROC-ARCHIVED-01",
            title="Archived Procedure",
            safety_instructions="None",
            is_active=False,
        )
        ProcedureStep.objects.create(
            procedure=inactive_proc,
            step_number=1,
            step_code="ARC-01",
            title="Archived Step",
            description="Inactive step",
            visual_evidence_cue="None",
        )

        self.client.force_authenticate(user=self.trainer_a)

        # Inactive trade not in list
        t_res = self.client.get(reverse('trade-list'))
        codes = [t['code'] for t in t_res.json()['results']]
        self.assertNotIn("CARP", codes)

        # Inactive module not in list
        m_res = self.client.get(reverse('module-list'))
        mod_ids = [m['id'] for m in m_res.json()['results']]
        self.assertNotIn(str(inactive_mod.id), mod_ids)

        # Inactive procedure not in list
        p_res = self.client.get(reverse('procedure-list'))
        proc_codes = [p['procedure_code'] for p in p_res.json()['results']]
        self.assertNotIn("PROC-ARCHIVED-01", proc_codes)

        # Steps of inactive procedure not in list
        s_res = self.client.get(reverse('step-list'))
        step_codes = [s['step_code'] for s in s_res.json()['results']]
        self.assertNotIn("ARC-01", step_codes)

    def test_step_deletion_behavior_hard_delete_when_no_scores(self):
        # Create a fresh step without scores
        orphan_step = ProcedureStep.objects.create(
            procedure=self.proc_a,
            step_number=99,
            step_code="SWS-99",
            title="Temporary Draft Step",
            description="To be deleted",
            visual_evidence_cue="None",
        )
        step_id = orphan_step.id

        self.client.force_authenticate(user=self.trainer_a)
        res = self.client.delete(reverse('step-detail', args=[step_id]))
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

        # Confirms hard deletion: record is completely removed from database
        self.assertFalse(ProcedureStep.objects.filter(id=step_id).exists())

    def test_step_deletion_behavior_409_conflict_when_scores_exist(self):
        from practice.models import PracticeSubmission
        from assessments.models import StepScore

        # Create submission and score referencing step_a
        submission = PracticeSubmission.objects.create(
            procedure=self.proc_a,
            learner=self.learner_a,
            processing_status=PracticeSubmission.Status.SCORED,
        )
        StepScore.objects.create(
            submission=submission,
            procedure_step=self.step_a,
            ai_status=StepScore.AIStatus.CORRECT,
            confidence_score=0.95,
        )

        self.client.force_authenticate(user=self.trainer_a)
        res = self.client.delete(reverse('step-detail', args=[self.step_a.id]))

        # Must return 409 Conflict due to PROTECT relationship on StepScore.procedure_step
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(res.json()['error']['code'], 'PROTECTED_RESOURCE')

        # Verify step still exists in database
        self.assertTrue(ProcedureStep.objects.filter(id=self.step_a.id).exists())

    def test_seed_demo_command_idempotency(self):
        from django.core.management import call_command
        # Run seed command first time
        call_command('seed_demo')

        inst_count_1 = Institution.objects.filter(code='DEMO-ITI').count()
        demo_inst = Institution.objects.get(code='DEMO-ITI')
        trade_count_1 = Trade.objects.filter(institution=demo_inst, code='ELEC').count()
        proc_count_1 = Procedure.objects.filter(module__trade__institution=demo_inst).count()
        step_count_1 = ProcedureStep.objects.filter(procedure__module__trade__institution=demo_inst).count()

        self.assertEqual(inst_count_1, 1)
        self.assertEqual(trade_count_1, 1)
        self.assertEqual(proc_count_1, 4)
        self.assertEqual(step_count_1, 39)

        # Run seed command a second time
        call_command('seed_demo')

        inst_count_2 = Institution.objects.filter(code='DEMO-ITI').count()
        trade_count_2 = Trade.objects.filter(institution=demo_inst, code='ELEC').count()
        proc_count_2 = Procedure.objects.filter(module__trade__institution=demo_inst).count()
        step_count_2 = ProcedureStep.objects.filter(procedure__module__trade__institution=demo_inst).count()

        # Counts must be completely identical (no duplicates created)
        self.assertEqual(inst_count_1, inst_count_2)
        self.assertEqual(trade_count_1, trade_count_2)
        self.assertEqual(proc_count_1, proc_count_2)
        self.assertEqual(step_count_1, step_count_2)
