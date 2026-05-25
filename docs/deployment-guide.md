# Deployment Guide

## 📌 Overview

Dokumen ini menjelaskan proses deployment aplikasi SafeSpace menggunakan GitHub Actions dan platform cloud deployment.

Aplikasi terdiri dari:

- Frontend: React + Vite
- Backend: FastAPI
- Database: PostgreSQL
- CI/CD: GitHub Actions
- Deployment Platform: Render

---

# 🚀 Deployment Architecture

```text
Developer Push → Pull Request → CI Pipeline → Merge to Main → Auto Deploy
```

Deployment dilakukan otomatis setelah branch berhasil di-merge ke `main`.

---

# ☁️ Platform Deployment

## Frontend

Frontend di-deploy sebagai static web service menggunakan Render.

Production URL:

```text
https://safespace-itk.onrender.com/
```

---

## Backend

Backend FastAPI di-deploy sebagai web service menggunakan Render.

Production URL:

```text
https://safespace-db.onrender.com/health
```

Swagger Documentation:

```text
https://safespace-db.onrender.com/docs
```

---

# 🛠️ Deployment Setup

## 1. Login ke Platform Deployment

- Login menggunakan akun GitHub
- Authorize repository project
- Hubungkan repository dengan platform deployment

---

# ⚙️ Backend Deployment

## Root Directory

```text
/backend
```

## Build Command

```bash
pip install -r requirements.txt
```

## Start Command

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

# ⚛️ Frontend Deployment

## Root Directory

```text
/frontend
```

## Build Command

```bash
npm install && npm run build
```

## Start Command

```bash
npm run preview
```

---

# 🗄️ Database Setup

Aplikasi menggunakan PostgreSQL sebagai database production.

Database digunakan untuk:

- Menyimpan data user
- Menyimpan data items
- Authentication dan authorization

---

# 🔐 Environment Variables

## Backend Environment Variables

| Variable | Description | Example Value |
|---|---|---|
| `DATABASE_URL` | URL koneksi PostgreSQL | `postgresql://user:password@host/db` |
| `SECRET_KEY` | Secret key untuk JWT authentication | `random-secret-key` |
| `CORS_ORIGINS` | URL frontend production | `https://safespace-itk.onrender.com` |
| `ENVIRONMENT` | Mode aplikasi | `production` |
| `DEBUG` | Debug mode | `false` |

---

## Frontend Environment Variables

| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | URL frontend production | `https://safespace-db.onrender.com` |

---

# 🔑 GitHub Secrets

Repository menggunakan GitHub Secrets untuk menyimpan data sensitif.

| Secret | Keterangan |
|---|---|
| `SECRET_KEY` | Secret JWT backend |
| `DATABASE_URL` | Connection string database |

---

# 🔄 CI/CD Workflow

## Pull Request Workflow

Saat Pull Request dibuat:

- GitHub Actions menjalankan backend tests
- GitHub Actions menjalankan frontend tests
- Docker image build validation
- Reviewer melakukan code review
- PR di-merge setelah semua checks PASS

---

## Continuous Deployment Workflow

Saat kode di-merge ke `main`:

- CI pipeline berjalan otomatis
- Backend dan frontend di-build
- Deployment otomatis dijalankan
- Production service diperbarui
- Melakukan pengecekan Health Check otomatis

---

# 🧪 Production Testing Checklist

## Backend

- [x] Health endpoint berjalan
- [x] Authentication berhasil
- [x] CRUD API berjalan
- [x] Swagger docs dapat diakses

---

## Frontend

- [x] Frontend berhasil diakses
- [x] Login dan register berhasil
- [x] CRUD item berhasil
- [x] API terhubung ke backend production

---

# 🐳 Docker Deployment

Project menggunakan Docker untuk:

- Konsistensi environment
- Isolasi aplikasi
- Deployment yang lebih stabil
- Build reproducibility

Docker digunakan pada:

- Backend service
- Frontend service
- CI pipeline validation

---

# ⚠️ Troubleshooting

## 1. CORS Error

### Penyebab

Frontend URL belum ditambahkan ke `CORS_ORIGINS`.

### Solusi

Update environment variable backend:

```env
CORS_ORIGINS=https://safespace-itk.onrender.com
```

---

## 2. Frontend Tidak Bisa Fetch API

### Penyebab

`VITE_API_URL` masih menggunakan localhost.

### Solusi

Update:

```env
VITE_API_URL=https://safespace-db.onrender.com
```

---

## 3. Deployment Failed

### Penyebab

Dependency atau build gagal.

### Solusi

- Periksa GitHub Actions logs
- Pastikan semua test PASS
- Verifikasi Docker build berhasil

---

## 4. Backend Crash

### Penyebab

Environment variable belum lengkap.

### Solusi

Pastikan:

- `DATABASE_URL` tersedia
- `SECRET_KEY` tersedia
- `ENVIRONMENT=production`

---

# 📋 Deployment Verification

Verifikasi deployment dilakukan dengan:

- Membuka frontend production URL
- Melakukan login/register
- Menguji CRUD operations
- Mengecek Swagger API docs
- Memastikan CI/CD pipeline PASS

---

# 👥 Team Responsibilities

| Role | Responsibility |
|---|---|
| Lead Backend | Backend production configuration |
| Lead Frontend | Frontend production build |
| Lead DevOps | CI/CD dan deployment workflow |
| Lead QA & Docs | Production testing dan dokumentasi |

---

# ✅ Deployment Status

| Service | Status |
|---|---|
| Frontend Deployment | ✅ Active |
| Backend Deployment | ✅ Active |
| CI Pipeline | ✅ Passing |
| Docker Build | ✅ Passing |
| Production Testing | ✅ Completed |