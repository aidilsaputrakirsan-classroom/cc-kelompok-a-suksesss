# 🚀 Release Notes — Milestone 3 (Final)

## Version

**v3.0.0**

**Project:** SafeSpace — Cloud Native Counseling Platform
**Course:** Komputasi Awan — Institut Teknologi Kalimantan
**Release:** Milestone 3 (Final / UAS)

---

# 📅 Release Information

| Item               | Value                 |
| ------------------ | --------------------- |
| Version            | v3.0.0                |
| Release Stage      | Final Project         |
| Architecture       | Microservices         |
| Container Platform | Docker Compose        |
| Monitoring         | Prometheus + Grafana  |
| Gateway            | Nginx Reverse Proxy   |
| CI/CD              | GitHub Actions        |
| Deployment         | Render + Local Docker |

---

# 🎯 Overview

Milestone 3 merupakan tahap akhir pengembangan aplikasi **SafeSpace**, dimana sistem yang sebelumnya berbentuk **monolithic application** telah berevolusi menjadi **cloud-native microservices architecture**.

Pada tahap ini dilakukan pemisahan layanan menjadi service independen, penambahan API Gateway, monitoring system, observability, deployment automation, serta peningkatan keamanan aplikasi sehingga lebih siap dijalankan pada lingkungan cloud.

---

# ✨ New Features

## 🏗️ Microservices Architecture

Implementasi arsitektur microservices dilakukan dengan memisahkan service utama menjadi beberapa komponen independen.

Fitur yang ditambahkan:

* Auth Service
* Item Service
* API Gateway (Nginx)
* Auth Database
* Item Database
* Frontend Service
* Prometheus Monitoring
* Grafana Dashboard

Setiap service berjalan secara independen menggunakan Docker Compose dan saling berkomunikasi melalui HTTP REST API.

---

## 🔐 Authentication Service

Authentication dipisahkan menjadi service tersendiri.

Fitur:

* Register Counselor
* Login Counselor
* OAuth2 Token
* JWT Authentication
* Get Current User
* Token Validation

Endpoint:

```
POST /auth/counselors/register
POST /auth/counselor/login
POST /auth/counselor/token
GET  /auth/me
GET  /auth/counselor/me
```

---

## 📦 Consultation Service

Service konsultasi dipisahkan dari authentication.

Menyediakan endpoint:

* Create Consultation
* Accept Consultation
* Reject Consultation
* Dashboard Statistics
* Consultation Detail
* Delete Consultation

Endpoint:

```
POST   /api/consultations
GET    /api/bk/consultations
GET    /api/bk/dashboard/stats
PATCH  /api/bk/consultations/{id}/accept
PATCH  /api/bk/consultations/{id}/reject
DELETE /api/bk/consultations/{id}
```

---

## 🌐 API Gateway

Seluruh request diarahkan melalui API Gateway berbasis Nginx.

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

Gateway juga bertugas sebagai reverse proxy antar service.

---

# 📊 Monitoring & Observability

Milestone 3 menambahkan sistem monitoring menggunakan Prometheus dan Grafana.

## Prometheus

Digunakan untuk melakukan scraping metrics dari seluruh microservices.

URL:

```
http://localhost:9090
```

Targets:

```
http://localhost:9090/targets
```

Metrics yang dimonitor:

* request count
* response time
* service availability
* error rate

---

## Grafana Dashboard

Grafana digunakan untuk visualisasi metrics Prometheus secara realtime.

Dashboard:

```
http://localhost:3002
```

Credential:

Username:

```
admin
```

Password:

```
admin
```

Dashboard menampilkan:

* Service Status
* Request Rate
* Error Rate
* Response Time
* Monitoring Microservices

---

# 🔄 CI/CD Improvements

Pipeline GitHub Actions diperbarui sehingga mendukung proses otomatis:

* Backend Testing
* Frontend Testing
* Coverage Validation
* Docker Image Build
* Health Check Deployment

Pipeline berjalan otomatis pada:

```
Push → main

Pull Request → main
```

Workflow:

```
Backend Test
↓

Frontend Test
↓

Docker Build

↓

Health Check
```

---

# 🐳 Docker Improvements

Arsitektur Docker Compose diperluas menjadi multi-container.

Container:

* Frontend
* Backend
* PostgreSQL
* Auth Service
* Item Service
* Gateway
* Prometheus
* Grafana

Masing-masing service memiliki:

* dedicated container
* dedicated database
* health check
* isolated network

---

# 🔒 Security Improvements

Peningkatan keamanan pada Milestone 3:

* JWT Authentication
* Secret menggunakan Environment Variables
* PostgreSQL terisolasi per service
* Health Check validation
* CORS Configuration
* Environment separation
* Docker Network Isolation

---

# ⚙️ Reliability Improvements

Implementasi reliability:

* Docker Health Check
* Service Dependency
* Automatic Restart
* Startup Ordering
* Monitoring Service Status

Service akan menunggu dependency healthy sebelum dijalankan.

---

# 📈 Project Statistics

| Metric                     | Value         |
| -------------------------- | ------------- |
| Architecture               | Microservices |
| API Services               | 2             |
| Databases                  | 2             |
| Gateway                    | 1             |
| Monitoring Services        | 2             |
| Frontend                   | 1             |
| Total Containers           | 8             |
| Total Public API Endpoints | 18+           |
| Docker Compose Files       | 2             |
| CI Jobs                    | 3             |
| Monitoring Dashboard       | Grafana       |
| Metrics Collector          | Prometheus    |

---

# 🔄 Evolution from Milestone 2

| Milestone 2        | Milestone 3               |
| ------------------ | ------------------------- |
| Monolithic Backend | Microservices             |
| Single Database    | Database per Service      |
| Single API         | Multiple API Services     |
| Docker Compose     | Extended Compose          |
| CI/CD              | CI/CD + Monitoring        |
| Manual Monitoring  | Prometheus + Grafana      |
| Direct API Access  | API Gateway               |
| Basic Docker       | Cloud Native Architecture |

---

# 🌐 Service Endpoints

| Service            | URL                           |
| ------------------ | ----------------------------- |
| Frontend           | http://localhost:3000         |
| Backend API        | http://localhost:8000         |
| Swagger            | http://localhost:8000/docs    |
| Gateway            | http://localhost:8080         |
| Prometheus         | http://localhost:9090         |
| Prometheus Targets | http://localhost:9090/targets |
| Grafana Dashboard  | http://localhost:3002         |

---

# ⚠️ Known Issues

Beberapa kendala yang masih ditemukan:

* Render Free Tier mengalami cold start ketika idle cukup lama.
* Monitoring metrics masih berjalan pada local Docker environment.
* Gateway masih menggunakan konfigurasi dasar tanpa SSL termination.
* Grafana menggunakan credential default untuk kebutuhan praktikum.

---

# 👥 Team Contributions

| Nama                         | Peran                   | Kontribusi                                 |
| ---------------------------- | ----------------------- | ------------------------------------------ |
| Rendy Rifandi Kurnia         | Lead Backend            | Backend API, Authentication, Database      |
| Riska Fadlun Khairiyah Purba | Lead Frontend           | React UI, Dashboard, User Interface        |
| Rizki Abdul Aziz             | Lead DevOps             | Docker, Gateway, CI/CD, Monitoring         |
| Siti Nur Azizah Putri Awni   | Lead QA & Documentation | Testing, Documentation, Release Management |

---

# 🎯 Final Achievement

SafeSpace berhasil berkembang dari aplikasi monolith sederhana menjadi platform cloud-native berbasis microservices yang memiliki:

* Docker Containerization
* Multi Database Architecture
* API Gateway
* JWT Authentication
* CI/CD Automation
* Monitoring System
* Prometheus Metrics
* Grafana Dashboard
* Automated Health Check
* Cloud Deployment

Milestone 3 menjadi implementasi penuh konsep **Cloud Computing**, **Containerization**, **Microservices**, **DevOps**, dan **Observability** sesuai capaian pembelajaran mata kuliah Komputasi Awan.

---

# 🏷️ Release Tag

```bash
git tag v3.0.0
git push origin v3.0.0
```

---

**SafeSpace v3.0.0 — Final Release (Milestone 3)**

Cloud Native Counseling Platform
Institut Teknologi Kalimantan — Komputasi Awan
