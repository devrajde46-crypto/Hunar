import uuid
from django.db.models import ProtectedError, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status, exceptions
from rest_framework.response import Response
from accounts.permissions import IsCourseContentManagerOrReadOnly
from .models import Trade, Module, Procedure, ProcedureStep
from .serializers import (
    TradeSerializer,
    ModuleSerializer,
    ProcedureListSerializer,
    ProcedureDetailSerializer,
    ProcedureStepSerializer,
)


class BaseInstitutionScopedViewSet(viewsets.ModelViewSet):
    """
    Base viewset enforcing that logged-in users only access content from their own institution.
    Superusers have platform-wide access.
    """
    permission_classes = [IsCourseContentManagerOrReadOnly]

    def perform_destroy(self, instance):
        # Default deactivation rather than destructive deletion
        if hasattr(instance, 'is_active'):
            instance.is_active = False
            instance.save(update_fields=['is_active'])
        else:
            instance.delete()


class TradeViewSet(BaseInstitutionScopedViewSet):
    serializer_class = TradeSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Trade.objects.none()
        if user.is_superuser:
            return Trade.objects.all()
        if user.institution_id:
            return Trade.objects.filter(institution_id=user.institution_id, is_active=True)
        return Trade.objects.filter(institution__isnull=True, is_active=True)

    def perform_create(self, serializer):
        user = self.request.user
        institution = user.institution if not user.is_superuser else serializer.validated_data.get('institution', user.institution)
        if not institution and not user.is_superuser:
            raise exceptions.ValidationError({"institution": "User is not linked to any institution."})
        serializer.save(institution=institution)


class ModuleViewSet(BaseInstitutionScopedViewSet):
    serializer_class = ModuleSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Module.objects.none()
        if user.is_superuser:
            return Module.objects.all()
        if user.institution_id:
            return Module.objects.filter(trade__institution_id=user.institution_id, is_active=True)
        return Module.objects.filter(trade__institution__isnull=True, is_active=True)

    def perform_create(self, serializer):
        trade = serializer.validated_data.get('trade')
        user = self.request.user
        if not user.is_superuser and trade.institution_id != user.institution_id:
            raise exceptions.PermissionDenied("Cannot add a module to another institution's trade.")
        serializer.save()


class ProcedureViewSet(BaseInstitutionScopedViewSet):
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Procedure.objects.none()

        qs = Procedure.objects.select_related('module__trade').prefetch_related(
            Prefetch('steps', queryset=ProcedureStep.objects.filter(is_active=True).order_by('step_number'))
        )
        if not user.is_superuser:
            if user.institution_id:
                qs = qs.filter(module__trade__institution_id=user.institution_id, is_active=True)
            else:
                qs = qs.filter(module__trade__institution__isnull=True, is_active=True)

        difficulty = self.request.query_params.get('difficulty')
        if difficulty:
            qs = qs.filter(difficulty__iexact=difficulty)

        module_id = self.request.query_params.get('module_id')
        if module_id:
            qs = qs.filter(module_id=module_id)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search)

        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return ProcedureListSerializer
        return ProcedureDetailSerializer

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        # Support both UUID primary key and procedure_code lookups
        obj = None
        try:
            uuid_val = uuid.UUID(lookup_value)
            obj = queryset.filter(id=uuid_val).first()
        except (ValueError, AttributeError):
            pass

        if not obj:
            obj = get_object_or_404(queryset, procedure_code__iexact=lookup_value)

        self.check_object_permissions(self.request, obj)
        return obj

    def perform_destroy(self, instance):
        # Do not hard delete procedures; deactivate them instead
        instance.is_active = False
        instance.save(update_fields=['is_active'])

    def perform_create(self, serializer):
        module = serializer.validated_data.get('module')
        user = self.request.user
        if not user.is_superuser and module.trade.institution_id != user.institution_id:
            raise exceptions.PermissionDenied("Cannot add a procedure to another institution's module.")
        serializer.save()


class ProcedureStepViewSet(BaseInstitutionScopedViewSet):
    serializer_class = ProcedureStepSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ProcedureStep.objects.none()
        qs = ProcedureStep.objects.filter(is_active=True)
        if user.is_superuser:
            return qs
        if user.institution_id:
            return qs.filter(
                procedure__module__trade__institution_id=user.institution_id,
                procedure__is_active=True,
            )
        return qs.filter(
            procedure__module__trade__institution__isnull=True,
            procedure__is_active=True,
        )

    def perform_create(self, serializer):
        procedure = serializer.validated_data.get('procedure')
        user = self.request.user
        if not user.is_superuser and procedure.module.trade.institution_id != user.institution_id:
            raise exceptions.PermissionDenied("Cannot add a step to another institution's procedure.")
        serializer.save()
