## 🏗️ Arsitektur Sistem

Arsitektur SafeSpace menggunakan pendekatan **3-tier architecture** yang dipisahkan menjadi frontend, backend, dan database, serta didukung oleh containerization menggunakan Docker.

---

### 🔷 1. High-Level Architecture

```mermaid
graph LR
    User((User))

    subgraph Frontend
        FE[React App - Nginx - Port 3000]
    end

    subgraph Backend
        BE[FastAPI Server - Port 8000]
    end

    subgraph Database
        DB[(PostgreSQL - Port 5432)]
    end

    User --> FE
    FE --> BE
    BE --> DB
    DB --> BE
    BE --> FE
```

📌 **Penjelasan:**
- User (Siswa & Guru BK) mengakses aplikasi melalui browser
- Frontend mengirim request ke backend melalui REST API
- Backend memproses data & berinteraksi dengan database
- Response dikembalikan dalam bentuk JSON ke frontend

---

### 🔷 2. Docker Multi-Container Architecture

```mermaid
graph TD
    subgraph cloudnet
        FE[Frontend Container - Port 3000]
        BE[Backend Container - Port 8000]
        DB[Database Container - PostgreSQL]
    end

    FE --> BE
    BE --> DB
    DB --> BE
    BE --> FE
```

📌 **Penjelasan:**
- Semua service berjalan dalam container terpisah
- Terhubung melalui Docker network `cloudnet`
- Backend menggunakan hostname `db` untuk akses database
- Data database disimpan menggunakan Docker volume (`pgdata`)

---

### 🔷 3. Backend Architecture (FastAPI)

```mermaid
graph TD
    Client --> Router

    Router --> Auth
    Router --> Validation
    Router --> Logic

    Logic --> DB[(PostgreSQL)]
```

📌 **Penjelasan:**
- API Router menangani endpoint (auth, consultations, dashboard)
- Authentication (JWT) melindungi akses Guru BK
- Validation memastikan data request valid
- Business Logic mengelola proses konsultasi
- Database menyimpan data

---

### 🔷 4. Frontend Architecture (React)

```mermaid
graph TD
    UI --> State
    State --> API
    API --> Backend
```

📌 **Penjelasan:**
- UI Components: halaman & form
- State Management: menyimpan data & token
- API Service: komunikasi ke backend
- Backend: memproses request

---

### 🔷 5. Alur Sistem SafeSpace (Use Case Flow)

```mermaid
sequenceDiagram
    participant Siswa
    participant Frontend
    participant Backend
    participant Database
    participant GuruBK

    Siswa->>Frontend: Isi form
    Frontend->>Backend: POST consultation
    Backend->>Database: Simpan data
    Backend-->>Frontend: Tracking Code
    Frontend-->>Siswa: Tampilkan kode

    GuruBK->>Frontend: Login
    Frontend->>Backend: POST login
    Backend-->>Frontend: Token

    Frontend->>Backend: GET consultations
    Backend->>Database: Ambil data
    Backend-->>Frontend: Data

    GuruBK->>Frontend: Accept/Reject
    Frontend->>Backend: PATCH
    Backend->>Database: Update
    Backend-->>Frontend: Response
```

📌 **Penjelasan:**
- Siswa dapat mengajukan konsultasi tanpa login
- Sistem menghasilkan tracking code
- Guru BK login untuk mengelola konsultasi
- Data terisolasi per guru BK
- Accept/reject dilakukan secara real-time

---

### 🔷 6. Keunggulan Arsitektur

- Modular (frontend, backend, database terpisah)
- Secure (JWT authentication)
- Scalable (mudah dikembangkan)
- Cloud-ready (Docker)
- Privacy-first (data terisolasi)

---

## ✅ Kesimpulan

Arsitektur SafeSpace dirancang untuk:
- Mendukung layanan konseling yang aman & privat
- Memastikan pemisahan tanggung jawab sistem
- Memudahkan deployment dan pengembangan

Dengan kombinasi React, FastAPI, PostgreSQL, dan Docker, aplikasi ini menjadi solusi digital yang modern, aman, dan scalable.