from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PracticeSubmissionViewSet

router = DefaultRouter()
router.register(r'submissions', PracticeSubmissionViewSet, basename='practice-submission')

urlpatterns = [
    path('', include(router.urls)),
]
