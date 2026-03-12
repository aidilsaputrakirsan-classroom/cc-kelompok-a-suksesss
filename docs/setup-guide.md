# 🚀 Panduan Setup Proyek Cloud App - SafeSpace

Dokumentasi ini berisi panduan teknis langkah demi langkah untuk menginstal, mengonfigurasi, dan menjalankan proyek Cloud App - SafeSpace (Backend FastAPI & Frontend React Vite) dari awal (*scratch*).

---

## 📋 Prasyarat Sistem
Sebelum memulai, pastikan perangkat Anda telah terinstal perangkat lunak berikut:
* **Python** (v3.9 atau lebih baru)
* **Node.js** (v18 atau lebih baru)
* **Git** (Untuk version control)
* **PostgreSQL** (Sebagai database utama)

---

## 🛠️ Langkah-langkah Instalasi

### 1. Clone Repositori
Langkah pertama adalah mengunduh kode sumber proyek ke komputer lokal Anda. Buka terminal dan jalankan perintah berikut:

```bash
git clone https://github.com/USERNAME-GITHUB-KALIAN/cc-kelompok-a-suksesss.git
cd cc-kelompok-a-suksesss
```
*(Catatan: Sesuaikan URL di atas dengan link repositori GitHub kelompok yang sebenarnya).*

### 2. Konfigurasi Environment Variables (.env)
Proyek ini menggunakan file `.env` untuk menyimpan konfigurasi rahasia.

**A. Setup Environment Backend:**
1. Masuk ke folder `backend`.
2. Duplikat file `.env.example` dan ubah namanya menjadi `.env`.
3. Buka file `.env` dan isi dengan konfigurasi berikut:

```text
# Konfigurasi Database PostgreSQL
DATABASE_URL=postgresql://username_kamu:password_kamu@localhost:5432/nama_database_kamu

# Konfigurasi JWT Authentication
SECRET_KEY=isi_dengan_kunci_rahasia_yang_sangat_panjang_dan_rumit_disini
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
*(Catatan: Sesuaikan password PostgreSQL sesuai dengan password anda dan ubah/buat SECRET_KEY nya dengan kebebasan anda).*

**B. Setup Environment Frontend:**
1. Masuk ke folder `frontend`.
2. Duplikat file `.env.example` dan ubah namanya menjadi `.env`.
3. Buka file `.env` dan pastikan URL mengarah ke backend lokal Anda:

```text
VITE_API_URL=http://127.0.0.1:8000
```

### 3. Instalasi Dependencies (Otomatis)
Kami telah menyediakan script otomatis untuk mempermudah proses instalasi library.
Dari folder utama proyek, jalankan perintah ini di terminal Git Bash:

```bash
bash setup.sh
```

---

## 🚀 Menjalankan Aplikasi
Aplikasi ini membutuhkan dua terminal yang berjalan secara bersamaan.

### Terminal 1: Menyalakan Backend (FastAPI)
Buka terminal pertama, lalu jalankan:

```bash
cd backend
uvicorn main:app --reload --port 8000
```
✅ **Berhasil jika bisa membuka:** `http://127.0.0.1:8000/docs`

### Terminal 2: Menyalakan Frontend (React/Vite)
Buka tab terminal baru (Split Terminal), lalu jalankan:

```bash
cd frontend
npm run dev
```
✅ **Berhasil jika bisa membuka:** `http://localhost:5173` di browser.

---

## ⚠️ Troubleshooting (Penyelesaian Masalah)
1. **API Disconnected di Frontend:** Pastikan Terminal 1 (Backend) sedang berjalan dan tidak error.
2. **CORS Error saat Login:** Pastikan pengaturan CORS di `backend/main.py` sudah benar.
3. **Internal Server Error (500):** Pastikan PostgreSQL menyala dan password database sudah tepat.