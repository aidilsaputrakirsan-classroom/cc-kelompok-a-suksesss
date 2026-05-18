"""
Konfigurasi test — setup database test terpisah dari database utama.
"""
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

TEST_DB_PATH = Path(__file__).resolve().parent.parent / "test.db"

# Paksa database test memakai SQLite sebelum app utama diimport.
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH.as_posix()}"

from database import Base, get_db
from main import app

# Database test — SQLite file sementara agar app dan test memakai engine yang sama.
SQLALCHEMY_TEST_DATABASE_URL = os.environ["DATABASE_URL"]

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
        engine.dispose()
        for candidate in TEST_DB_PATH.parent.glob("test.db*"):
            if candidate.exists():
                try:
                    candidate.unlink()
                except PermissionError:
                    pass


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


@pytest.fixture
def counselor_factory(client):
    """Factory untuk register + login counselor dan mengembalikan token/header."""

    def create(
        *,
        email: str,
        name: str,
        password: str = "TestPassword123",
        phone: str | None = None,
        specialization: str | None = None,
    ) -> dict:
        payload = {
            "email": email,
            "name": name,
            "password": password,
        }
        if phone is not None:
            payload["phone"] = phone
        if specialization is not None:
            payload["specialization"] = specialization

        register_response = client.post("/auth/counselors/register", json=payload)
        assert register_response.status_code == 201

        login_response = client.post(
            "/auth/counselor/login",
            json={"email": email, "password": password},
        )
        assert login_response.status_code == 200

        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        me_response = client.get("/auth/counselor/me", headers=headers)
        assert me_response.status_code == 200

        return {"user": me_response.json(), "token": token, "headers": headers}

    return create


@pytest.fixture
def seeded_master_data(client):
    """Seed master data awal dan kembalikan data publik yang sudah tersedia."""
    seed_response = client.post("/api/dev/seed/master-data")
    assert seed_response.status_code == 200

    master_data_response = client.get("/api/public/master-data")
    assert master_data_response.status_code == 200
    return master_data_response.json()