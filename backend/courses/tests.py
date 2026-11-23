import uuid
from django.db import IntegrityError
from django.test import TestCase
from accounts.models import Institution
from .models import Trade, Module, Procedure, ProcedureStep


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
