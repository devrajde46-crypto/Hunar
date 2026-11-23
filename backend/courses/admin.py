from django.contrib import admin
from .models import Trade, Module, Procedure, ProcedureStep


class ProcedureStepInline(admin.TabularInline):
    model = ProcedureStep
    extra = 1
    fields = (
        'step_number',
        'step_code',
        'title',
        'expected_tool',
        'is_safety_critical',
        'hold_duration_seconds',
    )
    ordering = ('step_number',)


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'institution', 'is_active', 'created_at')
    list_filter = ('institution', 'is_active')
    search_fields = ('name', 'code', 'description')
    ordering = ('name',)


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'trade', 'sequence_order', 'is_active', 'created_at')
    list_filter = ('trade', 'is_active')
    search_fields = ('title', 'description')
    ordering = ('trade', 'sequence_order')


@admin.register(Procedure)
class ProcedureAdmin(admin.ModelAdmin):
    list_display = (
        'procedure_code',
        'title',
        'module',
        'difficulty',
        'estimated_duration_minutes',
        'is_active',
        'created_at',
    )
    list_filter = ('module__trade', 'difficulty', 'is_active')
    search_fields = ('procedure_code', 'title', 'description', 'safety_instructions')
    ordering = ('procedure_code',)
    inlines = [ProcedureStepInline]


@admin.register(ProcedureStep)
class ProcedureStepAdmin(admin.ModelAdmin):
    list_display = (
        'procedure',
        'step_number',
        'step_code',
        'title',
        'is_safety_critical',
        'expected_tool',
    )
    list_filter = ('procedure', 'is_safety_critical')
    search_fields = ('step_code', 'title', 'description', 'visual_evidence_cue')
    ordering = ('procedure', 'step_number')
