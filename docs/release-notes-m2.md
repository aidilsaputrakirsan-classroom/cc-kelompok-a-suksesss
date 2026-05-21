# Release Notes — Milestone 2 (v2.0)
---

# 🚀 SafeSpace Cloud App — Milestone 2

Milestone 2 berfokus pada implementasi CI/CD pipeline, automated testing, deployment ke cloud, serta peningkatan kualitas workflow pengembangan tim menggunakan GitHub Flow.

---

# ✨ Fitur yang Sudah Tersedia

## 🔐 Authentication
- Register user baru
- Login menggunakan JWT Authentication
- Protected routes menggunakan Bearer Token

## 📦 Item Management (CRUD)
- Create item
- Read item
- Update item
- Delete item
- Pagination endpoint

## 🩺 Health Check Endpoint
- Endpoint `/health`
- Monitoring status backend service

## 🧪 Automated Testing
### Backend Testing (Pytest)
- Authentication testing
- CRUD endpoint testing
- Health endpoint testing
- Edge case validation

### Frontend Testing (Vitest)
- Component rendering test
- API service test
- User interaction test

## ⚙️ CI Pipeline (GitHub Actions)
Pipeline otomatis berjalan saat:
- Push ke `main`
- Pull Request ke `main`

Tahapan pipeline:
1. Backend Testing
2. Frontend Testing
3. Docker Build Validation

## 🚀 Continuous Deployment
- Auto deploy ke cloud setelah merge ke `main`
- Deployment menggunakan Render
- Production environment terpisah dari development

---

# 🌐 Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://safespace-itk.onrender.com/ |
| Backend API | https://safespace-db.onrender.com/health |
| API Documentation | https://safespace-db.onrender.com/docs |

---

# 🛠️ Tech Stack

## Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pytest

## Frontend
- React
- Vite
- Vitest
- Testing Library

## DevOps & Deployment
- Docker
- Docker Compose
- GitHub Actions
- Render / Railway

## Collaboration Tools
- GitHub Flow
- Pull Request Review
- CODEOWNERS

---

# 📂 Repository Features

- Branch Protection Rules
- Required CI Checks
- CODEOWNERS Configuration
- Conventional Commits
- Pull Request Workflow
- Automated Deployment Pipeline

---

# ⚠️ Known Issues

- Response API pada free-tier hosting terkadang lambat saat cold start
- Frontend membutuhkan beberapa detik saat pertama kali dibuka
- Beberapa endpoint masih membutuhkan validasi tambahan untuk edge cases tertentu

---

# 📈 Improvement dari Milestone 1

| Area | Improvement |
|------|-------------|
| Collaboration | Workflow PR dan review lebih konsisten |
| Testing | Automated testing backend & frontend |
| CI/CD | Pipeline otomatis untuk testing dan deployment |
| Deployment | Aplikasi sudah berjalan di cloud |
| Documentation | Dokumentasi deployment dan testing lebih lengkap |

---

# 🎯 Target Selanjutnya

- Meningkatkan test coverage
- Optimasi performa frontend
- Penambahan monitoring & logging
- Hardening security production
- Implementasi rollback deployment

---

# 👥 Tim Pengembang

## ☁️ Tim Suksesss — Cloud Computing Team

| Nama | Peran | Kontribusi Utama |
|------|--------|------------------|
| Rendy Rifandi Kurnia | Lead Backend | Pengembangan backend API, database integration, authentication system |
| Riska Fadlun Khairiyah Purba | Lead Frontend | Pengembangan frontend interface, form handling, dan dashboard aplikasi |
| Rizki Abdul Aziz | Lead DevOps | Docker setup, CI/CD pipeline, deployment, dan environment configuration |
| Siti Nur Azizah Putri Awni | Lead QA & Documentation | Testing, quality assurance, dokumentasi proyek, dan release management |
---

# 🏷️ Release Tag

```bash
git tag v2.0
git push origin v2.0
```