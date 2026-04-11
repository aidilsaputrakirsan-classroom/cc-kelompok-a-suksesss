"""Seed initial master data for SafeSpace.

Run from backend folder:
python scripts/seed_master_data.py
"""

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from crud import seed_master_data
from database import SessionLocal
from models import Base
from database import engine


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        result = seed_master_data(db)
        print("Seed master data selesai:")
        print(result)
    finally:
        db.close()


if __name__ == "__main__":
    main()
