import os
import time
from collections import deque

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy.orm import Session

from app import crud
from app.auth import decode_token
from app.database import Base, SessionLocal, engine, get_db
from app.models import User
from app.schemas import CounselorLoginRequest, CounselorRegisterRequest, TokenResponse, TokenVerifyResponse, UserResponse

Base.metadata.create_all(bind=engine)

DEFAULT_COUNSELORS = [
    CounselorRegisterRequest(
        name="Bu Anita",
        email="anita.bk@safespace.sch.id",
        password="Counselor123",
        phone="+6281234567801",
        specialization="Konseling Akademik",
    ),
    CounselorRegisterRequest(
        name="Pak Budi",
        email="budi.bk@safespace.sch.id",
        password="Counselor123",
        phone="+6281234567802",
        specialization="Konseling Karir",
    ),
    CounselorRegisterRequest(
        name="Bu Citra",
        email="citra.bk@safespace.sch.id",
        password="Counselor123",
        phone="+6281234567803",
        specialization="Konseling Pribadi dan Sosial",
    ),
]

app = FastAPI(
    title="Auth Service",
    description="Microservice autentikasi untuk Modul 12/13",
    version="1.0.0",
)

Instrumentator().instrument(app).expose(app)

class ServiceMetrics:
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.request_count = 0
        self.error_count = 0
        self.latencies_ms = deque(maxlen=1000)
        self.start_time = time.time()

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

        uptime_seconds = time.time() - self.start_time
        uptime_minutes = int(uptime_seconds // 60)

        return {
            "service": self.service_name,
            "status": "healthy",
            "request_count": self.request_count,
            "error_count": self.error_count,
            "error_rate": error_rate,
            "uptime": f"{uptime_minutes}m",
            "latency_ms": {
                "p50": p50,
                "p95": p95,
                "p99": p99,
            },
        }


metrics = ServiceMetrics("auth-service")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def seed_default_counselors() -> None:
    db = SessionLocal()
    try:
        for counselor in DEFAULT_COUNSELORS:
            crud.create_counselor(db=db, payload=counselor)
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


@app.middleware("http")
async def collect_metrics(request, call_next):
    started_at = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - started_at) * 1000, 2)
    metrics.record(response.status_code, duration_ms)
    return response


@app.get("/health")
def health_check() -> dict:
    return {"status": "healthy", "service": "auth-service"}


@app.get("/custom-metrics")
def service_metrics() -> dict:
    return metrics.snapshot()


def _register_counselor(payload: CounselorRegisterRequest, db: Session = Depends(get_db)):
    user = crud.create_user(db=db, payload=payload)
    if user is None:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return user


@app.post("/register", response_model=UserResponse, status_code=201)
@app.post("/counselor/register", response_model=UserResponse, status_code=201)
@app.post("/api/bk/register", response_model=UserResponse, status_code=201)
def register_counselor(payload: CounselorRegisterRequest, db: Session = Depends(get_db)):
    return _register_counselor(payload=payload, db=db)


def _login_counselor(payload: CounselorLoginRequest, db: Session = Depends(get_db)):
    user = crud.authenticate_counselor(db=db, email=payload.email, password=payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Email atau password salah")
    return {"access_token": crud.issue_access_token(user), "token_type": "bearer", "user": user}


@app.post("/login", response_model=TokenResponse)
@app.post("/counselor/login", response_model=TokenResponse)
@app.post("/auth/counselor/login", response_model=TokenResponse)
@app.post("/api/bk/login", response_model=TokenResponse)
def login_counselor(payload: CounselorLoginRequest, db: Session = Depends(get_db)):
    return _login_counselor(payload=payload, db=db)


@app.get("/verify", response_model=TokenVerifyResponse)
def verify_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token tidak valid")

    user = crud.get_user_by_id(db=db, user_id=int(user_id))
    if user is None:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Akun tidak aktif")

    return {
        "user_id": user.id,
        "email": user.email,
        "name": payload.get("name", user.name),
        "role": user.role.value,
    }


