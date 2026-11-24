from rest_framework import permissions
from accounts.models import User


class IsLearner(permissions.BasePermission):
    """
    Allows access only to authenticated users with the LEARNER role.
    """
    message = "Only trainees with the LEARNER role can perform this action."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == User.Role.LEARNER
        )
