# UTS Demo Script — SafeSpace (Cloud Team suksesss)

## 1. Setup (2 menit)
- Buka terminal di root project  
- Jalankan:

  ```bash
  docker compose up -d
  ```

- Cek container:

  ```bash
  docker compose ps
  ```

→ Tunjukkan 3 services (frontend, backend, db) dalam status **Up / healthy**

---

## 2. Frontend Demo (5 menit)

### 🔹 Role Siswa (Tanpa Login)
- Buka http://localhost:3000  
- Tampilkan landing page **SafeSpace (Safe & Private Counseling)**  
- Jelaskan bahwa siswa bisa melakukan konsultasi tanpa perlu login (anonim & privat)

**Isi Form Konseling:**
- Nama lengkap  
- Nomor WhatsApp (+62)  
- Jenis kelamin  
- Kelas  
- Pilih guru BK  
- Metode konseling  
- Topik masalah  
- Tanggal & waktu  
- Tempat  

- Klik **Kirim Pengajuan**

**Tampilkan hasil:**
- “Pengajuan Terkirim”  
- Kode pelacak (contoh: SS-XXXXXXX)  

---

### 🔹 Role Guru BK (Login Required)
- Login sebagai Guru BK (email & password)

**Tampilkan Dashboard:**
- Total konsultasi  
- Status: pending, accepted, rejected  

**Tampilkan daftar konsultasi:**
- Nama siswa  
- Kelas  
- Topik masalah  
- Tanggal konseling  
- Waktu konseling  
- Status pengajuan  

---

### 🔄 Simulasi CRUD (versi SafeSpace)

- Buat 1–2 pengajuan konseling (**Create**)  
- Login sebagai Guru BK  
- Lihat daftar konsultasi yang masuk (**Read**)  

**Ubah status pengajuan:**
- Accept → kirim ke WhatsApp  
- Reject → (**Update**)  

- Hapus 1 pengajuan (**Delete**)  

**Catatan:**
Pada aplikasi SafeSpace, konsep CRUD diimplementasikan dalam bentuk pengajuan konseling:
- **Create** → siswa mengirim form  
- **Read** → guru melihat daftar konsultasi  
- **Update** → guru menerima / menolak pengajuan  
- **Delete** → pengajuan dihapus oleh guru BK  

---

## 3. Backend Demo (3 menit)

- Buka http://localhost:8000/docs (Swagger UI)  
- Tunjukkan semua endpoint terdokumentasi  

**Test endpoint:**
- `GET /health`  
- Auth endpoints (`/auth/login` atau `/auth/token`)  

- Tunjukkan bahwa endpoint tertentu membutuhkan authorization (JWT token)  

---

## 4. Docker Demo (3 menit)

**Jalankan:**
```bash
docker compose ps
```

→ Tunjukkan status semua container  

**Stop semua container:**
```bash
docker compose down
```

**Jalankan kembali:**
```bash
docker compose up -d
```

- Login kembali → tunjukkan data masih ada  
*(membuktikan data persistence menggunakan Docker volume)*  

**Tampilkan logs backend:**
```bash
docker compose logs backend
```

---

## 5. Code Walkthrough (2 menit)

**Tunjukkan file `docker-compose.yml`:**
- services: frontend, backend, database  
- network  
- volume  
- healthcheck  

**Tunjukkan `backend/Dockerfile`:**
- base image Python  
- install dependencies  
- menjalankan FastAPI (uvicorn)  

**Tunjukkan `frontend/Dockerfile`:**
- menggunakan multi-stage build  
- build React (Vite)  
- serve menggunakan Nginx  

---

**Total durasi: ~15 menit**