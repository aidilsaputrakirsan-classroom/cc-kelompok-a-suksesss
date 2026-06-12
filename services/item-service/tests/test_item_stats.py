from app.models import Item


def test_item_stats_empty(client):
    response = client.get("/items/stats")
    assert response.status_code == 200
    assert response.json() == {
        "total_items": 0,
        "total_value": 0,
        "termasuk": 0,
        "terminum": 0,
        "most_expensive": None,
        "cheapest": None,
    }


def test_item_stats_returns_summary(client, db_session):
    db_session.add_all(
        [
            Item(name="Laptop", description="Laptop kerja", price=15000000, quantity=2, owner_id=1, is_public=False),
            Item(name="Mouse", description="Mouse wireless", price=250000, quantity=0, owner_id=1, is_public=True),
            Item(name="Keyboard", description="Keyboard mechanical", price=850000, quantity=3, owner_id=1, is_public=False),
        ]
    )
    db_session.commit()

    response = client.get("/items/stats")
    assert response.status_code == 200
    body = response.json()
    assert body["total_items"] == 3
    assert body["total_value"] == (15000000 * 2) + (250000 * 0) + (850000 * 3)
    assert body["termasuk"] == 2
    assert body["terminum"] == 1
    assert body["most_expensive"]["name"] == "Laptop"
    assert body["cheapest"]["name"] == "Mouse"


def test_public_items_endpoint_returns_only_public_items(plain_client, db_session):
    db_session.add_all(
        [
            Item(name="Public Item", description="Bisa dilihat publik", price=1000, quantity=1, owner_id=1, is_public=True),
            Item(name="Private Item", description="Rahasia", price=2000, quantity=1, owner_id=1, is_public=False),
        ]
    )
    db_session.commit()

    response = plain_client.get("/items/public")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["name"] == "Public Item"


def test_stats_degrades_when_auth_breaker_open(plain_client, db_session):
    from app.auth_client import auth_circuit

    db_session.add_all(
        [
            Item(name="One", description="", price=1000, quantity=1, owner_id=1, is_public=True),
            Item(name="Two", description="", price=500, quantity=0, owner_id=2, is_public=False),
        ]
    )
    db_session.commit()

    auth_circuit.state = "OPEN"
    auth_circuit.last_failure_time = None

    try:
        response = plain_client.get("/items/stats")
        assert response.status_code == 200
        body = response.json()
        assert body["total_items"] == 2
        assert body["terminum"] == 1
    finally:
        auth_circuit.state = "CLOSED"
        auth_circuit.failure_count = 0
        auth_circuit.last_failure_time = None


def test_metrics_endpoint_reports_service_health(client):
    from app.main import metrics

    start_count = metrics.request_count
    client.get("/items/stats")
    response = client.get("/metrics")

    assert response.status_code == 200
    body = response.json()
    assert body["service"] == "item-service"
    assert body["status"] == "healthy"
    assert body["request_count"] >= start_count + 1
    assert body["error_count"] == 0
    assert "latency_ms" in body


def test_public_master_data_and_counselors_endpoints(client, db_session):
    from app.crud import seed_counselors, seed_master_data
    from app.schemas import SeedCounselorItem

    seed_master_data(db_session)
    seed_counselors(
        db_session,
        [
            SeedCounselorItem(
                name="Bu Anita",
                email="anita.bk@example.com",
                password="Password123",
                phone="+6281234567890",
                specialization="Konseling Remaja",
            )
        ],
    )

    master_response = client.get("/api/public/master-data")
    assert master_response.status_code == 200
    master_body = master_response.json()
    assert master_body["school_classes"]
    assert master_body["topics"]
    assert master_body["time_slots"]
    assert master_body["places"]

    counselors_response = client.get("/api/public/counselors")
    assert counselors_response.status_code == 200
    counselors_body = counselors_response.json()
    assert counselors_body[0]["name"] == "Bu Anita"
