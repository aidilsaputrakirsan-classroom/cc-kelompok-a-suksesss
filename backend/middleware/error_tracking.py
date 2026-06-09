from __future__ import annotations

import logging
import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from utils.error_tracker import error_tracker


class ErrorTrackingMiddleware(BaseHTTPMiddleware):
    """Middleware untuk memantau error rate semua request."""

    def __init__(self, app):
        super().__init__(app)
        self.logger = logging.getLogger("safespace.middleware.error_tracking")

    async def dispatch(self, request: Request, call_next):
        started_at = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            error_tracker.log_request(
                is_error=True,
                request_path=request.url.path,
                method=request.method,
                status_code=500,
            )
            raise

        duration_ms = round((time.perf_counter() - started_at) * 1000, 2)
        is_error = response.status_code >= 500

        error_tracker.log_request(
            is_error=is_error,
            request_path=request.url.path,
            method=request.method,
            status_code=response.status_code,
            duration_ms=duration_ms,
        )

        if is_error:
            self.logger.error(
                "Request completed with server error",
                extra={
                    "request_path": request.url.path,
                    "method": request.method,
                    "status_code": response.status_code,
                    "duration_ms": duration_ms,
                },
            )

        return response