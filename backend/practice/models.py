import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class ConsentRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='consent_records',
    )
    consent_version = models.CharField(max_length=20)
    is_granted = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default='')
    granted_at = models.DateTimeField(auto_now_add=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'consent_records'
        ordering = ['-granted_at']
        verbose_name = _('Consent Record')
        verbose_name_plural = _('Consent Records')

    def __str__(self):
        status = 'Granted' if self.is_granted and not self.revoked_at else 'Revoked/Denied'
        return f"Consent for {self.user.username} ({self.consent_version}) - {status}"


class PracticeSubmission(models.Model):
    class Status(models.TextChoices):
        UPLOADED = 'UPLOADED', _('Uploaded')
        QUEUED = 'QUEUED', _('Queued')
        PROCESSING = 'PROCESSING', _('Processing')
        SCORED = 'SCORED', _('Scored')
        REVIEWED = 'REVIEWED', _('Reviewed')
        FAILED = 'FAILED', _('Failed')

    class OverallVerdict(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        PASS = 'PASS', _('Pass')
        NEEDS_PRACTICE = 'NEEDS_PRACTICE', _('Needs Practice')
        SAFETY_VIOLATION = 'SAFETY_VIOLATION', _('Safety Violation')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    procedure = models.ForeignKey(
        'courses.Procedure',
        on_delete=models.PROTECT,
        related_name='submissions',
    )
    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='practice_submissions',
    )
    consent_record = models.ForeignKey(
        ConsentRecord,
        on_delete=models.PROTECT,
        related_name='practice_submissions',
        null=True,
        blank=True,
    )
    video_file_path = models.CharField(
        max_length=512,
        blank=True,
        default='',
        help_text=_('Relative path under HUNAR_MEDIA_ROOT (never absolute, never client filename)'),
    )
    video_file_url = models.CharField(max_length=1024, blank=True, default='')
    video_duration_seconds = models.FloatField(null=True, blank=True)
    duration_seconds = models.FloatField(
        null=True,
        blank=True,
        help_text=_('Video duration in seconds (extracted in Part C)'),
    )
    file_size_bytes = models.BigIntegerField(null=True, blank=True)
    video_format = models.CharField(max_length=20, default='mp4')
    content_type = models.CharField(max_length=100, default='video/mp4')
    sha256 = models.CharField(max_length=64, blank=True, default='')
    failure_reason = models.CharField(max_length=500, null=True, blank=True)
    processing_status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.UPLOADED,
    )
    overall_ai_verdict = models.CharField(
        max_length=30,
        choices=OverallVerdict.choices,
        default=OverallVerdict.PENDING,
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'practice_submissions'
        ordering = ['-submitted_at']
        indexes = [
            models.Index(
                fields=['processing_status', 'overall_ai_verdict', '-submitted_at'],
                name='idx_sub_status_verdict',
            ),
            models.Index(
                fields=['learner', 'procedure', '-submitted_at'],
                name='idx_sub_learner_proc',
            ),
        ]
        verbose_name = _('Practice Submission')
        verbose_name_plural = _('Practice Submissions')

    def __str__(self):
        return f"Submission {self.id} - {self.procedure.procedure_code} ({self.get_processing_status_display()})"
