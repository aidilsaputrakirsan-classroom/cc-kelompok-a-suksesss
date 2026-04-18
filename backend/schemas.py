import re
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from models import ConsultationMethod, ConsultationStatus, Gender, UserRole


PHONE_ID_REGEX = re.compile(r"^\+62\d{8,13}$")


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: UserRole
    phone: str | None = None
    specialization: str | None = None
    is_active: bool
    created_at: datetime


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

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        if not re.search(r"[A-Za-z]", value):
            raise ValueError("Password harus mengandung huruf")
        if not re.search(r"\d", value):
            raise ValueError("Password harus mengandung angka")
        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not PHONE_ID_REGEX.match(value):
            raise ValueError("Nomor telepon harus format +62xxxxxxxx")
        return value


class CounselorLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserBase


class ConsultationGuestCreate(BaseModel):
    student_name: str = Field(..., min_length=2, max_length=100)
    class_id: int = Field(..., ge=1)
    gender: Gender
    student_phone: str = Field(..., max_length=20)
    counselor_id: int = Field(..., ge=1)
    method: ConsultationMethod
    topic_id: int = Field(..., ge=1)
    date: date
    time_slot_id: int = Field(..., ge=1)
    place_id: int = Field(..., ge=1)

    @field_validator("student_phone")
    @classmethod
    def validate_student_phone(cls, value: str) -> str:
        value = value.strip()
        if not PHONE_ID_REGEX.match(value):
            raise ValueError("Nomor WhatsApp harus format +62xxxxxxxx")
        return value


class ConsultationGuestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tracking_code: str
    status: ConsultationStatus
    counselor_id: int
    created_at: datetime


class SeedMasterDataResponse(BaseModel):
    school_classes: int
    topics: int
    time_slots: int
    places: int


class MasterDataOption(BaseModel):
    id: int
    name: str


class TimeSlotOption(BaseModel):
    id: int
    name: str
    start_time: str | None = None
    end_time: str | None = None


class PublicMasterDataResponse(BaseModel):
    school_classes: list[MasterDataOption]
    topics: list[MasterDataOption]
    time_slots: list[TimeSlotOption]
    places: list[MasterDataOption]


class CounselorPublicItem(BaseModel):
    id: int
    name: str
    specialization: str | None = None
    photo: str | None = None


class SeedCounselorItem(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    phone: str | None = Field(default=None, max_length=20)
    specialization: str | None = Field(default=None, max_length=120)


class SeedCounselorsRequest(BaseModel):
    counselors: list[SeedCounselorItem] = Field(..., min_length=1)


class SeedCounselorsResponse(BaseModel):
    created: int
    skipped_existing: int


class ConsultationStudentSummary(BaseModel):
    name: str
    school_class: str
    gender: Gender
    phone: str


class ConsultationCounselorListItem(BaseModel):
    id: int
    tracking_code: str
    method: ConsultationMethod
    status: ConsultationStatus
    date: date
    created_at: datetime
    topic_name: str
    time_slot_name: str
    place_name: str
    student: ConsultationStudentSummary


class ConsultationStatusUpdateResponse(BaseModel):
    id: int
    tracking_code: str
    status: ConsultationStatus


# ==================== DASHBOARD BK ====================

class DashboardStatsResponse(BaseModel):
    """
    Statistik dashboard untuk guru BK.
    
    Example:
    {
      "total": 50,
      "pending": 10,
      "accepted": 35,
      "rejected": 5
    }
    """
    total: int = Field(..., ge=0, description="Total jumlah konsultasi milik counselor")
    pending: int = Field(..., ge=0, description="Jumlah konsultasi dengan status PENDING")
    accepted: int = Field(..., ge=0, description="Jumlah konsultasi dengan status ACCEPTED")
    rejected: int = Field(..., ge=0, description="Jumlah konsultasi dengan status REJECTED")


class ConsultationListItemResponse(BaseModel):
    """
    Item dalam daftar konsultasi di dashboard.
    Optimized untuk pagination list view.
    
    Example:
    {
      "id": 1,
      "tracking_code": "SS-ABC1234567",
      "student_name": "Budi Santoso",
      "class": "X-A",
      "topic": "Belajar",
      "status": "PENDING",
      "date": "2026-04-20",
      "time_slot": "Istirahat ke-1 (10:00-10:30)",
      "created_at": "2026-04-17T10:30:45.123456+00:00"
    }
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    tracking_code: str
    student_name: str
    student_phone: str
    counselor_name: str
    class_name: str = Field(..., alias="class")
    topic_name: str = Field(..., alias="topic")
    status: ConsultationStatus
    date: date
    time_slot_name: str = Field(..., alias="time_slot")
    rejection_reason: str | None = None
    whatsapp_link: str | None = None
    created_at: datetime


class PaginatedConsultationListResponse(BaseModel):
    """
    Response untuk endpoint list konsultasi dengan pagination.
    
    Example:
    {
      "data": [...],
      "total": 50,
      "page": 1,
      "limit": 10
    }
    
    Notes:
    - page = (offset // limit) + 1
    - Untuk next page: next_offset = offset + limit
    - Untuk prev page: prev_offset = max(0, offset - limit)
    """
    data: list[ConsultationListItemResponse]
    total: int = Field(..., ge=0, description="Total jumlah data (tanpa pagination)")
    page: int = Field(..., ge=1, description="Nomor halaman (calculated: offset // limit + 1)")
    limit: int = Field(..., ge=1, le=100, description="Jumlah data per halaman")


class ConsultationDetailResponse(BaseModel):
    id: int
    tracking_code: str
    student_name: str
    student_phone: str
    counselor_name: str
    class_name: str = Field(..., alias="class")
    topic_name: str = Field(..., alias="topic")
    status: ConsultationStatus
    date: date
    time_slot_name: str = Field(..., alias="time_slot")
    place_name: str = Field(..., alias="place")
    rejection_reason: str | None = None
    whatsapp_link: str | None = None
    created_at: datetime