from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from config import settings
import crud
from auth import create_access_token, get_current_counselor, get_current_user
from database import engine, get_db
from models import Base, ConsultationStatus, User
from middleware.error_tracking import ErrorTrackingMiddleware
from routers import bk_dashboard, monitoring
from schemas import (
    CounselorPublicItem,
    ConsultationCounselorListItem,
    ConsultationGuestCreate,
    ConsultationGuestResponse,
    ConsultationStatusUpdateResponse,
    CounselorLoginRequest,
    CounselorRegisterRequest,
    PublicMasterDataResponse,
    SeedCounselorsRequest,
    SeedCounselorsResponse,
    SeedMasterDataResponse,
    TokenResponse,
    UserBase,
)
from utils.logging_config import setup_logging

# Buat semua tabel jika belum ada saat aplikasi startup.
Base.metadata.create_all(bind=engine)

setup_logging(log_level=settings.LOG_LEVEL, service_name=settings.APP_NAME)

app = FastAPI(
    title=settings.APP_NAME,
    description="REST API untuk SafeSpace, sistem manajemen bimbingan konseling berbasis cloud",
    version="0.2.0",
    debug=settings.DEBUG,
)

# CORS dibuka untuk frontend lokal dan origin yang diizinkan via environment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

app.add_middleware(ErrorTrackingMiddleware)

# ==================== ROUTER REGISTRATION ====================
# Include dashboard router (BK Dashboard endpoints)
app.include_router(bk_dashboard.router)
app.include_router(monitoring.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Mengubah error validasi Pydantic menjadi format yang lebih singkat."""
    errors = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error["loc"] if loc != "body")
        message = error["msg"].replace("Value error, ", "")
        errors.append({"field": field, "message": message})

    detail = f"{errors[0]['field']}: {errors[0]['message']}" if len(errors) == 1 else errors
    return JSONResponse(status_code=422, content={"detail": detail})


@app.get("/health")
def health_check():
    """Endpoint ringan untuk mengecek apakah service hidup."""
    return {"status": "healthy", "service": "SafeSpace API", "version": "0.2.0"}


@app.post("/auth/counselors/register", response_model=UserBase, status_code=201)
def register_counselor(payload: CounselorRegisterRequest, db: Session = Depends(get_db)):
    """Mendaftarkan akun konselor baru."""
    counselor = crud.create_counselor(db=db, user_data=payload)
    if not counselor:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return counselor


@app.post("/auth/counselor/login", response_model=TokenResponse)
def counselor_login(payload: CounselorLoginRequest, db: Session = Depends(get_db)):
    """Login konselor dengan body JSON."""
    counselor = crud.authenticate_counselor(db=db, email=payload.email, password=payload.password)
    if not counselor:
        raise HTTPException(status_code=401, detail="Email atau password konselor salah")

    token = create_access_token(data={"sub": str(counselor.id), "role": counselor.role.value})
    return {"access_token": token, "token_type": "bearer", "user": counselor}


@app.post("/auth/counselor/token", response_model=TokenResponse)
def counselor_login_oauth2(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Login konselor menggunakan form OAuth2 untuk Swagger UI."""
    counselor = crud.authenticate_counselor(db=db, email=form_data.username, password=form_data.password)
    if not counselor:
        raise HTTPException(status_code=401, detail="Email atau password konselor salah")

    token = create_access_token(data={"sub": str(counselor.id), "role": counselor.role.value})
    return {"access_token": token, "token_type": "bearer", "user": counselor}


@app.get("/auth/me", response_model=UserBase)
def get_me(current_user: User = Depends(get_current_user)):
    """Mengembalikan data user yang sedang login."""
    return current_user


@app.get("/auth/counselor/me", response_model=UserBase)
def get_counselor_me(current_user: User = Depends(get_current_counselor)):
    """Mengembalikan data konselor yang sedang login."""
    return current_user


@app.post("/api/consultations", response_model=ConsultationGuestResponse, status_code=201)
def create_guest_consultation(payload: ConsultationGuestCreate, db: Session = Depends(get_db)):
    """Membuat pengajuan konsultasi baru dari pengguna publik."""
    try:
        consultation = crud.create_guest_consultation(db=db, payload=payload)
        return consultation
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/public/master-data", response_model=PublicMasterDataResponse)
def get_public_master_data(db: Session = Depends(get_db)):
    """Mengambil data master yang dipakai form publik."""
    return crud.get_public_master_data(db=db)


@app.get("/api/public/counselors", response_model=list[CounselorPublicItem])
def get_public_counselors(db: Session = Depends(get_db)):
    """Mengambil daftar konselor aktif untuk halaman publik."""
    return crud.get_active_counselors_public(db=db)


@app.post("/api/dev/seed/master-data", response_model=SeedMasterDataResponse)
def seed_master_data(db: Session = Depends(get_db)):
    """Mengisi master data awal untuk kebutuhan development."""
    return crud.seed_master_data(db=db)


@app.post("/api/dev/seed/counselors", response_model=SeedCounselorsResponse)
def seed_initial_counselors(payload: SeedCounselorsRequest, db: Session = Depends(get_db)):
    """Menambahkan data konselor awal dari payload request."""
    return crud.seed_counselors(db=db, counselors=payload.counselors)


@app.get("/api/bk/consultations", response_model=list[ConsultationCounselorListItem])
def list_consultations_for_counselor(
    status: ConsultationStatus | None = Query(default=None),
    current_user: User = Depends(get_current_counselor),
    db: Session = Depends(get_db),
):
    """Mengambil daftar konsultasi milik konselor yang sedang login."""
    return crud.get_consultations_for_counselor(
        db=db,
        counselor_id=current_user.id,
        status=status,
    )


@app.patch("/api/bk/consultations/{consultation_id}/accept", response_model=ConsultationStatusUpdateResponse)
def accept_consultation(
    consultation_id: int,
    current_user: User = Depends(get_current_counselor),
    db: Session = Depends(get_db),
):
    """Menandai konsultasi sebagai diterima."""
    consultation = crud.update_consultation_status(
        db=db,
        consultation_id=consultation_id,
        counselor_id=current_user.id,
        status=ConsultationStatus.ACCEPTED,
    )
    if consultation is None:
        raise HTTPException(status_code=404, detail="Data konsultasi tidak ditemukan")
    return consultation


@app.patch("/api/bk/consultations/{consultation_id}/reject", response_model=ConsultationStatusUpdateResponse)
def reject_consultation(
    consultation_id: int,
    current_user: User = Depends(get_current_counselor),
    db: Session = Depends(get_db),
):
    """Menandai konsultasi sebagai ditolak."""
    consultation = crud.update_consultation_status(
        db=db,
        consultation_id=consultation_id,
        counselor_id=current_user.id,
        status=ConsultationStatus.REJECTED,
    )
    if consultation is None:
        raise HTTPException(status_code=404, detail="Data konsultasi tidak ditemukan")
    return consultation


@app.get("/team")
def team_info():
    """Menampilkan informasi tim proyek."""
    return {
        "team": "cloud-team-suksesss",
        "members": [
            {"name": "Rendy Rifandy Kurnia", "nim": "10231081", "role": "Lead Backend"},
            {"name": "Riska Fadlun Khairiyah Purba", "nim": "10231083", "role": "Lead Frontend"},
            {"name": "Rizki Abdul Aziz", "nim": "10231085", "role": "Lead DevOps"},
            {"name": "Siti Nur Azizah Putri Awni", "nim": "10231087", "role": "Lead QA & Docs"},
        ],
    }