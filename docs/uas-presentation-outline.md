# 🎓 UAS Presentation Outline

# SafeSpace — Cloud Native Counseling Platform

Institut Teknologi Kalimantan
Mata Kuliah Komputasi Awan

---

# 🖥️ Slide 1 — Title

## SafeSpace

### Cloud Native Counseling Platform

Platform layanan bimbingan konseling berbasis web yang aman, privat, dan terintegrasi menggunakan arsitektur cloud-native microservices.

---

### Tim Pengembang

**Tim Suksesss**

* Rendy Rifandi Kurnia — Lead Backend
* Riska Fadlun Khairiyah Purba — Lead Frontend
* Rizki Abdul Aziz — Lead DevOps
* Siti Nur Azizah Putri Awni — Lead QA & Documentation

---

# 🎯 Slide 2 — Problem & Solution

## Permasalahan

Layanan bimbingan konseling di sekolah masih memiliki beberapa kendala:

* Konseling masih dilakukan secara manual.
* Siswa merasa kurang nyaman menyampaikan masalah secara langsung.
* Tidak tersedia sistem pencatatan konsultasi yang terintegrasi.
* Guru BK kesulitan mengelola banyak konsultasi secara efisien.

---

## Target Pengguna

* Siswa
* Guru BK
* Sekolah

---

## Solusi

SafeSpace menyediakan platform konseling digital yang memungkinkan:

* Konseling tanpa login (guest consultation)
* Pemilihan Guru BK secara langsung
* Dashboard khusus Guru BK
* Monitoring status konsultasi
* Integrasi WhatsApp
* Sistem yang aman menggunakan JWT Authentication

---

# 🏗️ Slide 3 — Architecture Journey

## Week 1–4

### Monolithic Architecture

* React Frontend
* FastAPI Backend
* PostgreSQL Database

(Sisipkan diagram monolith)

---

## Week 5–7

### Docker Containerization

Menggunakan Docker Compose untuk menjalankan:

* Frontend
* Backend
* PostgreSQL

dalam container terpisah.

(Sisipkan diagram Docker Compose)

---

## Week 9–11

### CI/CD Pipeline

Menggunakan GitHub Actions untuk:

* Backend Testing
* Frontend Testing
* Docker Build Validation
* Health Check

Pipeline berjalan otomatis setiap Push dan Pull Request.

(Sisipkan screenshot GitHub Actions)

---

## Week 12–14

### Microservices Architecture

SafeSpace berkembang menjadi cloud-native microservices:

* Auth Service
* Item Service
* API Gateway
* Auth Database
* Item Database
* Frontend
* Prometheus
* Grafana

(Sisipkan diagram microservices)

---

# ☁️ Slide 4 — Tech Stack & Infrastructure

## Tech Stack

### Frontend

* React
* Vite

---

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication

---

### Database

* PostgreSQL

---

### Containerization

* Docker
* Docker Compose

---

### Monitoring

* Prometheus
* Grafana

---

### Gateway

* Nginx Reverse Proxy

---

### CI/CD

* GitHub Actions

---

## Infrastruktur Final

Jumlah container:

* Frontend
* Backend
* PostgreSQL
* Auth Service
* Item Service
* Gateway
* Prometheus
* Grafana

Total:

**8 Container**

---

## CI/CD Flow

Push / Pull Request

↓

Backend Test

↓

Frontend Test

↓

Docker Build

↓

Health Check

↓

Deployment

---

## Monitoring

Prometheus

```
http://localhost:9090
```

Grafana

```
http://localhost:3002
```

---

# 🎥 Slide 5 — Live Demo

## Demo Flow

1. Membuka aplikasi SafeSpace

2. Menampilkan halaman utama

3. Mengisi form konsultasi sebagai siswa

4. Login sebagai Guru BK

5. Menampilkan dashboard konsultasi

6. Accept konsultasi

7. Reject konsultasi

8. Menampilkan Dashboard Statistics

9. Membuka Swagger API

10. Menampilkan Monitoring Grafana

11. Menampilkan Prometheus Targets

12. Menampilkan GitHub Actions CI Pipeline

---

## Backup Plan

Apabila koneksi internet mengalami gangguan:

* Menampilkan video demo yang telah direkam
* Menampilkan screenshot hasil testing
* Menampilkan dokumentasi Swagger Testing

---

# 📚 Slide 6 — Challenges & Lessons Learned

## Challenge 1

Migrasi dari monolithic architecture menuju microservices.

### Solution

Memisahkan Authentication Service dan Consultation Service menjadi container independen.

---

## Challenge 2

Integrasi antar service menggunakan API Gateway.

### Solution

Menggunakan Nginx Reverse Proxy untuk routing request menuju service terkait.

---

## Challenge 3

Monitoring aplikasi cloud secara realtime.

### Solution

Mengintegrasikan Prometheus sebagai metrics collector dan Grafana sebagai dashboard visualisasi.

---

## Biggest Learning

Melalui proyek SafeSpace, tim memperoleh pengalaman mengenai:

* Cloud Native Architecture
* Docker Containerization
* Docker Compose
* GitHub Actions CI/CD
* JWT Authentication
* Reverse Proxy Gateway
* Microservices
* Monitoring dengan Prometheus
* Dashboard Grafana
* Deployment Cloud Application

---

# 👥 Slide 7 — Team Contributions

| Nama                         | Role                    | Kontribusi                                  |
| ---------------------------- | ----------------------- | ------------------------------------------- |
| Rendy Rifandi Kurnia         | Lead Backend            | FastAPI Backend, Authentication, Database   |
| Riska Fadlun Khairiyah Purba | Lead Frontend           | React Interface, Dashboard, User Experience |
| Rizki Abdul Aziz             | Lead DevOps             | Docker, Gateway, CI/CD, Monitoring          |
| Siti Nur Azizah Putri Awni   | Lead QA & Documentation | Testing, QA, Documentation, Release Notes   |

---

# 🎤 Demo Script

## 1

Buka aplikasi:

```
https://safespace-itk.onrender.com
```

atau

```
http://localhost:3000
```

---

## 2

Menampilkan halaman utama SafeSpace.

---

## 3

Mengisi form konsultasi sebagai siswa.

* Isi identitas
* Pilih Guru BK
* Kirim konsultasi

Tunjukkan Tracking Code.

---

## 4

Login sebagai Guru BK.

---

## 5

Masuk ke Dashboard BK.

---

## 6

Menampilkan daftar konsultasi.

---

## 7

Melakukan Accept Consultation.

---

## 8

Melakukan Reject Consultation.

---

## 9

Menampilkan Dashboard Statistics.

---

## 10

Membuka Swagger API.

```
http://localhost:8000/docs
```

Menunjukkan endpoint:

* Authentication
* Consultation
* Dashboard
* Public API

---

## 11

Menampilkan Prometheus.

```
http://localhost:9090
```

Kemudian membuka:

```
http://localhost:9090/targets
```

Menunjukkan seluruh service berjalan dengan status UP.

---

## 12

Menampilkan Grafana Dashboard.

```
http://localhost:3002
```

Login:

Username:

```
admin
```

Password:

```
admin
```

Menampilkan dashboard monitoring SafeSpace.

---

## 13

Membuka repository GitHub.

Menampilkan:

* CI Pipeline
* Build Success
* Docker Build
* Health Check
* Badge CI/CD

---