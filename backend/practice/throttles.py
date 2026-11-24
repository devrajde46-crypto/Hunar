from django.conf import settings
from rest_framework.throttling import UserRateThrottle


class SubmissionUploadThrottle(UserRateThrottle):
    scope = 'upload'

    def get_rate(self):
        rf_settings = getattr(settings, 'REST_FRAMEWORK', {})
        throttle_rates = rf_settings.get('DEFAULT_THROTTLE_RATES', {})
        if self.scope in throttle_rates:
            return throttle_rates[self.scope]
        return super().get_rate()
