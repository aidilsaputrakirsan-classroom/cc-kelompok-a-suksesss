def test_register_login_and_verify(client):
    register_response = client.post(
        "/register",
        json={
            "email": "guru@example.com",
            "name": "Guru BK",
            "password": "Password123",
        },
    )
    assert register_response.status_code == 201
    assert register_response.json()["email"] == "guru@example.com"

    login_response = client.post(
        "/login",
        json={
            "email": "guru@example.com",
            "password": "Password123",
        },
    )
    assert login_response.status_code == 200
    body = login_response.json()
    assert "access_token" in body
    assert body["user"]["email"] == "guru@example.com"

    verify_response = client.get(
        "/verify",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["email"] == "guru@example.com"


def test_counselor_alias_login_route(client):
    client.post(
        "/counselor/register",
        json={
            "email": "counselor.alias@example.com",
            "name": "Guru Alias",
            "password": "Password123",
            "phone": "+6281234567890",
            "specialization": "Konseling Akademik",
        },
    )

    login_response = client.post(
        "/counselor/login",
        json={
            "email": "counselor.alias@example.com",
            "password": "Password123",
        },
    )

    assert login_response.status_code == 200
    assert login_response.json()["user"]["email"] == "counselor.alias@example.com"


def test_duplicate_register_returns_400(client):
    client.post(
        "/register",
        json={
            "email": "duplicate@example.com",
            "name": "Guru BK",
            "password": "Password123",
        },
    )
    duplicate_response = client.post(
        "/register",
        json={
            "email": "duplicate@example.com",
            "name": "Guru BK 2",
            "password": "Password123",
        },
    )
    assert duplicate_response.status_code == 400


def test_metrics_endpoint_reports_request_counts(client):
    from app.main import metrics

    start_count = metrics.request_count
    client.get("/health")
    response = client.get("/metrics")

    assert response.status_code == 200
    body = response.json()
    assert body["service"] == "auth-service"
    assert body["status"] == "healthy"
    assert body["request_count"] >= start_count + 1
    assert body["error_count"] == 0
    assert "latency_ms" in body


def test_counselor_login_alias_works(client):
    register_response = client.post(
        "/counselor/register",
        json={
            "email": "counselor@example.com",
            "name": "Counselor BK",
            "password": "Password123",
            "phone": "+6281234567890",
            "specialization": "Konseling Remaja",
        },
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/counselor/login",
        json={
            "email": "counselor@example.com",
            "password": "Password123",
        },
    )
    assert login_response.status_code == 200
    body = login_response.json()
    assert body["user"]["role"] == "COUNSELOR"
    assert body["user"]["phone"] == "+6281234567890"


def test_jwt_payload_includes_counselor_name(client):
    from app.auth import decode_token

    client.post(
        "/counselor/register",
        json={
            "email": "payload.name@example.com",
            "name": "Payload Nama",
            "password": "Password123",
            "phone": "+6281234567890",
            "specialization": "Konseling Akademik",
        },
    )

    login_response = client.post(
        "/counselor/login",
        json={
            "email": "payload.name@example.com",
            "password": "Password123",
        },
    )
    token = login_response.json()["access_token"]
    payload = decode_token(token)

    assert payload["name"] == "Payload Nama"
    assert payload["sub"].isdigit()
