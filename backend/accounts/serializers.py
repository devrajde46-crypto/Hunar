from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Institution, User


class InstitutionSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ('id', 'name', 'code')


class RegisterConsentSerializer(serializers.Serializer):
    consent_version = serializers.CharField(max_length=20, default='v1.0-2026')
    is_granted = serializers.BooleanField(default=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    trainee_id_number = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    institution_code = serializers.CharField(max_length=50)
    consent = RegisterConsentSerializer(required=False)

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        email = attrs.get('email', '').strip().lower()
        username = attrs.get('username', '').strip()

        # Error responses must not reveal whether an email exists
        if User.objects.filter(email__iexact=email).exists() or User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError(
                {"detail": "Unable to complete registration with the provided details."}
            )

        institution_code = attrs.get('institution_code', '').strip()
        institution = Institution.objects.filter(code__iexact=institution_code, is_active=True).first()
        if not institution:
            raise serializers.ValidationError(
                {"institution_code": "No active institution found with this code."}
            )

        attrs['institution'] = institution
        attrs['email'] = email
        attrs['username'] = username
        return attrs

    def create(self, validated_data):
        consent_data = validated_data.pop('consent', None)
        validated_data.pop('institution_code', None)
        institution = validated_data.pop('institution')

        # Registration must ALWAYS create a LEARNER, ignoring any client role
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            trainee_id_number=validated_data.get('trainee_id_number', ''),
            institution=institution,
            role=User.Role.LEARNER,
        )

        consent_granted = False
        if consent_data and consent_data.get('is_granted'):
            from practice.models import ConsentRecord
            request = self.context.get('request')
            ip_address = None
            user_agent = ''
            if request:
                ip_address = request.META.get('REMOTE_ADDR')
                user_agent = request.META.get('HTTP_USER_AGENT', '')

            ConsentRecord.objects.create(
                user=user,
                consent_version=consent_data.get('consent_version', 'v1.0-2026'),
                is_granted=True,
                ip_address=ip_address,
                user_agent=user_agent,
            )
            consent_granted = True

        self._consent_granted = consent_granted
        return user

    def to_representation(self, instance):
        consent_granted = getattr(self, '_consent_granted', False)
        if not consent_granted and hasattr(instance, 'consent_records'):
            consent_granted = instance.consent_records.filter(is_granted=True, revoked_at__isnull=True).exists()

        return {
            "id": str(instance.id),
            "username": instance.username,
            "email": instance.email,
            "role": instance.role,
            "first_name": instance.first_name,
            "last_name": instance.last_name,
            "trainee_id_number": instance.trainee_id_number,
            "institution": {
                "id": str(instance.institution.id) if instance.institution else None,
                "name": instance.institution.name if instance.institution else None,
                "code": instance.institution.code if instance.institution else None,
            } if instance.institution else None,
            "consent_granted": consent_granted,
            "date_joined": instance.date_joined.isoformat() if instance.date_joined else None,
        }


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username_or_email = attrs.get('username', '').strip()
        password = attrs.get('password')

        # Allow logging in with either username or email
        user = None
        if '@' in username_or_email:
            user = User.objects.filter(email__iexact=username_or_email).first()
        else:
            user = User.objects.filter(username__iexact=username_or_email).first()

        # Reject login if credentials invalid, is_deleted is true, or is_active is false
        # Maintain generic message to not reveal account existence
        if not user or not user.check_password(password) or user.is_deleted or not user.is_active:
            raise serializers.ValidationError(
                {"detail": "No active account found with the given credentials."}
            )

        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role
        refresh['institution_id'] = str(user.institution_id) if user.institution_id else None

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "trainee_id_number": user.trainee_id_number,
                "institution_name": user.institution.name if user.institution else None,
            },
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    institution = InstitutionSummarySerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'role',
            'first_name',
            'last_name',
            'phone_number',
            'trainee_id_number',
            'institution',
            'is_active',
            'date_joined',
        )
        read_only_fields = fields
