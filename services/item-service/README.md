# Item Service

Microservice inventory untuk Modul 12/13.

## Endpoint
- `GET /health`
- `POST /items`
- `GET /items`
- `GET /items/{item_id}`
- `PUT /items/{item_id}`
- `DELETE /items/{item_id}`
- `GET /items/stats`

## Run
```bash
uvicorn app.main:app --reload --port 8002
```
