# 📡 API Contract — SafeSpace Cloud Microservices

---

# SafeSpace Cloud Native Platform

Dokumen ini menjelaskan kontrak API (API Contract) yang digunakan pada aplikasi **SafeSpace**, sebuah platform layanan bimbingan konseling berbasis cloud-native microservices.

Dokumen ini digunakan sebagai acuan komunikasi antar service maupun integrasi frontend dengan backend.

---

# 🌐 Base URLs

## Local Development

| Service          | URL                        |
| ---------------- | -------------------------- |
| Frontend         | http://localhost:3000      |
| API Gateway      | http://localhost:8080      |
| Backend Monolith | http://localhost:8000      |
| Swagger API      | http://localhost:8000/docs |
| Prometheus       | http://localhost:9090      |
| Grafana          | http://localhost:3002      |

---

## Production

| Service     | URL                                    |
| ----------- | -------------------------------------- |
| Frontend    | https://safespace-itk.onrender.com     |
| Backend API | https://safespace-db.onrender.com      |
| Swagger API | https://safespace-db.onrender.com/docs |

---

# 🔐 Authentication

Endpoint yang bersifat protected memerlukan JWT Token.

Header:

```http
Authorization: Bearer <access_token>
```

Token diperoleh melalui endpoint login counselor.

```
POST /auth/counselor/login
```

atau

```
POST /auth/counselor/token
```

Default token expiration:

```
30 Minutes
```

Konfigurasi dapat diubah melalui:

```
ACCESS_TOKEN_EXPIRE_MINUTES
```

---

# 📦 Response Format

## Success Response

```json
{
    "message": "success",
    "data": {}
}
```

atau sesuai schema endpoint.

---

## Error Response

```json
{
    "detail": "Error message description"
}
```

---

# 📋 HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 204  | Deleted Successfully  |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Resource Not Found    |
| 422  | Validation Error      |
| 500  | Internal Server Error |
| 503  | Service Unavailable   |

---

# 🔐 Authentication Service

## Register Counselor

```
POST /auth/counselors/register
```

Authentication:

```
Public
```

Body

```json
{
    "name": "string",
    "email": "string",
    "password": "string"
}
```

Response

```json
{
    "id": 1,
    "email": "guru@example.com",
    "name": "Guru BK"
}
```

---

## Login Counselor

```
POST /auth/counselor/login
```

Authentication

```
Public
```

Body

```json
{
    "email": "guru@example.com",
    "password": "password"
}
```

Response

```json
{
    "access_token": "...",
    "token_type": "bearer"
}
```

---

## OAuth2 Login

```
POST /auth/counselor/token
```

Digunakan untuk Swagger Authorization (OAuth2).

---

## Current User

```
GET /auth/me
```

Authentication

```
Required
```

Response

```json
{
    "id": 1,
    "email": "guru@example.com"
}
```

---

## Current Counselor

```
GET /auth/counselor/me
```

Authentication

```
Required
```

Mengembalikan data counselor yang sedang login.

---

# 👨‍🎓 Public API

---

## Get Public Counselors

```
GET /api/public/counselors
```

Authentication

```
Public
```

Response

```json
[
    {
        "id": 1,
        "name": "Guru BK"
    }
]
```

---

## Get Master Data

```
GET /api/public/master-data
```

Authentication

```
Public
```

Mengembalikan data kelas, topik konseling, dan data pendukung lainnya.

---

# 💬 Consultation Service

---

## Create Guest Consultation

```
POST /api/consultations
```

Authentication

```
Public
```

Body

```json
{
    "student_name": "string",
    "class_name": "string",
    "topic": "string",
    "message": "string",
    "counselor_id": 1
}
```

Response

```json
{
    "tracking_code": "ABC123"
}
```

---

# 👩‍🏫 BK Dashboard Service

---

## Dashboard Statistics

```
GET /api/bk/dashboard/stats
```

Authentication

```
Required
```

Mengembalikan statistik konsultasi counselor.

---

## List Consultations

```
GET /api/bk/consultations
```

Authentication

```
Required
```

Mengembalikan seluruh konsultasi milik counselor yang sedang login.

---

## Consultation Detail

```
GET /api/bk/consultations/{consultation_id}
```

Authentication

```
Required
```

Mengembalikan detail konsultasi berdasarkan ID.

---

## Accept Consultation

```
PATCH /api/bk/consultations/{consultation_id}/accept
```

Authentication

```
Required
```

Mengubah status konsultasi menjadi Accepted.

---

## Reject Consultation

```
PATCH /api/bk/consultations/{consultation_id}/reject
```

Authentication

```
Required
```

Mengubah status konsultasi menjadi Rejected.

---

## Delete Consultation

```
DELETE /api/bk/consultations/{consultation_id}
```

Authentication

```
Required
```

Menghapus data konsultasi.

Response

```
204 No Content
```

---

# ⚙️ Development Endpoints

Digunakan hanya pada environment development.

---

## Seed Master Data

```
POST /api/dev/seed/master-data
```

Mengisi data master awal.

---

## Seed Counselors

```
POST /api/dev/seed/counselors
```

Mengisi data counselor awal.

---

# ❤️ Health Check

```
GET /health
```

Authentication

```
Public
```

Response

```json
{
    "status": "healthy"
}
```

Digunakan untuk:

* Docker Health Check
* CI/CD Validation
* Monitoring Service
* Deployment Verification

---

# 👥 Team Information

```
GET /team
```

Authentication

```
Public
```

Mengembalikan informasi tim pengembang SafeSpace.

---

# 🌐 API Gateway

Pada arsitektur microservices, seluruh request akan diteruskan melalui API Gateway (Nginx).

Routing:

```
/auth/*
→ Auth Service

/api/public/*
→ Item Service

/items/*
→ Item Service

/health
→ Auth Service
```

Gateway bertugas sebagai reverse proxy dan entry point seluruh service.

---

# 📊 Monitoring Endpoints

## Prometheus

```
http://localhost:9090
```

Targets

```
http://localhost:9090/targets
```

Digunakan untuk monitoring metrics seluruh microservices.

---

## Grafana Dashboard

```
http://localhost:3002
```

Credential:

```
Username : admin
Password : admin
```

Dashboard digunakan untuk visualisasi metrics Prometheus secara realtime.

---

# 🔒 Security Notes

* Authentication menggunakan JWT Bearer Token.
* Environment variables digunakan untuk seluruh secret aplikasi.
* Database dipisahkan untuk masing-masing service.
* Validasi input dilakukan menggunakan Pydantic.
* CORS dikonfigurasi melalui environment.
* Docker Network digunakan untuk komunikasi internal antar service.

---

**SafeSpace API Contract v3.0.0**
Cloud Native Counseling Platform
Institut Teknologi Kalimantan — Komputasi Awan
