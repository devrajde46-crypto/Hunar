from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


def health_check(request):
    if request.method == "GET":
        return JsonResponse({"status": "ok"})
    return JsonResponse({"error": "Method not allowed"}, status=405)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),

    # API v1 routes
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/courses/', include('courses.urls')),

    # OpenAPI 3.0 schema and documentation endpoints
    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
