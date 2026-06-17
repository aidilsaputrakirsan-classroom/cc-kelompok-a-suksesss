from datetime import date

from app.main import verify_token_with_auth_service
from app.models import Consultation, ConsultationMethod, ConsultationStatus, Counselor, Gender, Item, Place, SchoolClass, Student, TimeSlot, Topic


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


def test_consultation_list_uses_counselor_name_from_token(client, db_session):
    counselor = Counselor(name="Nama DB", email="bk-token@example.com", phone="+6281234567801", specialization="Akademik", is_active=True)
    school_class = SchoolClass(name="X-TEST TOKEN", active=True)
    topic = Topic(name="Topik Token", icon="book-open", color="#7C3AED", active=True)
    time_slot = TimeSlot(name="Slot Token", start_time="10:00", end_time="10:30", active=True)
    place = Place(name="Ruang Token", active=True)
    student = Student(name="Siswa 1", school_class="X-A", gender=Gender.MALE, phone="+6281234567890")
    db_session.add_all([counselor, school_class, topic, time_slot, place, student])
    db_session.flush()
    consultation = Consultation(
        tracking_code="SS-TEST12345",
        student_id=student.id,
        counselor_id=counselor.id,
        class_id=school_class.id,
        method=ConsultationMethod.INDIVIDUAL,
        topic_id=topic.id,
        date=date.today(),
        time_slot_id=time_slot.id,
        place_id=place.id,
        status=ConsultationStatus.PENDING,
    )
    db_session.add(consultation)
    db_session.commit()

    def override_verify_token():
        return {"user_id": counselor.id, "email": counselor.email, "name": "Nama Token", "role": "COUNSELOR"}

    from app.main import app

    app.dependency_overrides[verify_token_with_auth_service] = override_verify_token
    try:
        response = client.get("/api/bk/consultations")
        assert response.status_code == 200
        body = response.json()
        assert body["data"][0]["counselor_name"] == "Nama Token"
    finally:
        app.dependency_overrides.clear()
