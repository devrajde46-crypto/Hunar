from django.contrib import admin
from .models import StepScore, TrainerReview


@admin.register(StepScore)
class StepScoreAdmin(admin.ModelAdmin):
    list_display = (
        'submission',
        'procedure_step',
        'ai_status',
        'confidence_score',
        'trainer_override',
        'timestamp_start',
        'timestamp_end',
    )
    list_filter = ('ai_status', 'trainer_override', 'procedure_step__is_safety_critical')
    search_fields = (
        'submission__id',
        'procedure_step__step_code',
        'procedure_step__title',
        'ai_feedback',
    )
    ordering = ('submission', 'procedure_step__step_number')


@admin.register(TrainerReview)
class TrainerReviewAdmin(admin.ModelAdmin):
    list_display = (
        'submission',
        'trainer',
        'final_grade',
        'is_overridden',
        'reviewed_at',
    )
    list_filter = ('final_grade', 'is_overridden', 'reviewed_at')
    search_fields = (
        'submission__id',
        'trainer__username',
        'trainer__email',
        'trainer_comments',
    )
    ordering = ('-reviewed_at',)
