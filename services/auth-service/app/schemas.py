from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models import UserRole


PHONE_ID_REGEX = r"^\+62\d{8,13}$"


class CounselorRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    phone: str | None = Field(default=None, max_length=20)
    specialization: str | None = Field(default=None, max_length=120)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not __import__("re").match(PHONE_ID_REGEX, value):
            raise ValueError("Nomor telepon harus format +62xxxxxxxx")
        return value


class CounselorLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    role: UserRole
    phone: str | None = None
    specialization: str | None = None
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserBase


class TokenVerifyResponse(BaseModel):
    user_id: int
    email: str
    name: str
    role: UserRole


# Backwards-compatible aliases for legacy imports/tests.
UserCreate = CounselorRegisterRequest
UserLogin = CounselorLoginRequest
UserResponse = UserBase
