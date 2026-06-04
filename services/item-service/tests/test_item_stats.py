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
