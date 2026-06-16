# Operations Guide - SafeSpace

## Overview

Dokumen ini menjelaskan panduan operasional aplikasi SafeSpace berbasis Docker dan Microservices.

Stack yang digunakan:

* Docker Compose
* PostgreSQL
* FastAPI
* Nginx Gateway
* Prometheus
* Grafana

---

# 1. Menjalankan Sistem

## Menjalankan monolith

```bash
docker compose up -d --build
```

Melihat status container:

```bash
docker compose ps
```

Melihat log:

```bash
docker compose logs -f
```

Menghentikan sistem:

```bash
docker compose down
```

---

## Menjalankan microservices

```bash
docker compose -f docker-compose.microservices.yml up -d --build
```

Melihat status:

```bash
docker compose -f docker-compose.microservices.yml ps
```

Menghentikan service:

```bash
docker compose -f docker-compose.microservices.yml down
```

---

# 2. Struktur Service

Sistem terdiri dari beberapa service:

* auth-service
* item-service
* gateway (Nginx)
* frontend
* prometheus
* grafana

Setiap service berjalan pada container terpisah.

---

# 3. Port Service

| Service       | Port |
| ------------- | ---- |
| Frontend      |  -   |
| Gateway       | 8080 |
| Auth Service  | 8001 |
| Item Service  | 8002 |
| Prometheus    | 9090 |
| Grafana       | 3002 |

---

# 4. Health Check

Auth Service:

```
GET /health
```

Contoh response:

```json
{
    "status": "healthy",
    "service": "auth-service"
}
```

Item Service:

```
GET /health
```

Contoh response:

```json
{
    "status": "healthy",
    "service": "item-service"
}
```

Health check digunakan Docker Compose untuk memastikan service siap digunakan.

---

# 5. Monitoring Metrics

Auth Service menyediakan endpoint:

```
GET /metrics
```

Item Service menyediakan endpoint:

```
GET /metrics
```

Metrics yang disediakan:

* request_count
* error_count
* error_rate
* latency p50
* latency p95
* latency p99

Data tersebut dapat diambil oleh Prometheus untuk monitoring.

---

# 6. Reverse Proxy Gateway

Gateway menggunakan Nginx sebagai reverse proxy.

Routing:

```
/auth/*
        ↓
Auth Service

/items/*
        ↓
Item Service

/api/auth/*
        ↓
Auth Service

/api/public/*
        ↓
Item Service
```

Gateway berjalan pada port:

```
http://localhost:8080
```

---

# 7. Authentication Flow

1. User login melalui Auth Service.

2. Auth Service menghasilkan JWT Token.

3. Client mengirim Authorization Header:

```
Bearer <token>
```

4. Item Service melakukan verifikasi token ke Auth Service.

5. Jika token valid maka request diproses.

---

# 8. Circuit Breaker

Item Service menggunakan Circuit Breaker saat berkomunikasi dengan Auth Service.

Konfigurasi:

* Failure Threshold = 5
* Cooldown = 30 detik

Jika Auth Service gagal berkali-kali, Circuit Breaker akan membuka koneksi dan sementara menolak request untuk mencegah overload.

---

# 9. Retry Mechanism

Item Service menggunakan retry otomatis ketika Auth Service gagal merespons.

Retry delay:

* 0.5 detik
* 1 detik
* 2 detik

Status yang akan di-retry:

* 500
* 502
* 503
* 504

---

# 10. Monitoring

Prometheus:

```
http://localhost:9090
```

Grafana:

```
http://localhost:3002
```

Grafana menggunakan password default:

```
admin
```

Prometheus mengambil data metrics dari Auth Service dan Item Service.

---

# 11. Database

Auth Service menggunakan database:

```
auth_db
```

Item Service menggunakan database:

```
item_db
```

Database dijalankan menggunakan PostgreSQL 16 Alpine.

---

# 12. Troubleshooting

## Service tidak berjalan

Periksa status container:

```bash
docker compose -f docker-compose.microservices.yml ps
```

---

## Melihat log service

Auth Service:

```bash
docker logs safespace-auth-service
```

Item Service:

```bash
docker logs safespace-item-service
```

Gateway:

```bash
docker logs safespace-gateway
```

---

## Restart service

```bash
docker compose -f docker-compose.microservices.yml restart
```

---

## Rebuild seluruh service

```bash
docker compose -f docker-compose.microservices.yml up -d --build
```

---

# 13. Operational Checklist

Sebelum deployment pastikan:

* Docker Engine aktif
* Seluruh container status healthy
* Database berhasil terkoneksi
* Auth Service dapat diakses
* Item Service dapat diakses
* Gateway berjalan normal
* Prometheus berjalan
* Grafana berjalan
* Endpoint `/health` memberikan status healthy
* Endpoint `/metrics` dapat diakses
* Frontend berhasil terhubung melalui Gateway

Apabila seluruh checklist terpenuhi maka sistem SafeSpace siap dioperasikan.