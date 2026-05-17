import re
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from models import ConsultationMethod, ConsultationStatus, Gender, UserRole


PHONE_ID_REGEX = re.compile(r"^\+62\d{8,13}$")


class UserBase(BaseModel):
    """Representasi data user yang aman untuk response API."""
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
    """Payload untuk registrasi akun konselor."""
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
    """Payload untuk login konselor."""
    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    """Response standar setelah login berhasil."""
    access_token: str
    token_type: str = "bearer"
    user: UserBase


class ConsultationGuestCreate(BaseModel):
    """Payload dari form konsultasi publik."""
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
    """Response ringkas untuk konsultasi yang baru dibuat."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    tracking_code: str
    status: ConsultationStatus
    counselor_id: int
    created_at: datetime


class SeedMasterDataResponse(BaseModel):
    """Response ringkas saat data master berhasil di-seed."""
    school_classes: int
    topics: int
    time_slots: int
    places: int


class MasterDataOption(BaseModel):
    """Opsi sederhana untuk dropdown master data."""
    id: int
    name: str


class TimeSlotOption(BaseModel):
    """Opsi slot waktu yang membawa informasi jam mulai dan selesai."""
    id: int
    name: str
    start_time: str | None = None
    end_time: str | None = None


class PublicMasterDataResponse(BaseModel):
    """Kumpulan master data publik yang dibutuhkan form konsultasi."""
    school_classes: list[MasterDataOption]
    topics: list[MasterDataOption]
    time_slots: list[TimeSlotOption]
    places: list[MasterDataOption]


class CounselorPublicItem(BaseModel):
    """Item konselor yang boleh ditampilkan ke publik."""
    id: int
    name: str
    specialization: str | None = None
    photo: str | None = None


class SeedCounselorItem(BaseModel):
    """Satu item data konselor untuk kebutuhan seeding."""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    phone: str | None = Field(default=None, max_length=20)
    specialization: str | None = Field(default=None, max_length=120)


class SeedCounselorsRequest(BaseModel):
    """Payload untuk mengisi banyak data konselor sekaligus."""
    counselors: list[SeedCounselorItem] = Field(..., min_length=1)


class SeedCounselorsResponse(BaseModel):
    """Response hasil proses seeding konselor."""
    created: int
    skipped_existing: int


class ConsultationStudentSummary(BaseModel):
    """Ringkasan data student pada daftar konsultasi."""
    name: str
    school_class: str
    gender: Gender
    phone: str


class ConsultationCounselorListItem(BaseModel):
    """Item daftar konsultasi untuk dashboard konselor."""
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
    """Response saat status konsultasi diubah."""
    id: int
    tracking_code: str
    status: ConsultationStatus


# ==================== DASHBOARD BK ====================

class DashboardStatsResponse(BaseModel):
    """Statistik dashboard untuk guru BK."""
    total: int = Field(..., ge=0, description="Total jumlah konsultasi milik counselor")
    pending: int = Field(..., ge=0, description="Jumlah konsultasi dengan status PENDING")
    accepted: int = Field(..., ge=0, description="Jumlah konsultasi dengan status ACCEPTED")
    rejected: int = Field(..., ge=0, description="Jumlah konsultasi dengan status REJECTED")


class ConsultationListItemResponse(BaseModel):
    """Item daftar konsultasi yang sudah disiapkan untuk pagination dashboard."""
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
    """Response paginated untuk daftar konsultasi dashboard."""
    data: list[ConsultationListItemResponse]
    total: int = Field(..., ge=0, description="Total jumlah data (tanpa pagination)")
    page: int = Field(..., ge=1, description="Nomor halaman (calculated: offset // limit + 1)")
    limit: int = Field(..., ge=1, le=100, description="Jumlah data per halaman")


class ConsultationDetailResponse(BaseModel):
    """Detail lengkap satu konsultasi untuk halaman detail dashboard."""
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