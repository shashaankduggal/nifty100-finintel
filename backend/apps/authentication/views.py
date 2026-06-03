from django.db import DatabaseError, OperationalError, ProgrammingError
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import AdminLoginSerializer, LoginSerializer, RegisterSerializer, build_user_payload


def _database_not_ready_response() -> Response:
    return Response(
        {
            "detail": (
                "Database schema is not initialized. Run `python backend/manage.py migrate` "
                "and restart the backend."
            )
        },
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data, context={"request": request})
        try:
            serializer.is_valid(raise_exception=True)
        except (DatabaseError, OperationalError, ProgrammingError):
            return _database_not_ready_response()
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        try:
            serializer.is_valid(raise_exception=True)
        except (DatabaseError, OperationalError, ProgrammingError):
            return _database_not_ready_response()
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
        except (DatabaseError, OperationalError, ProgrammingError):
            return _database_not_ready_response()
        return Response(serializer.to_representation(user), status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except (DatabaseError, OperationalError, ProgrammingError):
            return _database_not_ready_response()
        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"user": build_user_payload(request.user)}, status=status.HTTP_200_OK)


class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except (DatabaseError, OperationalError, ProgrammingError):
            return _database_not_ready_response()
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
