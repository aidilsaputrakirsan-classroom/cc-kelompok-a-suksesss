import os
import time

import httpx
from fastapi import Header, HTTPException, status

from app.circuit_breaker import CircuitBreaker

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
AUTH_TIMEOUT = float(os.getenv("AUTH_TIMEOUT", "5"))
RETRY_DELAYS = (0.5, 1.0, 2.0)
RETRYABLE_STATUS_CODES = {500, 502, 503, 504}

auth_circuit = CircuitBreaker(name="auth-service", failure_threshold=5, cooldown_seconds=30)


def _parse_token(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak ditemukan")
    return authorization.split(" ", 1)[1].strip()


def _call_verify(token: str) -> dict:
    if not auth_circuit.can_execute():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth Service circuit breaker OPEN. Try again later.",
        )

    headers = {"Authorization": f"Bearer {token}"}
    attempts = len(RETRY_DELAYS) + 1

    for attempt in range(attempts):
        try:
            response = httpx.get(f"{AUTH_SERVICE_URL}/verify", headers=headers, timeout=AUTH_TIMEOUT)
            if response.status_code == 200:
                auth_circuit.record_success()
                return response.json()

            if response.status_code in {401, 403}:
                auth_circuit.record_success()
                detail = response.json().get("detail", "Token tidak valid")
                raise HTTPException(status_code=response.status_code, detail=detail)

            if response.status_code in RETRYABLE_STATUS_CODES:
                if attempt < len(RETRY_DELAYS):
                    time.sleep(RETRY_DELAYS[attempt])
                    continue
                break

            break
        except httpx.RequestError:
            if attempt < len(RETRY_DELAYS):
                time.sleep(RETRY_DELAYS[attempt])
                continue
            break

    auth_circuit.record_failure()
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Auth Service unavailable",
    )


def verify_token_with_auth_service(authorization: str | None = Header(default=None)) -> dict:
    token = _parse_token(authorization)
    return _call_verify(token)


def verify_token_optional(authorization: str | None = Header(default=None)) -> dict | None:
    if auth_circuit.is_open():
        return None

    try:
        return verify_token_with_auth_service(authorization=authorization)
    except HTTPException as exc:
        if exc.status_code == status.HTTP_503_SERVICE_UNAVAILABLE:
            return None
        raise