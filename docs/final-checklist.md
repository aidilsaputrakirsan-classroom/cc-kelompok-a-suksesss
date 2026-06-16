# ✅ FINAL CHECKLIST — SafeSpace Cloud App

**Mata Kuliah:** Komputasi Awan
**Institut Teknologi Kalimantan**
**Project:** SafeSpace — Platform Konseling Aman & Privat
**Milestone:** Final Project (UAS)

---

# 📦 REPOSITORY

* [ ] README.md lengkap dan sesuai implementasi terbaru
* [ ] `.env.example` mencakup seluruh environment variables yang diperlukan
* [ ] `.gitignore` mencakup `.env`, `__pycache__`, `node_modules`, dan file temporary lainnya
* [ ] Tidak terdapat secret, token, atau password yang di-hardcode pada source code
* [ ] Release tag **v3.0.0** telah dibuat dan dipush ke repository
* [ ] Struktur repository rapi dan mudah dipahami
* [ ] Dokumentasi seluruh folder telah diperbarui

---

# 🖥️ APPLICATION

## Frontend

* [ ] Landing page berjalan dengan baik
* [ ] Form konsultasi siswa dapat digunakan
* [ ] Dashboard Guru BK dapat diakses setelah login
* [ ] Seluruh navigasi berjalan normal
* [ ] Responsive pada berbagai ukuran layar

---

## Authentication

* [ ] Register Guru BK berhasil
* [ ] Login JWT berhasil
* [ ] Protected endpoint memerlukan token
* [ ] Endpoint `/auth/me` berjalan normal
* [ ] Token dapat digunakan untuk request berikutnya

---

## Consultation Service

* [ ] Guest Consultation berhasil dibuat
* [ ] Public Counselor List tampil normal
* [ ] Public Master Data berhasil dimuat
* [ ] List Consultation Guru BK berjalan
* [ ] Detail Consultation berjalan
* [ ] Accept Consultation berjalan
* [ ] Reject Consultation berjalan
* [ ] Delete Consultation berjalan
* [ ] Dashboard Statistics berjalan

---

## Health Check

* [ ] Endpoint `/health` berjalan normal
* [ ] Semua service memberikan status sehat

---

# 🐳 DOCKER & CONTAINERIZATION

* [ ] Docker Compose Monolith berjalan
* [ ] Docker Compose Microservices berjalan
* [ ] Frontend container running
* [ ] Backend/Auth Service running
* [ ] Item Service running
* [ ] Gateway (Nginx) running
* [ ] PostgreSQL Auth DB running
* [ ] PostgreSQL Item DB running
* [ ] Prometheus running
* [ ] Grafana running

---

# 🚪 API GATEWAY

* [ ] Routing Auth Service berjalan
* [ ] Routing Public API berjalan
* [ ] Routing Item Service berjalan
* [ ] Reverse Proxy berjalan normal
* [ ] Gateway dapat diakses tanpa error

---

# 📊 MONITORING

## Prometheus

* [ ] Prometheus dapat diakses

```
http://localhost:9090
```

* [ ] Halaman Targets dapat diakses

```
http://localhost:9090/targets
```

* [ ] Auth Service muncul sebagai target aktif
* [ ] Item Service muncul sebagai target aktif

---

## Grafana

* [ ] Grafana berjalan normal

```
http://localhost:3002
```

Credential:

```
Username : admin
Password : admin
```

* [ ] Dashboard dapat dibuka
* [ ] Metrics berhasil ditampilkan

---

# 📡 API TESTING

* [ ] Register Counselor
* [ ] Login Counselor
* [ ] OAuth2 Token
* [ ] Get User Profile
* [ ] Public Counselors
* [ ] Public Master Data
* [ ] Create Consultation
* [ ] List Consultation
* [ ] Detail Consultation
* [ ] Accept Consultation
* [ ] Reject Consultation
* [ ] Delete Consultation
* [ ] Dashboard Statistics
* [ ] Health Check
* [ ] Team Info

---

# 🧪 TESTING

## Backend

* [ ] Pytest berjalan sukses
* [ ] Coverage memenuhi threshold
* [ ] CRUD endpoint lulus pengujian
* [ ] Authentication endpoint lulus pengujian

---

## Frontend

* [ ] Vitest berjalan sukses
* [ ] Component rendering berhasil
* [ ] UI interaction berhasil
* [ ] API service berhasil

---

## Swagger Testing

* [ ] Seluruh endpoint telah diuji
* [ ] JWT Authorization berhasil
* [ ] Request & Response sesuai dokumentasi

---

## Blackbox Testing

* [ ] Semua fitur utama diuji
* [ ] Validasi input berjalan
* [ ] End-to-end flow berhasil

---

# ⚙️ CI/CD

* [ ] GitHub Actions CI Pipeline PASS
* [ ] Backend Test PASS
* [ ] Frontend Test PASS
* [ ] Docker Build PASS
* [ ] Health Check PASS
* [ ] CI Badge tampil di README

---

# ☁️ DEPLOYMENT

* [ ] Frontend berhasil di-deploy
* [ ] Backend berhasil di-deploy
* [ ] Swagger Production dapat diakses
* [ ] Production Health Check berhasil

---

# 📚 DOKUMENTASI

* [ ] README.md
* [ ] docs/architecture.md
* [ ] docs/deployment-guide.md
* [ ] docs/operations-guide.md
* [ ] docs/api-contract.md
* [ ] docs/release-notes-m3.md
* [ ] docs/swagger-testing.md
* [ ] docs/blackbox-testing.md

---

# 👥 TEAM CONTRIBUTION

* [ ] Backend (FastAPI)
* [ ] Frontend (React)
* [ ] Database (PostgreSQL)
* [ ] Docker & Docker Compose
* [ ] API Gateway (Nginx)
* [ ] Monitoring (Prometheus & Grafana)
* [ ] GitHub Actions CI/CD
* [ ] Testing
* [ ] Dokumentasi

---

# 🚀 FINAL VERIFICATION

* [ ] Repository siap dinilai
* [ ] Docker berjalan tanpa error
* [ ] Microservices berjalan normal
* [ ] Monitoring aktif
* [ ] Dokumentasi lengkap
* [ ] Demo siap dilakukan
* [ ] Presentasi siap dilakukan