from __future__ import annotations

import logging
import threading
import time
from collections import deque
from datetime import datetime, timezone


class ErrorRateTracker:
    """
    Track error rate dalam window time 1 menit.
    Trigger alert jika error rate > threshold.
    """

    def __init__(self, window_seconds: int = 60, threshold: float = 0.10):
        self.window_seconds = window_seconds
        self.threshold = threshold
        self.requests = deque()
        self._lock = threading.Lock()
        self.logger = logging.getLogger("safespace.error_tracker")

    def log_request(self, is_error: bool = False, **context):
        """Log request dan cek apakah error rate melewati threshold."""
        now = time.time()
        with self._lock:
            self.requests.append((now, is_error))
            self._cleanup_old_entries(now)
            error_rate = self.get_error_rate()

        if error_rate > self.threshold:
            self._trigger_alert(error_rate, **context)

    def _cleanup_old_entries(self, now: float | None = None):
        """Hapus entry yang lebih tua dari window."""
        cutoff = (now if now is not None else time.time()) - self.window_seconds
        while self.requests and self.requests[0][0] < cutoff:
            self.requests.popleft()

    def get_error_rate(self) -> float:
        """Hitung error rate dalam window."""
        if not self.requests:
            return 0.0

        total = len(self.requests)
        errors = sum(1 for _, is_error in self.requests if is_error)
        return errors / total if total > 0 else 0.0

    def get_stats(self) -> dict:
        """Kembalikan statistik ringkas untuk endpoint monitoring."""
        with self._lock:
            self._cleanup_old_entries()
            total = len(self.requests)
            errors = sum(1 for _, is_error in self.requests if is_error)

        error_rate = errors / total if total > 0 else 0.0
        return {
            "error_rate": error_rate,
            "error_count": errors,
            "request_count": total,
            "threshold": self.threshold,
            "window_seconds": self.window_seconds,
            "alert_triggered": error_rate > self.threshold,
        }

    def reset(self):
        """Bersihkan state tracker untuk kebutuhan test."""
        with self._lock:
            self.requests.clear()

    def _trigger_alert(self, error_rate: float, **context):
        """Trigger alert dengan log level CRITICAL."""
        alert_message = (
            f"HIGH ERROR RATE ALERT: {error_rate:.2%} "
            f"(threshold: {self.threshold:.2%}) in last {self.window_seconds}s"
        )

        extra = {
            "alert": True,
            "error_rate": error_rate,
            "threshold": self.threshold,
            "window_seconds": self.window_seconds,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        if context:
            extra.update(context)

        self.logger.critical(alert_message, extra=extra)


error_tracker = ErrorRateTracker()