from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    LogoutSerializer,
    UserProfileSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'register'

    @extend_schema(
        request=RegisterSerializer,
        responses={201: RegisterSerializer, 400: OpenApiResponse(description="Validation error")},
        summary="Register a new learner account",
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.to_representation(user), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    @extend_schema(
        request=LoginSerializer,
        responses={
            200: OpenApiResponse(description="JWT token pair and user profile"),
            400: OpenApiResponse(description="Invalid credentials or deactivated account"),
        },
        summary="Sign in and obtain JWT access and refresh tokens",
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=LogoutSerializer,
        responses={
            204: OpenApiResponse(description="Token blacklisted successfully"),
            400: OpenApiResponse(description="Invalid or expired token"),
        },
        summary="Blacklist refresh token on logout",
    )
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data['refresh'])
            token.blacklist()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TokenError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: UserProfileSerializer},
        summary="Get currently authenticated user profile",
    )
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
