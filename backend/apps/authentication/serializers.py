from __future__ import annotations

from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.db.models import Q
from django.utils.text import slugify
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


UserModel = get_user_model()


def build_user_payload(user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "isAdmin": bool(user.is_staff or user.is_superuser),
        "role": "admin" if user.is_staff or user.is_superuser else "analyst",
        "displayName": user.get_full_name() or user.username,
    }


def build_token_response(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": build_user_payload(user),
    }


def find_user_by_identifier(identifier: str) -> User | None:
    normalized_identifier = identifier.strip()
    return (
        UserModel.objects.filter(
            Q(username__iexact=normalized_identifier) | Q(email__iexact=normalized_identifier)
        )
        .order_by("id")
        .first()
    )


def create_unique_username(base_value: str) -> str:
    base_username = slugify(base_value) or "analyst"
    username = base_username
    suffix = 1

    while UserModel.objects.filter(username=username).exists():
        suffix += 1
        username = f"{base_username}-{suffix}"

    return username[:150]


class AdminLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier", "").strip()
        password = attrs.get("password", "")

        if not identifier or not password:
            raise serializers.ValidationError("Admin username/email and password are required.")

        user = find_user_by_identifier(identifier)
        if user is None:
            raise serializers.ValidationError("Invalid admin credentials.")

        authenticated_user = authenticate(
            request=self.context.get("request"),
            username=user.username,
            password=password,
        )

        if authenticated_user is None:
            raise serializers.ValidationError("Invalid admin credentials.")

        if not (authenticated_user.is_staff or authenticated_user.is_superuser):
            raise serializers.ValidationError("This account is not an admin account.")

        attrs["user"] = authenticated_user
        return attrs

    def to_representation(self, instance):
        user = instance["user"]
        return build_token_response(user)


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier", "").strip()
        password = attrs.get("password", "")

        if not identifier or not password:
            raise serializers.ValidationError("Username/email and password are required.")

        user = find_user_by_identifier(identifier)
        if user is None:
            raise serializers.ValidationError("Invalid credentials.")

        authenticated_user = authenticate(
            request=self.context.get("request"),
            username=user.username,
            password=password,
        )

        if authenticated_user is None:
            raise serializers.ValidationError("Invalid credentials.")

        attrs["user"] = authenticated_user
        return attrs

    def to_representation(self, instance):
        user = instance["user"]
        return build_token_response(user)


class RegisterSerializer(serializers.Serializer):
    firstName = serializers.CharField(max_length=150)
    company = serializers.CharField(max_length=255, required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if UserModel.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        first_name = validated_data.get("firstName", "").strip()
        company = validated_data.get("company", "").strip()
        email = validated_data.get("email", "").strip().lower()
        password = validated_data.get("password", "")

        username = create_unique_username(email.split("@")[0] or first_name)
        user = UserModel.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=company,
        )

        return user

    def to_representation(self, instance):
        return build_token_response(instance)
