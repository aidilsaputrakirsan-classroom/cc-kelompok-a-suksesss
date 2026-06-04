from __future__ import annotations

from pathlib import Path
from typing import Any

from pydantic import AliasChoices, Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_NAME: str = "SafeSpace"
    ENVIRONMENT: str = Field(default="development", validation_alias=AliasChoices("ENVIRONMENT", "APP_ENV"))
    DEBUG: bool | None = None
    API_V1_PREFIX: str = "/api"

    DATABASE_URL: str = "sqlite:///./safespace.db"

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    CORS_ORIGINS: list[str] | None = Field(default=None, validation_alias=AliasChoices("CORS_ORIGINS", "ALLOWED_ORIGINS"))
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = Field(default_factory=lambda: ["*"])
    CORS_ALLOW_HEADERS: list[str] = Field(default_factory=lambda: ["*"])

    LOG_LEVEL: str | None = None

    @field_validator("ENVIRONMENT", "LOG_LEVEL", mode="before")
    @classmethod
    def strip_text(cls, value: Any):
        if value is None:
            return value
        return str(value).strip()

    @field_validator("CORS_ORIGINS", "CORS_ALLOW_METHODS", "CORS_ALLOW_HEADERS", mode="before")
    @classmethod
    def parse_comma_separated_list(cls, value: Any):
        if value in (None, ""):
            return None
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        return value

    @model_validator(mode="after")
    def apply_environment_defaults(self):
        environment = self.ENVIRONMENT.lower()

        if self.DEBUG is None:
            self.DEBUG = environment == "development"

        if not self.LOG_LEVEL:
            self.LOG_LEVEL = "DEBUG" if environment == "development" else "INFO"
        self.LOG_LEVEL = self.LOG_LEVEL.upper()

        if not self.CORS_ORIGINS:
            if environment == "production":
                self.CORS_ORIGINS = ["https://safespace.yourdomain.com"]
            else:
                self.CORS_ORIGINS = [
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ]

        return self


settings = Settings()