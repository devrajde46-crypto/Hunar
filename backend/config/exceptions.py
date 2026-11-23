from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler.
    Intercepts Django ProtectedError to return HTTP 409 Conflict,
    and formats standard error responses.
    """
    if isinstance(exc, ProtectedError):
        return Response(
            {
                "error": {
                    "code": "PROTECTED_RESOURCE",
                    "message": "Cannot delete this resource because other records depend on it. Deactivate it instead.",
                    "details": str(exc),
                }
            },
            status=status.HTTP_409_CONFLICT,
        )

    response = exception_handler(exc, context)
    return response
