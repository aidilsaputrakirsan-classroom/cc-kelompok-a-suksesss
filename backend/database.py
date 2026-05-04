import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Muat environment variables dari file .env agar konfigurasi tidak hard-coded.
load_dotenv()

# Ambil URL database dari environment.
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di .env!")

# Engine adalah objek inti SQLAlchemy untuk membuka koneksi ke database.
engine = create_engine(DATABASE_URL)

# Factory untuk membuat session database per request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class yang dipakai semua model SQLAlchemy.
Base = declarative_base()


def get_db():
    """
    Dependency injection untuk FastAPI.
    Membuka session saat request masuk dan menutupnya setelah selesai.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()