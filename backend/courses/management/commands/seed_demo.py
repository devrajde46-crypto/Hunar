"""
Management command to seed initial demo data for Hunar.
Populates Demo ITI, Electrical Wiring trade, Domestic Wiring module,
and 4 standard electrical procedures with 39 steps from docs/phase1/procedures/.

Idempotent: Uses update_or_create throughout so running multiple times
updates existing records without creating duplicates.
Does NOT create any user accounts.
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import Institution
from courses.models import Trade, Module, Procedure, ProcedureStep
from courses.management.commands.seed_data import (
    INSTITUTION_DATA,
    TRADE_DATA,
    MODULE_DATA,
    PROCEDURES_DATA,
)


class Command(BaseCommand):
    help = 'Seeds standard demo training content (institution, trade, module, procedures, steps).'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data for Hunar...')

        # 1. Institution
        inst_defaults = {k: v for k, v in INSTITUTION_DATA.items() if k != 'code'}
        institution, inst_created = Institution.objects.update_or_create(
            code=INSTITUTION_DATA['code'],
            defaults=inst_defaults,
        )
        inst_status = 'created' if inst_created else 'updated'
        self.stdout.write(f"  Institution '{institution.name}' ({institution.code}): {inst_status}")

        # 2. Trade
        trade_defaults = {k: v for k, v in TRADE_DATA.items() if k != 'code'}
        trade_defaults['institution'] = institution
        trade, trade_created = Trade.objects.update_or_create(
            institution=institution,
            code=TRADE_DATA['code'],
            defaults=trade_defaults,
        )
        trade_status = 'created' if trade_created else 'updated'
        self.stdout.write(f"  Trade '{trade.name}' ({trade.code}): {trade_status}")

        # 3. Module
        module_defaults = {k: v for k, v in MODULE_DATA.items() if k != 'sequence_order'}
        module_defaults['trade'] = trade
        module, mod_created = Module.objects.update_or_create(
            trade=trade,
            sequence_order=MODULE_DATA['sequence_order'],
            defaults=module_defaults,
        )
        mod_status = 'created' if mod_created else 'updated'
        self.stdout.write(f"  Module '{module.title}' (seq {module.sequence_order}): {mod_status}")

        # 4. Procedures & Steps
        total_procs = 0
        total_steps = 0

        for proc_data in PROCEDURES_DATA:
            steps_list = proc_data.get('steps', [])
            proc_fields = {k: v for k, v in proc_data.items() if k not in ('steps', 'procedure_code')}
            proc_fields['module'] = module

            procedure, proc_created = Procedure.objects.update_or_create(
                procedure_code=proc_data['procedure_code'],
                defaults=proc_fields,
            )
            total_procs += 1

            for step_data in steps_list:
                step_fields = {k: v for k, v in step_data.items() if k != 'step_number'}
                ProcedureStep.objects.update_or_create(
                    procedure=procedure,
                    step_number=step_data['step_number'],
                    defaults=step_fields,
                )
                total_steps += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDemo data seeding complete!\n"
                f"  Institutions: 1\n"
                f"  Trades: 1\n"
                f"  Modules: 1\n"
                f"  Procedures: {total_procs}\n"
                f"  Procedure Steps: {total_steps}\n"
                f"\nNote: No user accounts were created (per security guidelines).\n"
                f"To create an administrative user, run:\n"
                f"  python manage.py createsuperuser"
            )
        )
