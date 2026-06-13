import os
import time
from collections import deque

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud
from app.auth_client import auth_circuit, verify_token_optional, verify_token_with_auth_service
from app.database import Base, SessionLocal, engine, get_db
from app.models import Counselor
from app.schemas import (
    ConsultationGuestCreate,
    ConsultationGuestResponse,
    CounselorPublicItem,
    ItemCreate,
    ItemListResponse,
    ItemResponse,
    ItemStatsResponse,
    ItemUpdate,
    PublicMasterDataResponse,
    SeedCounselorItem,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Item Service",
    description="Microservice inventory dan data publik untuk SafeSpace",
    version="1.0.0",
)


class ServiceMetrics:
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.request_count = 0
        self.error_count = 0
        self.latencies_ms = deque(maxlen=1000)

    def record(self, status_code: int, duration_ms: float) -> None:
        self.request_count += 1
        if status_code >= 500:
            self.error_count += 1
        self.latencies_ms.append(duration_ms)

    def snapshot(self) -> dict:
        if not self.latencies_ms:
            p50 = p95 = p99 = 0.0
        else:
            sorted_latencies = sorted(self.latencies_ms)

            def percentile(values: list[float], pct: float) -> float:
                if not values:
                    return 0.0
                index = int(round((len(values) - 1) * pct))
                return values[max(0, min(index, len(values) - 1))]

            p50 = percentile(sorted_latencies, 0.50)
            p95 = percentile(sorted_latencies, 0.95)
            p99 = percentile(sorted_latencies, 0.99)

        error_rate = self.error_count / self.request_count if self.request_count else 0.0
        return {
            "service": self.service_name,
            "status": "healthy",
            "request_count": self.request_count,
            "error_count": self.error_count,
            "error_rate": error_rate,
            "latency_ms": {
                "p50": p50,
                "p95": p95,
                "p99": p99,
            },
        }


metrics = ServiceMetrics("item-service")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def collect_metrics(request, call_next):
    started_at = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - started_at) * 1000, 2)
    metrics.record(response.status_code, duration_ms)
    return response


DEFAULT_COUNSELORS = [
    SeedCounselorItem(
        name="Bu Anita",
        email="anita.bk@safespace.sch.id",
        password="Counselor123",
        phone="+6281234567801",
        specialization="Konseling Akademik",
    ),
    SeedCounselorItem(
        name="Pak Budi",
        email="budi.bk@safespace.sch.id",
        password="Counselor123",
        phone="+6281234567802",
        specialization="Konseling Karir",
    ),
    SeedCounselorItem(
        name="Bu Citra",
        email="citra.bk@safespace.sch.id",
        password="Counselor123",
        phone="+6281234567803",
        specialization="Konseling Pribadi dan Sosial",
    ),
]


@app.on_event("startup")
def seed_default_reference_data() -> None:
    db = SessionLocal()
    try:
        if db.query(Counselor).count() == 0:
            crud.seed_counselors(db, DEFAULT_COUNSELORS)
        crud.seed_master_data(db)
    finally:
        db.close()


@app.get("/health")
def health_check() -> dict:
    cb_status = auth_circuit.status()
    overall_status = "healthy" if cb_status["state"] == "CLOSED" else "degraded"
    return {
        "status": overall_status,
        "service": "item-service",
        "dependencies": {"auth_service": cb_status},
    }


@app.get("/metrics")
def service_metrics() -> dict:
    return metrics.snapshot()


@app.get("/api/public/master-data", response_model=PublicMasterDataResponse)
def get_public_master_data(db: Session = Depends(get_db)):
    return crud.get_public_master_data(db=db)


@app.get("/api/public/counselors", response_model=list[CounselorPublicItem])
def get_public_counselors(db: Session = Depends(get_db)):
    return crud.get_active_counselors_public(db=db)


@app.post("/api/consultations", response_model=ConsultationGuestResponse, status_code=status.HTTP_201_CREATED)
def create_guest_consultation(payload: ConsultationGuestCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_guest_consultation(db=db, payload=payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/bk/dashboard/stats")
def get_dashboard_stats(current_user: dict = Depends(verify_token_with_auth_service), db: Session = Depends(get_db)):
    if current_user.get("role") != "COUNSELOR":
        raise HTTPException(status_code=403, detail="Akses hanya untuk konselor")
    return crud.get_dashboard_stats(db=db, counselor_id=int(current_user["user_id"]))


@app.get("/api/bk/consultations")
def list_consultations_paginated(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    method: str | None = Query(None),
    gender: str | None = Query(None),
    status: str | None = Query(None),
    current_user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    if current_user.get("role") != "COUNSELOR":
        raise HTTPException(status_code=403, detail="Akses hanya untuk konselor")

    status_filter = None
    if status is not None:
        try:
            from app.models import ConsultationStatus

            status_filter = ConsultationStatus[status.upper()]
        except KeyError:
            status_filter = None

    return crud.get_consultations_paginated(
        db=db,
        counselor_id=int(current_user["user_id"]),
        current_counselor_name=str(current_user.get("name", "Guru BK")),
        limit=limit,
        offset=offset,
        method=method,
        gender=gender,
        status_filter=status_filter,
    )


@app.get("/api/bk/consultations/{consultation_id}")
def get_consultation_detail(
    consultation_id: int,
    current_user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    if current_user.get("role") != "COUNSELOR":
        raise HTTPException(status_code=403, detail="Akses hanya untuk konselor")

    consultation = crud.get_consultation_detail_for_counselor(
        db=db,
        consultation_id=consultation_id,
        counselor_id=int(current_user["user_id"]),
        current_counselor_name=str(current_user.get("name", "Guru BK")),
    )
    if consultation is None:
        raise HTTPException(status_code=404, detail="Data konsultasi tidak ditemukan")
    return consultation


@app.patch("/api/bk/consultations/{consultation_id}/accept")
def accept_consultation(
    consultation_id: int,
    current_user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    if current_user.get("role") != "COUNSELOR":
        raise HTTPException(status_code=403, detail="Akses hanya untuk konselor")

    consultation = crud.update_consultation_status(
        db=db,
        consultation_id=consultation_id,
        counselor_id=int(current_user["user_id"]),
        status=crud.ConsultationStatus.ACCEPTED,
    )
    if consultation is None:
        raise HTTPException(status_code=404, detail="Data konsultasi tidak ditemukan")
    return {"id": consultation.id, "tracking_code": consultation.tracking_code, "status": consultation.status}


@app.patch("/api/bk/consultations/{consultation_id}/reject")
def reject_consultation(
    consultation_id: int,
    current_user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    if current_user.get("role") != "COUNSELOR":
        raise HTTPException(status_code=403, detail="Akses hanya untuk konselor")

    consultation = crud.update_consultation_status(
        db=db,
        consultation_id=consultation_id,
        counselor_id=int(current_user["user_id"]),
        status=crud.ConsultationStatus.REJECTED,
    )
    if consultation is None:
        raise HTTPException(status_code=404, detail="Data konsultasi tidak ditemukan")
    return {"id": consultation.id, "tracking_code": consultation.tracking_code, "status": consultation.status}


@app.delete("/api/bk/consultations/{consultation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_consultation(
    consultation_id: int,
    current_user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    if current_user.get("role") != "COUNSELOR":
        raise HTTPException(status_code=403, detail="Akses hanya untuk konselor")

    delete_result = crud.delete_consultation_for_counselor(
        db=db,
        consultation_id=consultation_id,
        counselor_id=int(current_user["user_id"]),
    )

    if delete_result == "not_found":
        raise HTTPException(status_code=404, detail="Data konsultasi tidak ditemukan")
    if delete_result == "forbidden":
        raise HTTPException(status_code=403, detail="Akses ditolak untuk data ini")

    return None


@app.get("/items", response_model=ItemListResponse)
def list_items(user: dict = Depends(verify_token_with_auth_service), db: Session = Depends(get_db)):
    items = crud.list_items(db=db, owner_id=int(user["user_id"]))
    return {"total": len(items), "items": items}


@app.post("/items", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, payload=payload, owner_id=1)


@app.get("/items/stats", response_model=ItemStatsResponse)
def item_stats(user: dict | None = Depends(verify_token_optional), db: Session = Depends(get_db)):
    owner_id = int(user["user_id"]) if user is not None else None
    return crud.get_items_stats(db=db, owner_id=owner_id)


@app.get("/items/public", response_model=ItemListResponse)
def public_items(db: Session = Depends(get_db)):
    items = crud.list_public_items(db=db)
    return {"total": len(items), "items": items}


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, user: dict = Depends(verify_token_with_auth_service), db: Session = Depends(get_db)):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, payload: ItemUpdate, user: dict = Depends(verify_token_with_auth_service), db: Session = Depends(get_db)):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.update_item(db=db, item=item, payload=payload)


@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db=db, item_id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    crud.delete_item(db=db, item=item)
    return None
