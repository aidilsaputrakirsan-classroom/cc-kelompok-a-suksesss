import os

import httpx
from fastapi import Depends, HTTPException, Header, status

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
AUTH_TIMEOUT = float(os.getenv("AUTH_TIMEOUT", "5"))


def verify_token_with_auth_service(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token tidak ditemukan")

    token = authorization.split(" ", 1)[1].strip()
    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = httpx.get(f"{AUTH_SERVICE_URL}/verify", headers=headers, timeout=AUTH_TIMEOUT)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth Service unavailable") from exc

    if response.status_code != 200:
        try:
            detail = response.json().get("detail")
        except ValueError:
            detail = None

        detail = detail or "Token tidak valid"
        if response.status_code in {401, 403}:
            raise HTTPException(status_code=response.status_code, detail=detail)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth Service unavailable")

    return response.json()
