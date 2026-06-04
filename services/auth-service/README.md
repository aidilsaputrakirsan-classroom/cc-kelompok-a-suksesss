# Auth Service

Microservice autentikasi untuk Modul 12/13.

## Endpoint
- `GET /health`
- `POST /register`
- `POST /login`
- `GET /verify`

## Run
```bash
uvicorn app.main:app --reload --port 8001
```
