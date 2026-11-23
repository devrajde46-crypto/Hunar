import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _


class Trade(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    institution = models.ForeignKey(
        'accounts.Institution',
        on_delete=models.CASCADE,
        related_name='trades',
    )
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'trades'
        ordering = ['name']
        unique_together = ('institution', 'code')
        verbose_name = _('Trade')
        verbose_name_plural = _('Trades')

    def __str__(self):
        return f"{self.name} ({self.code})"


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trade = models.ForeignKey(
        Trade,
        on_delete=models.CASCADE,
        related_name='modules',
    )
    title = models.CharField(max_length=200)
    sequence_order = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'modules'
        ordering = ['sequence_order', 'title']
        unique_together = ('trade', 'sequence_order')
        verbose_name = _('Module')
        verbose_name_plural = _('Modules')

    def __str__(self):
        return f"{self.trade.code} - Module {self.sequence_order}: {self.title}"


class Procedure(models.Model):
    class Difficulty(models.TextChoices):
        BEGINNER = 'BEGINNER', _('Beginner')
        INTERMEDIATE = 'INTERMEDIATE', _('Intermediate')
        ADVANCED = 'ADVANCED', _('Advanced')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        Module,
        on_delete=models.PROTECT,
        related_name='procedures',
    )
    procedure_code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    difficulty = models.CharField(
        max_length=20,
        choices=Difficulty.choices,
        default=Difficulty.BEGINNER,
    )
    estimated_duration_minutes = models.PositiveIntegerField(default=20)
    safety_instructions = models.TextField()
    required_tools = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'procedures'
        ordering = ['procedure_code']
        verbose_name = _('Procedure')
        verbose_name_plural = _('Procedures')

    def __str__(self):
        return f"{self.procedure_code}: {self.title}"


class ProcedureStep(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    procedure = models.ForeignKey(
        Procedure,
        on_delete=models.CASCADE,
        related_name='steps',
    )
    step_number = models.PositiveIntegerField()
    step_code = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    description = models.TextField()
    expected_tool = models.CharField(max_length=150, blank=True, default='')
    visual_evidence_cue = models.TextField()
    is_safety_critical = models.BooleanField(default=False)
    common_mistakes = models.TextField(blank=True, default='')
    hold_duration_seconds = models.PositiveIntegerField(default=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'procedure_steps'
        ordering = ['step_number']
        constraints = [
            models.UniqueConstraint(
                fields=['procedure', 'step_number'],
                condition=models.Q(is_active=True),
                name='unique_active_procedure_step_order',
            ),
        ]
        verbose_name = _('Procedure Step')
        verbose_name_plural = _('Procedure Steps')

    def __str__(self):
        return f"{self.procedure.procedure_code} - Step {self.step_number}: {self.title}"
