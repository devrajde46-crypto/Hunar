import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class StepScore(models.Model):
    class AIStatus(models.TextChoices):
        CORRECT = 'CORRECT', _('Correct')
        INCORRECT = 'INCORRECT', _('Incorrect')
        INCONCLUSIVE = 'INCONCLUSIVE', _('Inconclusive')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(
        'practice.PracticeSubmission',
        on_delete=models.CASCADE,
        related_name='step_scores',
    )
    procedure_step = models.ForeignKey(
        'courses.ProcedureStep',
        on_delete=models.PROTECT,
        related_name='scores',
    )
    ai_status = models.CharField(
        max_length=20,
        choices=AIStatus.choices,
    )
    confidence_score = models.FloatField(default=0.0)
    timestamp_start = models.FloatField(null=True, blank=True)
    timestamp_end = models.FloatField(null=True, blank=True)
    ai_feedback = models.TextField(blank=True, default='')
    trainer_override = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'step_scores'
        ordering = ['procedure_step__step_number']
        unique_together = ('submission', 'procedure_step')
        indexes = [
            models.Index(
                fields=['submission', 'procedure_step'],
                name='idx_step_scores_sub_step',
            ),
        ]
        verbose_name = _('Step Score')
        verbose_name_plural = _('Step Scores')

    def __str__(self):
        return f"{self.procedure_step.step_code}: {self.get_ai_status_display()} ({self.confidence_score:.2f})"


class TrainerReview(models.Model):
    class FinalGrade(models.TextChoices):
        COMPETENT = 'COMPETENT', _('Competent / Pass')
        NOT_YET_COMPETENT = 'NOT_YET_COMPETENT', _('Not Yet Competent')
        SAFETY_FAIL = 'SAFETY_FAIL', _('Safety Fail')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.OneToOneField(
        'practice.PracticeSubmission',
        on_delete=models.CASCADE,
        related_name='trainer_review',
    )
    trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='reviews_given',
    )
    final_grade = models.CharField(
        max_length=20,
        choices=FinalGrade.choices,
    )
    trainer_comments = models.TextField(blank=True, default='')
    is_overridden = models.BooleanField(default=False)
    step_overrides = models.JSONField(default=dict, blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'trainer_reviews'
        ordering = ['-reviewed_at']
        verbose_name = _('Trainer Review')
        verbose_name_plural = _('Trainer Reviews')

    def __str__(self):
        return f"Review for {self.submission.id} - {self.get_final_grade_display()}"
