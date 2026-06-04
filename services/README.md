# Microservices Scaffold

Base branch yang dipakai untuk Modul 12/13 di repo ini adalah `main`, karena tidak ada branch microservices terpisah yang sudah berisi skeleton item-service/auth-service.

## Struktur
- `auth-service/` - service autentikasi terpisah
- `item-service/` - service inventory dan stats

## Run
```bash
docker compose -f docker-compose.microservices.yml up -d --build
```

## Port
- Auth Service: `http://localhost:8001`
- Item Service: `http://localhost:8002`

## Catatan Modul
- Modul 12: fokus ke pemisahan Auth Service, Item Service, dan endpoint stats.
- Modul 13: fokus ke graceful degradation, circuit breaker, dan public endpoint.
