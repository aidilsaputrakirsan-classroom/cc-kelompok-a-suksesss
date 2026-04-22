## 🏗️ Arsitektur Sistem

Arsitektur SafeSpace menggunakan pendekatan **3-tier architecture** yang dipisahkan menjadi frontend, backend, dan database, serta didukung oleh containerization menggunakan Docker.

---

### 🔷 1. High-Level Architecture

```mermaid
graph LR
    User((👤 User))
    
    subgraph Frontend
        FE["🌐 React App (Nginx)<br/>localhost:3000"]
    end
    
    subgraph Backend
        BE["⚡ FastAPI Server<br/>localhost:8000"]
    end
    
    subgraph Database
        DB[("🐘 PostgreSQL<br/>Port 5432")]
    end

    User --> FE
    FE -->|HTTP Request| BE
    BE -->|SQL Query| DB
    DB -->|Data Response| BE
    BE -->|JSON Response| FE
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
    subgraph Docker Network: cloudnet
        FE["Frontend Container<br/>React + Nginx<br/>Port 3000"]
        BE["Backend Container<br/>FastAPI<br/>Port 8000"]
        DB["Database Container<br/>PostgreSQL<br/>Port 5432"]
    end

    FE -->|API Call| BE
    BE -->|Query| DB
    DB -->|Result| BE
    BE -->|Response| FE
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
    Client["Client Request"] --> Router["📡 API Router"]
    
    Router --> Auth["🔐 Authentication (JWT)"]
    Router --> Validation["📋 Validation (Pydantic)"]
    Router --> Logic["🧠 Business Logic (CRUD Konsultasi)"]
    
    Logic --> DB[("🐘 PostgreSQL Database")]
```

📌 **Penjelasan:**
- **API Router** → menangani endpoint (auth, consultations, dashboard)
- **Authentication (JWT)** → melindungi akses khusus Guru BK
- **Validation (Pydantic)** → memastikan data request valid
- **Business Logic** → mengelola proses konsultasi (create, accept, reject)
- **Database** → menyimpan data siswa & konsultasi

---

### 🔷 4. Frontend Architecture (React)

```mermaid
graph TD
    UI["🖥️ UI Components"] --> State["📦 State Management"]
    State --> API["📡 API Service (Axios)"]
    API --> Backend["⚡ FastAPI Backend"]
```

📌 **Penjelasan:**
- **UI Components** → halaman utama, form konsultasi, dashboard BK
- **State Management** → menyimpan state (form input, auth token)
- **API Service (Axios)** → komunikasi ke backend
- **Backend** → memproses request & mengembalikan data

---

### 🔷 5. Alur Sistem SafeSpace (Use Case Flow)

```mermaid
sequenceDiagram
    participant Siswa
    participant Frontend
    participant Backend
    participant Database
    participant GuruBK

    Siswa->>Frontend: Isi form konsultasi
    Frontend->>Backend: POST /api/consultations
    Backend->>Database: Simpan data
    Backend-->>Frontend: Tracking Code
    Frontend-->>Siswa: Tampilkan kode

    GuruBK->>Frontend: Login
    Frontend->>Backend: POST /auth/login
    Backend-->>Frontend: JWT Token

    Frontend->>Backend: GET /api/bk/consultations
    Backend->>Database: Ambil data sesuai guru
    Backend-->>Frontend: Data konsultasi

    GuruBK->>Frontend: Accept / Reject
    Frontend->>Backend: PATCH endpoint
    Backend->>Database: Update status
    Backend-->>Frontend: Response sukses
```

📌 **Penjelasan:**
- Siswa dapat mengajukan konsultasi tanpa login
- Sistem menghasilkan tracking code
- Guru BK login untuk mengelola konsultasi
- Data bersifat **terisolasi per guru BK**
- Proses accept/reject dilakukan secara real-time

---

### 🔷 6. Keunggulan Arsitektur

- 🧩 **Modular** → frontend, backend, database terpisah
- 🔐 **Secure** → JWT authentication untuk akses terbatas
- ⚡ **Scalable** → mudah dikembangkan dan ditambah fitur
- ☁️ **Cloud-ready** → siap deploy menggunakan Docker
- 🔒 **Privacy-first** → data konsultasi hanya dapat diakses oleh guru terkait

---

## ✅ Kesimpulan

Arsitektur SafeSpace dirancang untuk:
- Mendukung layanan konseling yang aman & privat
- Memastikan pemisahan tanggung jawab antar sistem
- Memudahkan deployment dan pengembangan berkelanjutan

Dengan kombinasi React, FastAPI, PostgreSQL, dan Docker, aplikasi ini menjadi solusi digital yang **modern, aman, dan scalable**.