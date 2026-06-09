import os
import time
from collections import deque

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud
from app.auth_client import auth_circuit, verify_token_optional, verify_token_with_auth_service
from app.database import Base, engine, get_db
from app.schemas import ItemCreate, ItemListResponse, ItemResponse, ItemStatsResponse, ItemUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Item Service",
    description="Microservice inventory untuk Modul 12/13",
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


@app.post("/items", response_model=ItemResponse, status_code=201)
def create_item(
    payload: ItemCreate,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.create_item(db=db, payload=payload, owner_id=int(user["user_id"]))
    return item


@app.get("/items", response_model=ItemListResponse)
def list_items(
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    items = crud.list_items(db=db, owner_id=int(user["user_id"]))
    return {"total": len(items), "items": items}


@app.get("/items/stats", response_model=ItemStatsResponse)
def item_stats(
    user: dict | None = Depends(verify_token_optional),
    db: Session = Depends(get_db),
):
    owner_id = int(user["user_id"]) if user is not None else None
    return crud.get_items_stats(db=db, owner_id=owner_id)


@app.get("/items/public", response_model=ItemListResponse)
def public_items(db: Session = Depends(get_db)):
    items = crud.list_public_items(db=db)
    return {"total": len(items), "items": items}


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(
    item_id: int,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    payload: ItemUpdate,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.update_item(db=db, item=item, payload=payload)


@app.delete("/items/{item_id}", status_code=204)
def delete_item(
    item_id: int,
    user: dict = Depends(verify_token_with_auth_service),
    db: Session = Depends(get_db),
):
    item = crud.get_item(db=db, item_id=item_id, owner_id=int(user["user_id"]))
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    crud.delete_item(db=db, item=item)
    return None
