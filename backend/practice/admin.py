from django.contrib import admin
from .models import ConsentRecord, PracticeSubmission


@admin.register(ConsentRecord)
class ConsentRecordAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'consent_version',
        'is_granted',
        'ip_address',
        'granted_at',
        'revoked_at',
    )
    list_filter = ('is_granted', 'consent_version', 'granted_at')
    search_fields = ('user__username', 'user__email', 'ip_address')
    ordering = ('-granted_at',)


@admin.register(PracticeSubmission)
class PracticeSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'learner',
        'procedure',
        'processing_status',
        'overall_ai_verdict',
        'submitted_at',
        'is_deleted',
    )
    list_filter = (
        'processing_status',
        'overall_ai_verdict',
        'is_deleted',
        'procedure__module__trade',
    )
    search_fields = (
        'id',
        'learner__username',
        'learner__trainee_id_number',
        'procedure__procedure_code',
        'procedure__title',
    )
    ordering = ('-submitted_at',)
