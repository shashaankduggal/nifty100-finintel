from __future__ import annotations

from datetime import timedelta
import os


def get_env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name, default)
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def get_required_env(name: str) -> str:
    value = get_env(name)
    if value is None:
        raise EnvironmentError(f"{name} environment variable must be set.")
    return value


def get_bool_env(name: str, default: bool = False) -> bool:
    value = get_env(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def get_int_env(name: str, default: int) -> int:
    value = get_env(name)
    if value is None:
        return default
    return int(value)


def get_csv_env(name: str, default: str = "") -> list[str]:
    value = get_env(name, default) or ""
    return [item.strip() for item in value.split(",") if item.strip()]


def hours(value: int) -> timedelta:
    return timedelta(hours=value)


def days(value: int) -> timedelta:
    return timedelta(days=value)

