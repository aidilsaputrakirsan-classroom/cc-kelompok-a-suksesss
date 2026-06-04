# Item Service

Microservice inventory untuk Modul 12/13.

## Endpoint
- `GET /health`
- `POST /items`
- `GET /items`
- `GET /items/public`
- `GET /items/{item_id}`
- `PUT /items/{item_id}`
- `DELETE /items/{item_id}`
- `GET /items/stats`

## Catatan
- `GET /items/stats` tetap bisa melayani request saat Auth Service masuk mode degraded (circuit breaker OPEN).
- `GET /items/public` tidak membutuhkan autentikasi dan hanya mengembalikan item dengan `is_public=true`.

## Run
```bash
uvicorn app.main:app --reload --port 8002
```
