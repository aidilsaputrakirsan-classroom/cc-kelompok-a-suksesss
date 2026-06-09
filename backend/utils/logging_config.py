from __future__ import annotations

import json
import logging
from datetime import datetime, timezone


class JSONFormatter(logging.Formatter):
    """Format log sebagai JSON untuk structured logging."""

    def __init__(self, service_name: str = "SafeSpace"):
        super().__init__()
        self.service_name = service_name

    def format(self, record):
        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "service": self.service_name,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        for field_name in (
            "alert",
            "error_rate",
            "threshold",
            "window_seconds",
            "request_path",
            "method",
            "status_code",
            "duration_ms",
            "correlation_id",
        ):
            if hasattr(record, field_name):
                log_data[field_name] = getattr(record, field_name)

        return json.dumps(log_data, default=str)


def setup_logging(log_level: str = "INFO", service_name: str = "SafeSpace"):
    """Setup structured logging yang aman untuk development dan production."""
    logger = logging.getLogger("safespace")
    resolved_level = getattr(logging, str(log_level).upper(), logging.INFO)
    logger.setLevel(resolved_level)
    logger.propagate = False

    handler = None
    for existing_handler in logger.handlers:
        if getattr(existing_handler, "_safespace_json", False):
            handler = existing_handler
            break

    if handler is None:
        handler = logging.StreamHandler()
        handler._safespace_json = True  # type: ignore[attr-defined]
        logger.addHandler(handler)

    handler.setLevel(resolved_level)
    handler.setFormatter(JSONFormatter(service_name=service_name))

    return logger