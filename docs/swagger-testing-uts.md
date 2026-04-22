# 📡 API Testing — Swagger UI (SafeSpace)

Dokumen ini berisi hasil pengujian API menggunakan **Swagger UI** pada aplikasi SafeSpace.  
Pengujian dilakukan untuk memastikan setiap endpoint berjalan dengan baik sesuai fungsinya.

---

## 📍 Informasi Umum

- Nama Aplikasi: SafeSpace  
- Tipe Testing: API Testing (Swagger UI)  
- Tools: Swagger UI  
- URL: http://localhost:8000/docs  
- Tanggal Testing: 21 April 2026

---

## 🎯 Tujuan Pengujian

- Memastikan seluruh endpoint API berfungsi dengan baik  
- Menguji proses autentikasi (JWT)  
- Memvalidasi request & response API  
- Memastikan integrasi backend berjalan dengan benar  

---

> 📸 Beberapa endpoint dilengkapi dengan screenshot sebagai bukti pengujian.

---

## 🔐 A. Authentication (Counselor)

### 1. POST /auth/counselors/register

| Method | Endpoint                  | Deskripsi             | Status |
|--------|--------------------------|----------------------|--------|
| POST   | /auth/counselors/register | Register akun Guru BK | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.3.png)

---

### 2. POST /auth/counselor/login

| Method | Endpoint              | Deskripsi     | Status |
|--------|----------------------|--------------|--------|
| POST   | /auth/counselor/login | Login Guru BK | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.4.png)

---

### 3. POST /auth/counselor/token

| Method | Endpoint              | Deskripsi             | Status |
|--------|----------------------|----------------------|--------|
| POST   | /auth/counselor/token | Generate token OAuth2 | ✅ Pass |

---

### 4. GET /auth/me

| Method | Endpoint | Deskripsi             | Status |
|--------|----------|----------------------|--------|
| GET    | /auth/me | Ambil data user login | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.5.png)
---

### 5. GET /auth/counselor/me

| Method | Endpoint           | Deskripsi                | Status |
|--------|------------------|--------------------------|--------|
| GET    | /auth/counselor/me | Ambil data Guru BK login | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.13.png)

---

## ❤️ B. Health Check

### 6. GET /health

| Method | Endpoint | Deskripsi         | Status |
|--------|----------|------------------|--------|
| GET    | /health  | Cek status server | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.14.png)
---

## 👤 C. Public API (Siswa / Tanpa Login)

### 7. POST /api/consultations

| Method | Endpoint           | Deskripsi                 | Status |
|--------|------------------|--------------------------|--------|
| POST   | /api/consultations | Kirim pengajuan konseling | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.6.png)
---

### 8. GET /api/public/master-data

| Method | Endpoint                | Deskripsi                               | Status |
|--------|-----------------------|----------------------------------------|--------|
| GET    | /api/public/master-data | Ambil data dropdown (kelas, topik, dll) | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.7.png)

---

### 9. GET /api/public/counselors

| Method | Endpoint               | Deskripsi            | Status |
|--------|----------------------|---------------------|--------|
| GET    | /api/public/counselors | Ambil daftar Guru BK | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.8.png)

---

## 👩‍🏫 D. Counselor Dashboard API

### 10. GET /api/bk/dashboard/stats

| Method | Endpoint                | Deskripsi                   | Status |
|--------|-----------------------|----------------------------|--------|
| GET    | /api/bk/dashboard/stats | Statistik dashboard Guru BK | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.15.png)

---

### 11. GET /api/bk/consultations

| Method | Endpoint              | Deskripsi             | Status |
|--------|---------------------|----------------------|--------|
| GET    | /api/bk/consultations | List semua konsultasi | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.16.png)

---

### 12. GET /api/bk/consultations/{consultation_id}

| Method | Endpoint                   | Deskripsi         | Status |
|--------|--------------------------|------------------|--------|
| GET    | /api/bk/consultations/{id} | Detail konsultasi | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.17.png)
---

### 13. DELETE /api/bk/consultations/{consultation_id}

| Method | Endpoint                   | Deskripsi        | Status |
|--------|--------------------------|-----------------|--------|
| DELETE | /api/bk/consultations/{id} | Hapus konsultasi | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.12.png)

---

### 14. PATCH /api/bk/consultations/{consultation_id}/accept

| Method | Endpoint                          | Deskripsi         | Status |
|--------|----------------------------------|------------------|--------|
| PATCH  | /api/bk/consultations/{id}/accept | Accept konsultasi | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.10.png)

---

### 15. PATCH /api/bk/consultations/{consultation_id}/reject

| Method | Endpoint                          | Deskripsi         | Status |
|--------|----------------------------------|------------------|--------|
| PATCH  | /api/bk/consultations/{id}/reject | Reject konsultasi | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.11.png)

---

## 🛠️ E. Dev / Seed API

### 16. POST /api/dev/seed/master-data

| Method | Endpoint                  | Deskripsi        | Status |
|--------|-------------------------|-----------------|--------|
| POST   | /api/dev/seed/master-data | Seed data master | ✅ Pass |

---

### 17. POST /api/dev/seed/counselors

| Method | Endpoint                 | Deskripsi         | Status |
|--------|------------------------|------------------|--------|
| POST   | /api/dev/seed/counselors | Seed akun Guru BK | ✅ Pass |

---

## 👥 F. Team Endpoint

### 18. GET /team

| Method | Endpoint | Deskripsi               | Status |
|--------|----------|------------------------|--------|
| GET    | /team    | Informasi tim developer | ✅ Pass |

📸 **Screenshot:**  
![Testing](./images/CC%209.18.png)

---

## 🔄 G. Authorization Flow

### Langkah:

1. Login sebagai Guru BK  
2. Copy token  
3. Klik **Authorize** di Swagger  
4. Masukkan token  
5. Akses endpoint `/api/bk/*`  

📸 **Screenshot:**  
![Testing](./images/CC%209.1.png)

---

## 📊 Kesimpulan

Berdasarkan hasil pengujian:

- Semua endpoint berjalan dengan baik  
- Sistem autentikasi JWT berfungsi dengan benar  
- API public & protected berjalan sesuai role  
- Tidak ditemukan error kritikal  

✅ Backend SafeSpace dinyatakan **stabil dan siap digunakan**

---

## 📌 Catatan

- Endpoint `/api/public/*` dapat diakses tanpa login  
- Endpoint `/api/bk/*` membutuhkan autentikasi (token)  
- Pengujian dilakukan menggunakan Swagger UI secara manual  