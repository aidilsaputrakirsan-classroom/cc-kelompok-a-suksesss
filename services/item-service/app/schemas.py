from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    price: float = Field(..., gt=0)
    quantity: int = Field(default=0, ge=0)
    is_public: bool = False


class ItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    price: float | None = Field(default=None, gt=0)
    quantity: int | None = Field(default=None, ge=0)
    is_public: bool | None = None


class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    price: float
    quantity: int
    owner_id: int
    is_public: bool
    created_at: datetime
    updated_at: datetime | None = None


class ItemListResponse(BaseModel):
    total: int
    items: list[ItemResponse]


class ItemStatsTopItem(BaseModel):
    id: int
    name: str
    price: float


class ItemStatsResponse(BaseModel):
    total_items: int
    total_value: float
    termasuk: int
    terminum: int
    most_expensive: ItemStatsTopItem | None
    cheapest: ItemStatsTopItem | None


class CounselorPublicItem(BaseModel):
    id: int
    name: str
    specialization: str | None = None
    photo: str | None = None


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


class ConsultationGuestCreate(BaseModel):
    student_name: str = Field(..., min_length=2, max_length=100)
    class_id: int = Field(..., ge=1)
    gender: str
    student_phone: str = Field(..., max_length=20)
    counselor_id: int = Field(..., ge=1)
    method: str
    topic_id: int = Field(..., ge=1)
    date: date
    time_slot_id: int = Field(..., ge=1)
    place_id: int = Field(..., ge=1)


class ConsultationGuestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tracking_code: str
    status: str
    counselor_id: int
    created_at: datetime


class SeedMasterDataResponse(BaseModel):
    school_classes: int
    topics: int
    time_slots: int
    places: int


class SeedCounselorItem(BaseModel):
    name: str
    email: str
    password: str
    phone: str | None = None
    specialization: str | None = None


class SeedCounselorsRequest(BaseModel):
    counselors: list[SeedCounselorItem]


class SeedCounselorsResponse(BaseModel):
    created: int
    skipped_existing: int
