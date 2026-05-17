"""
Konfigurasi test — setup database test terpisah dari database utama.
"""
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Paksa database test memakai SQLite sebelum app utama diimport.
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from database import Base, get_db
from main import app

# Database test — SQLite in-memory (tidak perlu PostgreSQL untuk testing!)
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Buat database baru untuk setiap test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Test client dengan database override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client):
    """Helper: register + login, return auth headers."""
    # Register konselor baru
    client.post("/auth/counselors/register", json={
        "email": "test@example.com",
        "password": "TestPassword123",
        "name": "Test User"
    })
    # Login konselor
    response = client.post("/auth/counselor/login", json={
        "email": "test@example.com",
        "password": "TestPassword123"
    })
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}