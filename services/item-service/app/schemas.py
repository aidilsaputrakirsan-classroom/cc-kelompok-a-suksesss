from datetime import datetime

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
