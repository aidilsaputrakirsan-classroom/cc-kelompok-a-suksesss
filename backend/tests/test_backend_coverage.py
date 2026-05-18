from __future__ import annotations

from datetime import date, timedelta


def _consultation_payload(
    *,
    counselor_id: int,
    class_id: int,
    topic_id: int,
    time_slot_id: int,
    place_id: int,
    student_name: str,
    student_phone: str,
    gender: str = "MALE",
    method: str = "INDIVIDUAL",
    consultation_date: date | None = None,
):
    return {
        "student_name": student_name,
        "class_id": class_id,
        "gender": gender,
        "student_phone": student_phone,
        "counselor_id": counselor_id,
        "method": method,
        "topic_id": topic_id,
        "date": (consultation_date or (date.today() + timedelta(days=1))).isoformat(),
        "time_slot_id": time_slot_id,
        "place_id": place_id,
    }


class TestAuthValidation:
    def test_register_counselor_invalid_password(self, client):
        response = client.post(
            "/auth/counselors/register",
            json={
                "email": "invalid-password@example.com",
                "password": "short",
                "name": "Guru BK Invalid",
            },
        )

        assert response.status_code == 422
        detail = response.json()["detail"]
        if isinstance(detail, list):
            assert any(item["field"] == "password" for item in detail)
        else:
            assert "password" in detail.lower()

    def test_register_counselor_invalid_phone(self, client):
        response = client.post(
            "/auth/counselors/register",
            json={
                "email": "invalid-phone@example.com",
                "password": "Password123",
                "name": "Guru BK Invalid Phone",
                "phone": "081234",
            },
        )

        assert response.status_code == 422
        detail = response.json()["detail"]
        if isinstance(detail, list):
            assert any(item["field"] == "phone" for item in detail)
        else:
            assert "phone" in detail.lower()

    def test_login_counselor_wrong_password(self, client):
        client.post(
            "/auth/counselors/register",
            json={
                "email": "wrong-login@example.com",
                "password": "Password123",
                "name": "Guru BK Wrong Login",
            },
        )

        response = client.post(
            "/auth/counselor/login",
            json={"email": "wrong-login@example.com", "password": "WrongPassword123"},
        )

        assert response.status_code == 401
        assert response.json()["detail"] == "Email atau password konselor salah"


class TestMasterDataAndConsultations:
    def test_seed_master_data_and_public_lookup(self, client, counselor_factory, seeded_master_data):
        counselor = counselor_factory(
            email="master-data@example.com",
            name="Guru BK Master Data",
            specialization="BK Umum",
        )

        response = client.get("/api/public/counselors")
        assert response.status_code == 200
        public_counselors = response.json()
        assert any(item["name"] == counselor["user"]["name"] for item in public_counselors)

        assert len(seeded_master_data["school_classes"]) == 6
        assert len(seeded_master_data["topics"]) == 5
        assert len(seeded_master_data["time_slots"]) == 3
        assert len(seeded_master_data["places"]) == 3

    def test_create_guest_consultation_empty_fields(self, client, counselor_factory, seeded_master_data):
        counselor = counselor_factory(
            email="empty-fields@example.com",
            name="Guru BK Empty Fields",
        )

        response = client.post("/api/consultations", json={})

        assert response.status_code == 422
        detail = response.json()["detail"]
        assert detail

    def test_create_guest_consultation_wrong_types(self, client, counselor_factory, seeded_master_data):
        counselor = counselor_factory(
            email="wrong-types@example.com",
            name="Guru BK Wrong Types",
        )
        master_topic = seeded_master_data["topics"][0]["id"]
        master_time_slot = seeded_master_data["time_slots"][0]["id"]
        master_place = seeded_master_data["places"][0]["id"]

        response = client.post(
            "/api/consultations",
            json={
                "student_name": "Budi",
                "class_id": "not-an-int",
                "gender": "MALE",
                "student_phone": "+6281234567890",
                "counselor_id": counselor["user"]["id"],
                "method": "INDIVIDUAL",
                "topic_id": master_topic,
                "date": (date.today() + timedelta(days=1)).isoformat(),
                "time_slot_id": master_time_slot,
                "place_id": master_place,
            },
        )

        assert response.status_code == 422
        detail = response.json()["detail"]
        assert detail

    def test_pagination_and_data_isolation(self, client, counselor_factory, seeded_master_data):
        counselor_one = counselor_factory(
            email="counselor-one@example.com",
            name="Guru BK Satu",
        )
        counselor_two = counselor_factory(
            email="counselor-two@example.com",
            name="Guru BK Dua",
        )

        class_id = seeded_master_data["school_classes"][0]["id"]
        topic_id = seeded_master_data["topics"][0]["id"]
        time_slot_id = seeded_master_data["time_slots"][0]["id"]
        place_id = seeded_master_data["places"][0]["id"]

        first = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor_one["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Siswa Satu",
                student_phone="+6281111111111",
            ),
        )
        second = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor_one["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Siswa Dua",
                student_phone="+6281111111112",
            ),
        )
        third = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor_one["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Siswa Tiga",
                student_phone="+6281111111113",
            ),
        )
        outsider = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor_two["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Siswa Empat",
                student_phone="+6281111111114",
            ),
        )

        assert first.status_code == 201
        assert second.status_code == 201
        assert third.status_code == 201
        assert outsider.status_code == 201

        response = client.get(
            "/api/bk/consultations?skip=0&limit=2",
            headers=counselor_one["headers"],
        )

        assert response.status_code == 200
        body = response.json()
        assert body["total"] == 3
        assert body["page"] == 1
        assert body["limit"] == 2
        assert len(body["data"]) == 2
        assert all(item["student_name"] in {"Siswa Satu", "Siswa Dua", "Siswa Tiga"} for item in body["data"])

        detail_response = client.get(
            f"/api/bk/consultations/{outsider.json()['id']}",
            headers=counselor_one["headers"],
        )
        assert detail_response.status_code == 404

    def test_status_flow_and_dashboard_stats(self, client, counselor_factory, seeded_master_data):
        counselor = counselor_factory(
            email="dashboard-stats@example.com",
            name="Guru BK Stats",
        )
        class_id = seeded_master_data["school_classes"][0]["id"]
        topic_id = seeded_master_data["topics"][0]["id"]
        time_slot_id = seeded_master_data["time_slots"][0]["id"]
        place_id = seeded_master_data["places"][0]["id"]

        pending = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Pending Student",
                student_phone="+6282222222221",
            ),
        )
        accepted = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Accepted Student",
                student_phone="+6282222222222",
            ),
        )
        rejected = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Rejected Student",
                student_phone="+6282222222223",
            ),
        )

        assert pending.status_code == 201
        assert accepted.status_code == 201
        assert rejected.status_code == 201

        accepted_response = client.patch(
            f"/api/bk/consultations/{accepted.json()['id']}/accept",
            headers=counselor["headers"],
        )
        rejected_response = client.patch(
            f"/api/bk/consultations/{rejected.json()['id']}/reject",
            headers=counselor["headers"],
        )

        assert accepted_response.status_code == 200
        assert accepted_response.json()["status"] == "ACCEPTED"
        assert rejected_response.status_code == 200
        assert rejected_response.json()["status"] == "REJECTED"

        stats_response = client.get("/api/bk/dashboard/stats", headers=counselor["headers"])
        assert stats_response.status_code == 200
        assert stats_response.json() == {
            "total": 3,
            "pending": 1,
            "accepted": 1,
            "rejected": 1,
        }

        rejected_list_response = client.get(
            "/api/bk/consultations?status=REJECTED&limit=10",
            headers=counselor["headers"],
        )
        assert rejected_list_response.status_code == 200
        assert rejected_list_response.json()["total"] == 1
        assert rejected_list_response.json()["data"][0]["id"] == rejected.json()["id"]

    def test_delete_consultation(self, client, counselor_factory, seeded_master_data):
        counselor = counselor_factory(
            email="delete-consultation@example.com",
            name="Guru BK Delete",
        )
        class_id = seeded_master_data["school_classes"][0]["id"]
        topic_id = seeded_master_data["topics"][0]["id"]
        time_slot_id = seeded_master_data["time_slots"][0]["id"]
        place_id = seeded_master_data["places"][0]["id"]

        created = client.post(
            "/api/consultations",
            json=_consultation_payload(
                counselor_id=counselor["user"]["id"],
                class_id=class_id,
                topic_id=topic_id,
                time_slot_id=time_slot_id,
                place_id=place_id,
                student_name="Delete Me",
                student_phone="+6283333333333",
            ),
        )

        assert created.status_code == 201

        delete_response = client.delete(
            f"/api/bk/consultations/{created.json()['id']}",
            headers=counselor["headers"],
        )
        assert delete_response.status_code == 204

        detail_response = client.get(
            f"/api/bk/consultations/{created.json()['id']}",
            headers=counselor["headers"],
        )
        assert detail_response.status_code == 404