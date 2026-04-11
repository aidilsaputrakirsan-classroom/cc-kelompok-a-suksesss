"""Seed initial counselor accounts for SafeSpace.

Run from backend folder:
python scripts/seed_counselors.py
"""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from crud import seed_counselors
from database import SessionLocal
from models import Base
from database import engine
from schemas import SeedCounselorItem


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


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        result = seed_counselors(db, DEFAULT_COUNSELORS)
        print("Seed counselor selesai:")
        print(result)
        print("Password default: Counselor123 (ganti setelah login pertama).")
    finally:
        db.close()


if __name__ == "__main__":
    main()
