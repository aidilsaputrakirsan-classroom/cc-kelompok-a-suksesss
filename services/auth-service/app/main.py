from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app import crud
from app.auth import decode_token
from app.database import Base, engine, get_db
from app.models import User
from app.schemas import TokenResponse, TokenVerifyResponse, UserCreate, UserLogin, UserResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Auth Service",
    description="Microservice autentikasi untuk Modul 12/13",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


@app.get("/health")
def health_check() -> dict:
    return {"status": "healthy", "service": "auth-service"}


@app.post("/register", response_model=UserResponse, status_code=201)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    user = crud.create_user(db=db, payload=payload)
    if user is None:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    return user


@app.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db=db, email=payload.email, password=payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Email atau password salah")
    return {"access_token": crud.issue_access_token(user), "token_type": "bearer", "user": user}


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

    return {"user_id": user.id, "email": user.email, "name": user.name, "role": user.role}
