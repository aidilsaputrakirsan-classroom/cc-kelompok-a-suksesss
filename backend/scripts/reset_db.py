"""Reset PostgreSQL schema for SafeSpace.

This script drops all existing tables and recreates them from SQLAlchemy models.

Run from backend folder:
python scripts/reset_db.py
"""

from pathlib import Path
import sys

from sqlalchemy import inspect

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from database import engine
from models import Base


def main() -> None:
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    if existing_tables:
        print("Dropping tables:", ", ".join(sorted(existing_tables)))
    else:
        print("No existing tables found.")

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    recreated_tables = inspector.get_table_names()
    print("Recreated tables:", ", ".join(sorted(recreated_tables)) if recreated_tables else "none")
    print("Database reset complete.")


if __name__ == "__main__":
    main()
