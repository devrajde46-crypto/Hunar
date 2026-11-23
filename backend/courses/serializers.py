from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from .models import Trade, Module, Procedure, ProcedureStep


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ('id', 'name', 'code', 'description', 'institution', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at', 'institution')


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ('id', 'trade', 'title', 'sequence_order', 'description', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProcedureStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcedureStep
        fields = (
            'id',
            'procedure',
            'step_number',
            'step_code',
            'title',
            'description',
            'expected_tool',
            'visual_evidence_cue',
            'is_safety_critical',
            'common_mistakes',
            'hold_duration_seconds',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')


class ProcedureListSerializer(serializers.ModelSerializer):
    total_steps = serializers.SerializerMethodField()
    safety_critical_steps_count = serializers.SerializerMethodField()

    class Meta:
        model = Procedure
        fields = (
            'id',
            'procedure_code',
            'title',
            'difficulty',
            'estimated_duration_minutes',
            'total_steps',
            'safety_critical_steps_count',
            'is_active',
        )

    @extend_schema_field(serializers.IntegerField())
    def get_total_steps(self, obj):
        return obj.steps.count()

    @extend_schema_field(serializers.IntegerField())
    def get_safety_critical_steps_count(self, obj):
        return obj.steps.filter(is_safety_critical=True).count()


class ProcedureDetailSerializer(serializers.ModelSerializer):
    steps = ProcedureStepSerializer(many=True, read_only=True)

    class Meta:
        model = Procedure
        fields = (
            'id',
            'procedure_code',
            'title',
            'module',
            'difficulty',
            'estimated_duration_minutes',
            'description',
            'safety_instructions',
            'required_tools',
            'is_active',
            'steps',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')
