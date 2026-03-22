import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, User
from schemas import (
    ItemCreate, ItemUpdate, ItemResponse, ItemListResponse,
    UserCreate, UserResponse, LoginRequest, TokenResponse,
)
from auth import create_access_token, get_current_user
import crud

load_dotenv()

# Buat semua tabel
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cloud App API",
    description="REST API untuk mata kuliah Komputasi Awan — SI ITK",
    version="0.4.0",
)

# ==================== CORS (FIXED) ====================
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
origins_list = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== CUSTOM EXCEPTION HANDLER ====================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = " → ".join(str(loc) for loc in error["loc"] if loc != "body")
        message = error["msg"]
        message = message.replace("Value error, ", "")
        errors.append({"field": field, "message": message})

    if len(errors) == 1:
        detail = f"{errors[0]['field']}: {errors[0]['message']}"
    else:
        detail = errors

    return JSONResponse(
        status_code=422,
        content={"detail": detail},
    )

# ==================== HEALTH CHECK ====================

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "0.4.0"}


# ==================== AUTH ENDPOINTS (PUBLIC) ====================

@app.post("/auth/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Registrasi user baru.
    
    - **email**: Email unik (akan digunakan untuk login)
    - **name**: Nama lengkap
    - **password**: Minimal 8 karakter
    """
    user = crud.create_user(db=db, user_data=user_data)
    if not user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return user


@app.post("/auth/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login dan dapatkan JWT token.
    
    Token berlaku selama 60 menit (default).
    Gunakan token di header: `Authorization: Bearer <token>`
    """
    user = crud.authenticate_user(db=db, email=login_data.email, password=login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@app.post("/auth/token", response_model=TokenResponse)
def login_oauth2(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Endpoint OAuth2 password flow untuk Swagger Authorize.

    Catatan:
    - Field `username` pada form OAuth2 digunakan sebagai email.
    - Tetap mengembalikan format token yang sama dengan endpoint login JSON.
    """
    user = crud.authenticate_user(db=db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Ambil profil user yang sedang login."""
    return current_user


# ==================== ITEM ENDPOINTS (PROTECTED) ====================

@app.post("/items", response_model=ItemResponse, status_code=201)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Buat item baru. **Membutuhkan autentikasi.**"""
    return crud.create_item(db=db, item_data=item)


@app.get("/items", response_model=ItemListResponse)
def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Ambil daftar items. **Membutuhkan autentikasi.**"""
    return crud.get_items(db=db, skip=skip, limit=limit, search=search)


@app.get("/items/stats")
def get_items_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Ambil statistik inventory. **Membutuhkan autentikasi.**"""
    return crud.get_items_stats(db=db)


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Ambil satu item. **Membutuhkan autentikasi.**"""
    item = crud.get_item(db=db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Item {item_id} tidak ditemukan")
    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update item. **Membutuhkan autentikasi.**"""
    updated = crud.update_item(db=db, item_id=item_id, item_data=item)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Item {item_id} tidak ditemukan")
    return updated


@app.delete("/items/{item_id}", status_code=204)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Hapus item. **Membutuhkan autentikasi.**"""
    success = crud.delete_item(db=db, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Item {item_id} tidak ditemukan")
    return None


# ==================== TEAM INFO ====================

@app.get("/team")
def team_info():
    """Informasi tim."""
    return {
        "team": "cloud-team-suksesss",
        "members": [
            {"name": "Rendy Rifandy Kurnia", "nim": "10231081", "role": "Lead Backend"},
            {"name": "Riska Fadlun Khairiyah Purba", "nim": "10231083", "role": "Lead Frontend"},
            {"name": "Rizki Abdul Aziz", "nim": "10231085", "role": "Lead DevOps"},
            {"name": "Siti Nur Azizah Putri Awni", "nim": "10231087", "role": "Lead QA & Docs"},
        ],
    }