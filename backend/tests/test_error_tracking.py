from __future__ import annotations

import json
import logging
from datetime import date, timedelta

import pytest
from fastapi.responses import JSONResponse

from main import app
from utils.error_tracker import ErrorRateTracker, error_tracker
from utils.logging_config import JSONFormatter


@app.get("/__test__/server-error")
def server_error():
    return JSONResponse(status_code=500, content={"detail": "boom"})


@pytest.fixture(autouse=True)
def reset_tracker_state():
    error_tracker.reset()
    yield
    error_tracker.reset()


class TestErrorRateTracker:
    def test_error_rate_below_threshold_does_not_alert(self, monkeypatch):
        tracker = ErrorRateTracker(window_seconds=60, threshold=0.10)
        critical_calls: list[tuple[tuple, dict]] = []

        def fake_critical(*args, **kwargs):
            critical_calls.append((args, kwargs))

        monkeypatch.setattr(tracker.logger, "critical", fake_critical)

        for _ in range(92):
            tracker.log_request(is_error=False)
        for _ in range(8):
            tracker.log_request(is_error=True)

        assert tracker.get_error_rate() == pytest.approx(0.08)
        assert critical_calls == []

    def test_error_rate_above_threshold_triggers_alert(self, monkeypatch):
        tracker = ErrorRateTracker(window_seconds=60, threshold=0.10)
        critical_calls: list[tuple[tuple, dict]] = []

        def fake_critical(*args, **kwargs):
            critical_calls.append((args, kwargs))

        monkeypatch.setattr(tracker.logger, "critical", fake_critical)

        for _ in range(80):
            tracker.log_request(is_error=False)
        for _ in range(20):
            tracker.log_request(is_error=True)

        assert tracker.get_error_rate() == pytest.approx(0.20)
        assert tracker.get_error_rate() > tracker.threshold
        assert critical_calls

        message_args, message_kwargs = critical_calls[0]
        assert "HIGH ERROR RATE ALERT" in message_args[0]
        assert message_kwargs["extra"]["alert"] is True
        assert message_kwargs["extra"]["threshold"] == pytest.approx(0.10)


class TestLoggingConfig:
    def test_json_formatter_includes_alert_field(self):
        formatter = JSONFormatter(service_name="SafeSpace")
        record = logging.LogRecord(
            name="safespace.error_tracker",
            level=logging.CRITICAL,
            pathname=__file__,
            lineno=42,
            msg="HIGH ERROR RATE ALERT",
            args=(),
            exc_info=None,
        )
        record.alert = True
        record.error_rate = 0.25
        record.threshold = 0.10
        record.window_seconds = 60

        payload = json.loads(formatter.format(record))

        assert payload["service"] == "SafeSpace"
        assert payload["level"] == "CRITICAL"
        assert payload["alert"] is True
        assert payload["error_rate"] == pytest.approx(0.25)
        assert payload["threshold"] == pytest.approx(0.10)
        assert payload["window_seconds"] == 60


class TestMonitoringAndWhatsAppIntegration:
    def test_monitoring_endpoint_reports_error_rate(self, client):
        for _ in range(9):
            error_tracker.log_request(is_error=False)
        error_tracker.log_request(is_error=True)

        response = client.get("/monitoring/error-rate")

        assert response.status_code == 200
        payload = response.json()
        assert payload["request_count"] == 10
        assert payload["error_count"] == 1
        assert payload["error_rate"] == pytest.approx(0.10)
        assert payload["alert_triggered"] is False

    def test_error_tracking_middleware_counts_server_errors(self, client):
        response = client.get("/__test__/server-error")

        assert response.status_code == 500
        stats = error_tracker.get_stats()
        assert stats["request_count"] == 1
        assert stats["error_count"] == 1
        assert stats["alert_triggered"] is True

    def test_whatsapp_link_generated_for_accepted_consultation(self, client, counselor_factory, seeded_master_data):
        counselor = counselor_factory(
            email="whatsapp-alert@example.com",
            name="Guru BK WhatsApp",
        )

        class_id = seeded_master_data["school_classes"][0]["id"]
        topic_id = seeded_master_data["topics"][0]["id"]
        time_slot_id = seeded_master_data["time_slots"][0]["id"]
        place_id = seeded_master_data["places"][0]["id"]

        create_response = client.post(
            "/api/consultations",
            json={
                "student_name": "Siswa WhatsApp",
                "class_id": class_id,
                "gender": "MALE",
                "student_phone": "+6281234567890",
                "counselor_id": counselor["user"]["id"],
                "method": "INDIVIDUAL",
                "topic_id": topic_id,
                "date": (date.today() + timedelta(days=1)).isoformat(),
                "time_slot_id": time_slot_id,
                "place_id": place_id,
            },
        )

        assert create_response.status_code == 201

        accept_response = client.patch(
            f"/api/bk/consultations/{create_response.json()['id']}/accept",
            headers=counselor["headers"],
        )
        assert accept_response.status_code == 200

        list_response = client.get("/api/bk/consultations", headers=counselor["headers"])
        assert list_response.status_code == 200

        response_payload = list_response.json()
        consultation_item = response_payload["data"][0]
        assert consultation_item["whatsapp_link"].startswith("https://wa.me/")
        assert "text=" in consultation_item["whatsapp_link"]