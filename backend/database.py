from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings


def _build_connect_args(database_url: str) -> dict[str, bool]:
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    return {}

# Engine adalah objek inti SQLAlchemy untuk membuka koneksi ke database.
engine = create_engine(settings.DATABASE_URL, connect_args=_build_connect_args(settings.DATABASE_URL))

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