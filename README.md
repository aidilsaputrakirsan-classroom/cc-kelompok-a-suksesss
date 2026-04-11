# ☁️ Cloud App - SafeSpace


## 📌 Deskripsi Proyek
SafeSpace adalah aplikasi manajemen bimbingan konseling berbasis cloud yang dirancang untuk memfasilitasi siswa dalam mengajukan layanan konseling secara aman, privat, dan fleksibel. 

Melalui aplikasi ini, siswa dapat mengisi formulir pengajuan konseling, memilih guru BK yang diinginkan, serta berkomunikasi langsung melalui fitur chat. Sistem memastikan bahwa hanya guru BK yang dipilih yang dapat mengakses data dan riwayat konseling siswa, sehingga menjaga kerahasiaan informasi. 

Di sisi guru BK, tersedia dashboard untuk melihat daftar pengajuan, menerima atau menolak permintaan konseling, mengakses kontak siswa jika diperlukan, serta mencatat perkembangan hasil bimbingan. Urgensi pengembangan SafeSpace didasarkan pada kebutuhan akan layanan konseling yang lebih mudah diakses, menjaga privasi siswa, serta mendukung proses pendampingan yang terdokumentasi dan terkelola secara digital melalui teknologi cloud computing.

## 🎯 Tujuan Pengembangan
* Menyediakan platform konseling digital yang aman dan mudah diakses.
* Menjaga kerahasiaan data siswa melalui sistem otorisasi berbasis peran.
* Mendukung proses monitoring dan dokumentasi bimbingan secara terpusat.
* Mengimplementasikan konsep cloud computing pada aplikasi nyata.

## 👥 Tim

| Nama | NIM | Peran |
|------|-----|-------|
| Rendy Rifandi Kurnia | 10231081 | Lead Backend |
| Riska Fadlun Khairiyah Purba | 10231083 | Lead Frontend |
| Rizki Abdul Aziz | 10231085 | Lead DevOps |
| Siti Nur Azizah Putri Awni | 10231087 | Lead QA & Docs |

## 🛠️ Tech Stack

Berdasarkan struktur proyek di `backend/` dan `frontend/`:

### Backend (`backend/`)
| Teknologi | Fungsi |
|-----------|--------|
| FastAPI | REST API & web framework |
| Uvicorn | ASGI server |
| Azure AI Document Intelligence | OCR & ekstraksi dokumen |
| LangChain & OpenAI | AI review & orkestrasi LLM |
| PyMuPDF, pdf2image, Pillow | Pemrosesan PDF & gambar |
| Pydantic | Validasi data & schema |
| SQLAlchemy | ORM & akses database |
| python-dotenv | Konfigurasi environment |
| Pytest | Testing |

### Frontend (`frontend/`)

### Infrastruktur & DevOps
| Teknologi | Fungsi |
|-----------|--------|
| Docker | Containerization |
| GitHub Actions | CI/CD |
| Railway/Render | Cloud deployment |


## 🏗️ Architecture

```
    ┌──────────────────────┐
    │     React Frontend   │
    │  (User Interface)    │
    └──────────┬───────────┘
               │ HTTP Request (REST API)
               ▼
    ┌──────────────────────┐
    │     FastAPI Backend  │
    │  Business Logic & API│
    └──────────┬───────────┘
               │ SQLAlchemy ORM
               ▼
    ┌──────────────────────┐
    │   PostgreSQL Database│
    │     Persistent Data  │
    └──────────────────────┘
```

### Penjelasan Arsitektur
- **React Frontend** → Menyediakan antarmuka pengguna serta menyimpan access token setelah login.
- **FastAPI Backend** → Menyediakan REST API, memproses request, menangani autentikasi JWT, serta mengelola logika aplikasi.
- **JWT Authentication** → Digunakan untuk mengamankan endpoint sehingga hanya user yang login dapat mengakses data.
- **PostgreSQL** → Menyimpan data aplikasi secara permanen.
- Komunikasi antar layer menggunakan HTTP (REST API) dan koneksi database berbasis SQL.

*(Arsitektur akan terus berkembang seiring penambahan Docker, deployment cloud, dan CI/CD pipeline pada minggu berikutnya.)*

## 🚀 Getting Started

### Prasyarat
- Python 3.10+
- Node.js 18+
- Git

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
API: http://localhost:8000 — Docs: http://localhost:8000/docs

Catatan eksekusi backend:
- Disarankan menggunakan `python -m uvicorn ...` agar interpreter aktif (venv) selalu dipakai tanpa bergantung PATH.
- Alternatif jika ingin tetap pakai perintah `uvicorn`: aktifkan virtual environment terlebih dahulu.
- Windows PowerShell: `python -m venv .venv` lalu `.\.venv\Scripts\Activate.ps1`
- Linux/macOS: `python -m venv .venv` lalu `source .venv/bin/activate`

Seeding data awal SafeSpace:
```bash
cd backend
python scripts/seed_master_data.py
python scripts/seed_counselors.py
```

Endpoint seed (opsional, untuk development):
- `POST /api/dev/seed/master-data`
- `POST /api/dev/seed/counselors`

Endpoint konsultasi konselor (protected JWT):
- `GET /api/bk/consultations`
- `PATCH /api/bk/consultations/{consultation_id}/accept`
- `PATCH /api/bk/consultations/{consultation_id}/reject`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentication

SafeSpace menggunakan **JWT (JSON Web Token)** untuk autentikasi pengguna.

### Fitur Authentication
- User Register
- User Login
- Protected API menggunakan Bearer Token
- Logout (client-side session removal)

### Authentication Flow
1. User melakukan **register** akun baru
2. Sistem otomatis melakukan **login**
3. Backend mengirimkan **access token (JWT)**
4. Token disimpan di frontend
5. Setiap request API mengirim header:
6. User dapat logout untuk menghapus session

### Endpoint Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Membuat akun baru |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Mendapatkan data user aktif |

## 📡 API Endpoints Week 2

Base URL: http://localhost:8000  
Swagger Documentation: http://localhost:8000/docs

| Method | URL | Request Body | Response Example | Status Code | Status Pengujian |
|--------|-----|--------------|------------------|-------------|------------------|
| POST | `/items` | `{name, price, description, quantity}` | Mengembalikan data item yang berhasil dibuat beserta `id` | 201 Created | ✅ Berhasil |
| GET | `/items` | - | `{ total: 3, items: [...] }` menampilkan seluruh daftar item | 200 OK | ✅ Berhasil |
| GET | `/items/1` | - | Mengembalikan detail item dengan `id = 1` | 200 OK | ✅ Berhasil |
| PUT | `/items/1` | `{price: 14000000}` | Data item berhasil diperbarui dengan nilai terbaru | 200 OK | ✅ Berhasil |
| GET | `/items/1` | - | Menampilkan kembali data item setelah dilakukan update | 200 OK | ✅ Berhasil |
| GET | `/items?search=laptop` | - | `{ total: 1, items: [...] }` menampilkan hasil pencarian item | 200 OK | ✅ Berhasil |
| DELETE | `/items/1` | - | Item berhasil dihapus dari database | 204 No Content | ✅ Berhasil |
| GET | `/items/1` | - | `{detail: "item tidak ditemukan"}` karena data sudah dihapus | 404 Not Found | ✅ Berhasil |
| GET | `/items/stats` | - | `{ total_items, total_value, most_expensive, cheapest }` menampilkan statistik inventory | 200 OK | ✅ Berhasil |

## 📡 API Endpoints Week 4

Base URL: http://localhost:8000  
Swagger: http://localhost:8000/docs

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user baru |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Mendapatkan user login |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/items` | Menambahkan item baru |
| GET | `/items` | Mengambil seluruh item |
| GET | `/items/{id}` | Detail item |
| PUT | `/items/{id}` | Update item |
| DELETE | `/items/{id}` | Hapus item |
| GET | `/items/stats` | Statistik inventory |

## 🧪 Testing Week 4

Pengujian dilakukan pada Week 4 untuk memastikan integrasi Authentication dan CRUD berjalan dengan baik.

### Hasil Testing
- ✅ API Connected
- ✅ Register & Login berhasil
- ✅ Protected route berjalan
- ✅ CRUD Items berfungsi
- ✅ Search berjalan
- ✅ Logout berhasil
- ✅ Data tetap tersimpan setelah login ulang

Detail hasil testing tersedia pada docs/ui-test-week4.md

## 🐳 Docker Setup

Backend aplikasi dapat dijalankan menggunakan Docker tanpa perlu instalasi dependency secara manual.

---

### 📦 Prerequisites

Pastikan sudah terinstall:

- Docker Desktop
- Docker Compose

Cek instalasi:

```bash
docker --version
docker compose version
```

---

### 🚀 Menjalankan Aplikasi dengan Docker

1. Clone repository:

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

2. Jalankan container:

```bash
docker compose up -d
```

Perintah ini akan:

- Pull image backend dari Docker Hub
- Membuat container
- Menjalankan API pada port **8000**

---

### 🌐 Akses API

Setelah container berjalan, buka:

```
http://localhost:8000/docs
```

Swagger UI akan muncul dan API siap digunakan.

---

### 📋 Docker Commands (Useful for QA & Development)

#### Melihat container yang berjalan
```bash
docker ps
```

#### Melihat log container
```bash
docker logs cloudapp-container
```

#### Follow log secara realtime
```bash
docker logs -f cloudapp-container
```

#### Stop container
```bash
docker compose down
```

#### Restart container
```bash
docker compose restart
```

---

### 🧪 Testing Checklist (QA)

- [x] Container berhasil dijalankan
- [x] Swagger UI dapat diakses
- [x] Endpoint `/health` berfungsi
- [x] Register user berhasil
- [x] Login user berhasil

---

### 🐙 Docker Hub Image

Backend image tersedia di Docker Hub:

```
rizkiiaaz/cloudapp-backend:v1
```

Pull manual:

```bash
docker pull rizkiiaaz/cloudapp-backend:v1
```

Run manual:

```bash
docker run -p 8000:8000 --env-file .env rizkiiaaz/cloudapp-backend:v1
```

---

### ⚙️ Environment Variables

Pastikan file `.env` tersedia pada folder backend.

Contoh konfigurasi database untuk Docker Desktop:

```
DATABASE_URL=postgresql://postgres:PASSWORD@host.docker.internal:5432/cloudapp
```

---

### 🧹 Cleanup Docker

Hentikan dan hapus container:

```bash
docker compose down
```

Hapus image yang tidak terpakai:

```bash
docker image prune
```

---

### 📄 Documentation

Perbandingan ukuran Docker image dapat dilihat pada:

```
docs/image-comparison.md
```

## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ✅ |
| 4 | Full-Stack Integration | ✅ |
| 5-7 | Docker & Compose | ✅ |
| 8 | UTS Demo | ⬜ |
| 9-11 | CI/CD Pipeline | ⬜ |
| 12-14 | Microservices | ⬜ |
| 15-16 | Final & UAS | ⬜ |

## 📁 Project Structure

```
cc-kelompok-a-suksesss/
├── backend/                     # FastAPI Backend
│   ├── Dockerfile               # Docker image configuration (NEW)
│   ├── .dockerignore            # Docker ignore rules (NEW)
│   ├── main.py                  # Entry point, API routes & CORS config
│   ├── auth.py                  # JWT authentication utilities
│   ├── database.py              # Database connection
│   ├── models.py                # SQLAlchemy models (+ User model)
│   ├── schemas.py               # Pydantic schemas (+ auth schemas)
│   ├── crud.py                  # Business logic & CRUD operations
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (Updated for Docker)
│   └── .env.example             # Example environment configuration
│
├── frontend/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx              # Root component + auth integration
│   │   ├── App.css              # Main styling
│   │   ├── main.jsx             # React entry point
│   │   │
│   │   ├── components/
│   │   │   ├── Header.jsx       # Header + user info & logout
│   │   │   ├── LoginPage.jsx    # Login page
│   │   │   ├── SearchBar.jsx    # Item search feature
│   │   │   ├── ItemForm.jsx     # Add & edit item form
│   │   │   ├── ItemList.jsx     # Item list display
│   │   │   └── ItemCard.jsx     # Item card component
│   │   │
│   │   └── services/
│   │       └── api.js           # API service + token management
│   │
│   ├── .env                     # Frontend environment variables
│   ├── .env.example             # Example environment configuration
│   ├── index.html               # Main HTML template
│   ├── package.json             # Node.js dependencies & scripts
│   ├── vite.config.js           # Vite configuration
│   └── eslint.config.js         # ESLint configuration
│
├── docs/                        # Team documentation & testing results
│   ├── member-Azizah.md
│   ├── member-Rendy.md
│   ├── member-Riska.md
│   ├── member-Rizki.md
│   ├── api-test-results.md      # API testing documentation (Swagger)
│   ├── ui-test-results.md       # UI testing documentation
│   ├── image-comparison.md      # Docker image comparison (NEW)
│   ├── docker-cheatsheet.md     # Docker command reference (NEW)
│   └── images/                  # Testing screenshots
│
├── .gitignore
└── README.md
```
---

### Hasil
<img src="SS3.png" width="700"/>
<img src="SS4.png" width="700"/>
<img src="SS5.png" width="700"/>