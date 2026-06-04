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
