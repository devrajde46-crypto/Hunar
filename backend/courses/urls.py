from rest_framework.routers import DefaultRouter
from .views import TradeViewSet, ModuleViewSet, ProcedureViewSet, ProcedureStepViewSet

router = DefaultRouter()
router.register(r'trades', TradeViewSet, basename='trade')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'procedures', ProcedureViewSet, basename='procedure')
router.register(r'steps', ProcedureStepViewSet, basename='step')

urlpatterns = router.urls
