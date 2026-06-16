# API Contract — SafeSpace

## 1. Overview

Dokumen ini menjelaskan kontrak API yang digunakan pada aplikasi **SafeSpace**, sebuah platform layanan konsultasi dan bimbingan konseling berbasis cloud-native microservices.

API dikembangkan menggunakan framework **FastAPI** dan diakses melalui **API Gateway (Nginx)** sebagai entry point utama. Seluruh komunikasi antar service menggunakan format data JSON.

---

## 2. Base URLs

| Environment       | URL                               |
| ----------------- | --------------------------------- |
| Local Development | http://localhost:8080             |
| Production        | https://safespace-db.onrender.com |

---

## 3. Authentication

Endpoint yang memerlukan autentikasi menggunakan **JSON Web Token (JWT)** yang dikirim melalui HTTP Header.

### Header Format

```http
Authorization: Bearer <access_token>
```

Token diperoleh melalui endpoint login:

```http
POST /auth/counselor/login
```

Token digunakan untuk mengakses endpoint dashboard dan manajemen konsultasi yang memerlukan hak akses Guru BK.

---

## 4. Content Type

Seluruh request dan response menggunakan format:

```http
Content-Type: application/json
```

---

## 5. Standard Error Response

Apabila terjadi kesalahan, API akan mengembalikan format response berikut:

```json
{
  "detail": "Error message"
}
```

### HTTP Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Resource Created      |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Resource Not Found    |
| 422         | Validation Error      |
| 500         | Internal Server Error |

---

# 6. Auth Service

Service autentikasi bertanggung jawab terhadap proses registrasi, login, validasi token, dan pengelolaan informasi pengguna.

---

## 6.1 Register Counselor

| Attribute      | Value                       |
| -------------- | --------------------------- |
| Method         | POST                        |
| Endpoint       | `/auth/counselors/register` |
| Authentication | No                          |

### Description

Digunakan untuk membuat akun Guru BK baru.

### Success Response

```json
{
  "id": 1,
  "email": "counselor@example.com",
  "name": "Counselor Name"
}
```

---

## 6.2 Login Counselor

| Attribute      | Value                   |
| -------------- | ----------------------- |
| Method         | POST                    |
| Endpoint       | `/auth/counselor/login` |
| Authentication | No                      |

### Description

Digunakan untuk melakukan autentikasi dan memperoleh JWT Token.

### Success Response

```json
{
  "access_token": "jwt_token",
  "token_type": "bearer"
}
```

---

## 6.3 OAuth Login

| Attribute      | Value                   |
| -------------- | ----------------------- |
| Method         | POST                    |
| Endpoint       | `/auth/counselor/token` |
| Authentication | No                      |

### Description

Endpoint OAuth2 yang digunakan oleh Swagger UI untuk proses login.

---

## 6.4 Get Current User

| Attribute      | Value      |
| -------------- | ---------- |
| Method         | GET        |
| Endpoint       | `/auth/me` |
| Authentication | Yes        |

### Description

Mengambil informasi user yang sedang login.

---

## 6.5 Get Current Counselor

| Attribute      | Value                |
| -------------- | -------------------- |
| Method         | GET                  |
| Endpoint       | `/auth/counselor/me` |
| Authentication | Yes                  |

### Description

Mengambil informasi Guru BK yang sedang aktif.

---

# 7. Consultation Service

Service konsultasi bertanggung jawab terhadap seluruh proses pengajuan dan pengelolaan konsultasi siswa.

---

## 7.1 Create Consultation

| Attribute      | Value                |
| -------------- | -------------------- |
| Method         | POST                 |
| Endpoint       | `/api/consultations` |
| Authentication | No                   |

### Description

Digunakan oleh siswa untuk membuat pengajuan konsultasi baru.

---

## 7.2 Get Consultation List

| Attribute      | Value                   |
| -------------- | ----------------------- |
| Method         | GET                     |
| Endpoint       | `/api/bk/consultations` |
| Authentication | Yes                     |

### Description

Menampilkan seluruh konsultasi yang menjadi tanggung jawab Guru BK.

---

## 7.3 Get Consultation Detail

| Attribute      | Value                        |
| -------------- | ---------------------------- |
| Method         | GET                          |
| Endpoint       | `/api/bk/consultations/{id}` |
| Authentication | Yes                          |

### Description

Menampilkan detail konsultasi berdasarkan ID.

---

## 7.4 Accept Consultation

| Attribute      | Value                               |
| -------------- | ----------------------------------- |
| Method         | PATCH                               |
| Endpoint       | `/api/bk/consultations/{id}/accept` |
| Authentication | Yes                                 |

### Description

Mengubah status konsultasi menjadi Accepted.

---

## 7.5 Reject Consultation

| Attribute      | Value                               |
| -------------- | ----------------------------------- |
| Method         | PATCH                               |
| Endpoint       | `/api/bk/consultations/{id}/reject` |
| Authentication | Yes                                 |

### Description

Mengubah status konsultasi menjadi Rejected.

---

## 7.6 Delete Consultation

| Attribute      | Value                        |
| -------------- | ---------------------------- |
| Method         | DELETE                       |
| Endpoint       | `/api/bk/consultations/{id}` |
| Authentication | Yes                          |

### Description

Menghapus data konsultasi dari sistem.

---

# 8. Dashboard Service

Service dashboard digunakan untuk menyediakan statistik konsultasi yang ditampilkan pada dashboard Guru BK.

---

## 8.1 Dashboard Statistics

| Attribute      | Value                     |
| -------------- | ------------------------- |
| Method         | GET                       |
| Endpoint       | `/api/bk/dashboard/stats` |
| Authentication | Yes                       |

### Description

Menampilkan statistik konsultasi berdasarkan status.

---

# 9. Public Service

Endpoint publik yang dapat diakses tanpa proses autentikasi.

---

## 9.1 Master Data

| Attribute      | Value                     |
| -------------- | ------------------------- |
| Method         | GET                       |
| Endpoint       | `/api/public/master-data` |
| Authentication | No                        |

### Description

Mengambil data master yang digunakan oleh aplikasi.

---

## 9.2 Counselor List

| Attribute      | Value                    |
| -------------- | ------------------------ |
| Method         | GET                      |
| Endpoint       | `/api/public/counselors` |
| Authentication | No                       |

### Description

Mengambil daftar Guru BK yang tersedia.

---

# 10. Monitoring Service

Service monitoring digunakan untuk mendukung observability dan health checking aplikasi.

---

## 10.1 Health Check

| Attribute      | Value     |
| -------------- | --------- |
| Method         | GET       |
| Endpoint       | `/health` |
| Authentication | No        |

### Description

Memastikan aplikasi berjalan dengan baik.

---

## 10.2 Monitoring Health

| Attribute      | Value                |
| -------------- | -------------------- |
| Method         | GET                  |
| Endpoint       | `/monitoring/health` |
| Authentication | No                   |

### Description

Menampilkan status kesehatan monitoring service.

---

## 10.3 Error Rate Monitoring

| Attribute      | Value                    |
| -------------- | ------------------------ |
| Method         | GET                      |
| Endpoint       | `/monitoring/error-rate` |
| Authentication | No                       |

### Description

Menampilkan informasi tingkat error aplikasi.

---

## 10.4 Team Information

| Attribute      | Value   |
| -------------- | ------- |
| Method         | GET     |
| Endpoint       | `/team` |
| Authentication | No      |

### Description

Menampilkan informasi tim pengembang.

---

# 11. Service Communication

SafeSpace menerapkan arsitektur microservices dengan pola komunikasi sebagai berikut:

```text
Frontend
    │
    ▼
API Gateway (Nginx)
    │
 ┌──┴──────────────┐
 ▼                 ▼
Auth Service   Consultation Service
    │                 │
    ▼                 ▼
Auth DB      Consultation DB
```

Consultation Service akan melakukan validasi token ke Auth Service untuk memastikan pengguna memiliki hak akses yang sesuai sebelum mengakses endpoint yang dilindungi.

---

# 12. API Documentation

Dokumentasi API interaktif tersedia melalui Swagger UI:

### Local

```text
http://localhost:8080/docs
```

### Production

```text
https://safespace-db.onrender.com/docs
```

Swagger digunakan sebagai referensi utama selama proses pengembangan, pengujian, dan integrasi API.