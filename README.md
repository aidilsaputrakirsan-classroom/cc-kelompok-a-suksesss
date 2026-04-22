# 🧠 SafeSpace — Platform Konseling Aman & Privat

> **SafeSpace** adalah aplikasi berbasis web untuk layanan bimbingan konseling yang memungkinkan siswa mengajukan konsultasi secara **aman, anonim, dan fleksibel**, serta membantu guru BK dalam mengelola pengajuan secara terstruktur dan real-time.

---

## 🌟 Highlight Utama

- 🔐 Konseling tanpa akun (anonim)  
- 👩‍🏫 Dashboard khusus Guru BK (JWT Protected)  
- 💬 Integrasi WhatsApp otomatis  
- 🔒 Isolasi data antar guru (privacy-based system)  
- 🐳 Fully Dockerized (multi-container)  

---

## 📋 Daftar Isi

1. [Tentang SafeSpace](#-tentang-safespace)
2. [Fitur Sistem](#-fitur-sistem)
3. [Fitur Per Role](#-fitur-per-role)
4. [Arsitektur Sistem](#️-arsitektur-sistem)
5. [Tech Stack](#-tech-stack)
6. [Dokumentasi API](#-dokumentasi-api)
7. [Testing](#-testing)
8. [Panduan Menjalankan](#-panduan-menjalankan)
9. [Struktur Proyek](#-struktur-proyek)
10. [Tim Pengembang](#-tim-pengembang)
11. [Kesimpulan](#-kesimpulan)

---

## 🧩 Tentang SafeSpace

SafeSpace hadir sebagai solusi digital untuk layanan konseling yang:

- Mudah diakses siswa tanpa login  
- Menjaga kerahasiaan data  
- Mempermudah guru BK dalam pengelolaan konsultasi  
- Mengurangi komunikasi informal yang tidak terdokumentasi  

---
## ✨ Fitur Sistem

### 🎯 Core Features

- Form pengajuan konseling tanpa akun  
- Dashboard Guru BK  
- Accept / Reject konsultasi  
- WhatsApp auto-message  
- Data isolation per counselor  

---

## 👥 Fitur Per Role

### 👤 Siswa (Tanpa Login)

- Mengisi form konseling lengkap  
- Memilih guru BK  
- Mendapat tracking code  
- Tidak perlu akun  
- Data bersifat privat  

---

### 👩‍🏫 Guru BK

- Register & Login  
- Melihat semua pengajuan  
- Accept / Reject konsultasi  
- Menghubungi siswa via WhatsApp  
- Dashboard statistik  
- Data hanya milik masing-masing guru  

---

## 🏗️ Arsitektur Sistem

SafeSpace menggunakan arsitektur **3-tier (frontend, backend, database)** yang dipisahkan secara modular dan didukung oleh containerization menggunakan Docker.

- 📄 **Diagram arsitektur**  
Diagram arsitektur lengkap dapat dilihat di:  
👉 [System Architecture & Docker](./docs/arsitektur-sistem.md)

### 🔹 Komponen Utama

- **Frontend (React + Nginx)**  
  Menyediakan antarmuka pengguna untuk:
  - Siswa (mengisi form konseling tanpa login)
  - Guru BK (dashboard & manajemen konsultasi)

- **Backend (FastAPI)**  
  Menangani:
  - REST API
  - Business logic (konsultasi, accept/reject)
  - Authentication (JWT untuk Guru BK)
  - Isolasi data per counselor

- **Database (PostgreSQL)**  
  Digunakan untuk:
  - Menyimpan data konsultasi siswa
  - Menyimpan data akun Guru BK
  - Menjaga persistence data

---

### 🔹 Karakteristik Sistem

- 👤 **Guest Access (Siswa tanpa login)**  
  Siswa dapat langsung mengajukan konsultasi dan mendapatkan tracking code

- 🔐 **Secure Access (Guru BK)**  
  Dashboard dilindungi dengan JWT authentication

- 🔄 **Real-time Workflow**  
  Guru BK dapat menerima atau menolak konsultasi secara langsung

- 🔒 **Data Isolation**  
  Setiap Guru BK hanya dapat melihat data konsultasi miliknya

- ☁️ **Containerized Deployment**  
  Seluruh service dapat dijalankan menggunakan Docker (multi-container)
---

## 📡 Dokumentasi API

Swagger UI tersedia di:

👉 http://localhost:8000/docs

### Endpoint Utama

| Method | Endpoint                          | Deskripsi         |
|--------|----------------------------------|------------------|
| POST   | /auth/counselors/register         | Register Guru BK  |
| POST   | /auth/counselor/login             | Login             |
| GET    | /auth/counselor/me                | Data user         |
| POST   | /api/consultations                | Create konsultasi |
| GET    | /api/bk/consultations             | List konsultasi   |
| PATCH  | /api/bk/consultations/{id}/accept | Accept            |
| PATCH  | /api/bk/consultations/{id}/reject | Reject            |

---

## 🧪 Testing

### 1. Blackbox Testing

File: `docs/blackbox-testing-uts.md`
📄 [Blackbox Testing](docs/blackbox-testing-uts.md)

- Testing dari sisi user  
- Validasi form  
- Flow end-to-end  

### 2. Swagger API Testing

File: `docs/swagger-testing-uts.md`
📄 [Swagger API Testing](docs/swagger-testing-uts.md)

- Testing endpoint API  
- Auth flow JWT  
- Validasi request/response  

---

## 🚀 Panduan Menjalankan

### 🐳 Docker (Recommended)

```bash
docker compose up -d
```

Akses:

- Frontend → http://localhost:3000  
- Backend → http://localhost:8000  
- Swagger → http://localhost:8000/docs  

---

### 💻 Manual

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Struktur Proyek SafeSpace

```text
CC-KELOMPOK-A-SUKSESSS/
│
├── backend/                          # 🧠 Backend utama (FastAPI)
│   ├── __pycache__/                  # Cache Python (auto-generated)
│   │
│   ├── routers/                      # 📡 Modular API routes
│   │   ├── __init__.py               # Inisialisasi package routers
│   │   └── bk_dashboard.py           # Endpoint khusus dashboard Guru BK
│   │
│   ├── scripts/                      # ⚙️ Script helper & automation
│   │   ├── reset_db.py               # Reset database (development)
│   │   ├── seed_counselors.py        # Seed data awal guru BK
│   │   └── seed_master_data.py       # Seed data master (kelas, topik, dll)
│   │
│   ├── .dockerignore                 # File yang di-ignore saat build Docker
│   ├── .env                          # Environment lokal
│   ├── .env.docker                   # Environment khusus Docker
│   ├── .env.example                  # Template environment
│   │
│   ├── auth.py                       # 🔐 JWT authentication & security logic
│   ├── crud.py                       # 🧠 Business logic & operasi database
│   ├── database.py                   # 🔗 Koneksi ke PostgreSQL
│   ├── Dockerfile                    # 📦 Konfigurasi image backend
│   ├── main.py                       # 🚀 Entry point FastAPI (routes & config)
│   ├── models.py                     # 🗄️ SQLAlchemy models (struktur tabel)
│   ├── requirements.txt              # 📚 Dependencies Python
│   └── schemas.py                    # 📋 Validasi data (Pydantic schemas)
│
├── docs/                             # 📖 Dokumentasi & hasil testing
│   ├── images/                       # 🖼️ Screenshot hasil testing
│   │
│   ├── api-test-results.md           # Hasil testing API (Swagger)
│   ├── api-test-results.pdf          # Versi PDF laporan API
│   ├── blackbox-testing-uts.md       # 🧪 Blackbox testing lengkap
│   ├── database-schemes.md           # 📊 Desain database
│   ├── docker-architecture.md        # 🐳 Arsitektur Docker
│   ├── docker-cheatsheet.md          # 📌 Cheat sheet Docker command
│   ├── image-comparison.md           # 📏 Perbandingan ukuran Docker image
│   ├── LANGKAH_1_IMPLEMENTATION_SUMMARY.md  # Ringkasan implementasi awal
│   │
│   ├── member-Azizah.md              # Kontribusi anggota (QA)
│   ├── member-Rendy.md               # Kontribusi anggota (Backend)
│   ├── member-Riska.md               # Kontribusi anggota (Frontend)
│   ├── member-Rizki.md               # Kontribusi anggota (DevOps)
│   │
│   ├── Postman_Dashboard_API_Collection.json # Koleksi API Postman
│   ├── setup-guide.md                # 🛠️ Panduan setup project
│   ├── swagger-testing-project.md    # Testing Swagger (project)
│   ├── swagger-testing-uts.md        # Testing Swagger (UTS)
│   ├── ui-test-results.md            # Testing UI (general)
│   ├── ui-test-week4.md              # Testing UI minggu sebelumnya
│   ├── UTS_VERIFICATION_CHECKLIST.md # Checklist validasi UTS
│   └── uts-demo-script.md            # 🎤 Script demo UTS
│
├── frontend/                         # 🎨 Frontend (React + Vite)
│   ├── node_modules/                 # Dependencies Node.js
│   ├── public/                       # Static assets
│   │   └── vite.svg                  # Default Vite icon
│   │
│   ├── src/                          # Source code utama React
│   │   ├── assets/                   # Asset tambahan (image, dll)
│   │   │
│   │   ├── components/               # 🧩 Komponen UI
│   │   │   ├── Header.jsx            # Header + info user
│   │   │   ├── ItemCard.jsx          # Card tampilan data
│   │   │   ├── ItemForm.jsx          # Form input/edit
│   │   │   ├── ItemList.jsx          # List data
│   │   │   ├── LoginPage.jsx         # Halaman login guru BK
│   │   │   ├── SearchBar.jsx         # Fitur pencarian
│   │   │   ├── SortBar.jsx           # Sorting data
│   │   │   ├── Spinner.jsx           # Loading indicator
│   │   │   └── Toast.jsx             # Notifikasi UI
│   │   │
│   │   ├── services/
│   │   │   └── api.js                # 📡 API handler (axios + token)
│   │   │
│   │   ├── App.css                   # Styling utama
│   │   ├── App.jsx                   # Root component
│   │   ├── index.css                # Global CSS
│   │   └── main.jsx                  # Entry point React
│   │
│   ├── .dockerignore                 # Ignore file saat build Docker
│   ├── .env.example                  # Template env frontend
│   ├── .gitignore                    # Git ignore rules
│   ├── .gitkeep                      # Placeholder folder kosong
│   ├── Dockerfile                    # 📦 Multi-stage build frontend
│   ├── eslint.config.js              # Linting rules
│   ├── index.html                    # Template HTML
│   ├── nginx.conf                    # ⚙️ Config Nginx (serve React)
│   ├── package-lock.json             # Lock dependencies
│   ├── package.json                  # Dependencies & scripts
│   └── vite.config.js                # Config Vite
│
├── scripts/                          # 🛠️ Automation script
│   ├── docker-run.sh                 # Script run semua container
│   ├── test_dashboard_api.ps1        # Testing API (PowerShell)
│   └── test_dashboard_api.sh         # Testing API (Linux/Mac)
│
├── .gitignore                        # File yang di-ignore Git
├── docker-compose.yml                # 🐳 Orkestrasi multi-container
└── README.md                         # 📘 Dokumentasi utama project
```

---

## 👥 Tim Pengembang

| Nama                       | Role      | GitHub     |
|---------------------------|-----------|-----------|
| Rendy Rifandi Kurnia       | Backend   | NorEndGate |
| Riska Fadlun K. Purba      | Frontend  | risch24    |
| Rizki Abdul Aziz           | DevOps    | rizkiiaaz  |
| Siti Nur Azizah Putri Awni | QA & Docs | Azizah66   |

---

## 📊 Kesimpulan

SafeSpace berhasil dikembangkan sebagai sistem konseling berbasis cloud dengan:

- Arsitektur modular (frontend, backend, database)  
- Sistem tanpa login untuk siswa  
- Dashboard aman untuk guru BK  
---

<div align="center">
  <sub>Built by Tim Suksesss</sub>
</div>