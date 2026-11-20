from django.contrib import admin
from django.http import JsonResponse
from django.urls import path


def health_check(request):
    if request.method == "GET":
        return JsonResponse({"status": "ok"})
    return JsonResponse({"error": "Method not allowed"}, status=405)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
]
