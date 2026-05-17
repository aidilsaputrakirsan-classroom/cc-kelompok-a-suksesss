import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from database import get_db
from models import User, UserRole

load_dotenv()

# Ambil konfigurasi autentikasi dari environment agar mudah diubah per environment.
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-for-development")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Context hashing password untuk menyimpan password dalam bentuk hash, bukan plain text.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 bearer token untuk membaca header Authorization: Bearer <token>.
# tokenUrl dipakai Swagger UI saat user menekan tombol Authorize.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/counselor/token")


# ==================== PASSWORD ====================

def hash_password(password: str) -> str:
    """Mengubah password plain text menjadi hash bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Mengecek apakah password input cocok dengan hash yang tersimpan."""
    return pwd_context.verify(plain_password, hashed_password)


# ==================== JWT TOKEN ====================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Membuat JWT access token dengan masa berlaku tertentu."""
    to_encode = data.copy()
    # Jika tidak ada durasi khusus, pakai durasi default dari konfigurasi.
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    # Claim exp dipakai JWT untuk menentukan kapan token kedaluwarsa.
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Mendekode token dan memastikan tanda tangan JWT masih valid."""
    try:
        # Jika signature atau format token salah, jose akan melempar JWTError.
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        # Semua masalah token dipetakan ke 401 agar klien diminta login ulang.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau sudah expired",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ==================== DEPENDENCY ====================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Mengambil user aktif saat ini berdasarkan token JWT."""
    # Decode token untuk mendapatkan identitas user.
    payload = decode_token(token)
    user_id = payload.get("sub")

    # Claim sub harus berisi ID user.
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid",
        )

    # Cari user di database berdasarkan ID dari token.
    user = db.query(User).filter(User.id == int(user_id)).first()

    # Token valid, tetapi user bisa saja sudah dihapus.
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan",
        )

    # User nonaktif tidak boleh mengakses endpoint yang dilindungi.
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun tidak aktif",
        )

    return user


def get_current_counselor(current_user: User = Depends(get_current_user)) -> User:
    """Memastikan user yang sedang login memiliki role konselor."""
    if current_user.role != UserRole.COUNSELOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses hanya untuk konselor",
        )
    return current_user