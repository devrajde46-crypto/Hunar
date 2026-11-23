from rest_framework import permissions
from .models import User


class IsLearner(permissions.BasePermission):
    """
    Allows access only to learners, and restricts object-level access to their own data.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.LEARNER
        )

    def has_object_permission(self, request, view, obj):
        # Superusers have full access
        if request.user.is_superuser:
            return True
        # Direct user object
        if isinstance(obj, User):
            return obj.id == request.user.id
        # Related user/learner
        if hasattr(obj, 'learner'):
            return obj.learner_id == request.user.id
        if hasattr(obj, 'user'):
            return obj.user_id == request.user.id
        return False


class IsTrainer(permissions.BasePermission):
    """
    Allows access to instructors, restricted to their own institution.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == User.Role.TRAINER or request.user.is_superuser)
        )

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if hasattr(obj, 'institution'):
            return obj.institution_id == request.user.institution_id
        if hasattr(obj, 'trade'):
            return obj.trade.institution_id == request.user.institution_id
        if hasattr(obj, 'module'):
            return obj.module.trade.institution_id == request.user.institution_id
        if hasattr(obj, 'procedure'):
            return obj.procedure.module.trade.institution_id == request.user.institution_id
        return True


class IsInstitutionAdmin(permissions.BasePermission):
    """
    Allows access to institution administrators, restricted to their own institution.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == User.Role.INSTITUTION_ADMIN or request.user.is_superuser)
        )

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        if hasattr(obj, 'institution'):
            return obj.institution_id == request.user.institution_id
        if hasattr(obj, 'trade'):
            return obj.trade.institution_id == request.user.institution_id
        if hasattr(obj, 'module'):
            return obj.module.trade.institution_id == request.user.institution_id
        if hasattr(obj, 'procedure'):
            return obj.procedure.module.trade.institution_id == request.user.institution_id
        return True


class IsSuperAdmin(permissions.BasePermission):
    """
    Allows full platform-wide access to super administrators.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_superuser or request.user.role == User.Role.SUPER_ADMIN)
        )


class IsCourseContentManagerOrReadOnly(permissions.BasePermission):
    """
    Controls access to course curriculum content:
    - Safe methods (GET, HEAD, OPTIONS): Allowed for any authenticated member of the institution.
    - Write methods (POST, PUT, PATCH, DELETE): Allowed only for TRAINER or INSTITUTION_ADMIN of that institution.
    - Superusers always have full access.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role in (User.Role.TRAINER, User.Role.INSTITUTION_ADMIN)

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        # Determine the institution associated with the object
        obj_institution_id = None
        if hasattr(obj, 'institution_id'):
            obj_institution_id = obj.institution_id
        elif hasattr(obj, 'trade'):
            obj_institution_id = obj.trade.institution_id
        elif hasattr(obj, 'module'):
            obj_institution_id = obj.module.trade.institution_id
        elif hasattr(obj, 'procedure'):
            obj_institution_id = obj.procedure.module.trade.institution_id

        # Users must never see or touch another institution's data
        if obj_institution_id != request.user.institution_id:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.role in (User.Role.TRAINER, User.Role.INSTITUTION_ADMIN)
