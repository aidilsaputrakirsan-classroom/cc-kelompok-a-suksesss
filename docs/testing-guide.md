# 🧪 Testing Guide — SafeSpace Project

## 📌 Pendahuluan

Dokumen ini berisi panduan testing pada project **SafeSpace**, meliputi:

- Cara menjalankan testing backend dan frontend secara lokal
- Cara membaca log CI (Continuous Integration)
- Cara melakukan debugging ketika test gagal
- Cara menambahkan test baru
- Struktur testing yang digunakan pada project

Testing dilakukan untuk memastikan bahwa fitur aplikasi berjalan dengan benar, stabil, dan aman sebelum kode di-merge ke branch `main`.

---

# 🎯 Tujuan Testing

Testing dilakukan untuk:

- Memastikan endpoint API berjalan sesuai fungsi
- Memastikan UI frontend bekerja dengan baik
- Mengurangi kemungkinan bug saat deployment
- Memvalidasi perubahan kode sebelum merge
- Menjaga kualitas software secara konsisten

---

# 🧩 Jenis Testing yang Digunakan

| Jenis Test | Fungsi | Tools |
|---|---|---|
| Unit Test | Menguji fungsi/komponen secara terisolasi | pytest, Vitest |
| Integration Test | Menguji interaksi antar komponen | FastAPI TestClient |
| UI Component Test | Menguji tampilan dan interaksi React | Testing Library |
| CI Testing | Menjalankan test otomatis di GitHub Actions | GitHub Actions |

---

# ⚙️ Backend Testing (FastAPI + Pytest)

## 📂 Struktur Testing Backend

```text
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_items.py
│   └── test_health.py
│
├── pytest.ini
└── requirements.txt
```

## 📦 Dependencies Backend Testing

Dependencies testing backend terdapat pada:

```text
backend/requirements.txt
```

Testing menggunakan:

- pytest
- pytest-cov
- httpx

Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

---

## ▶️ Cara Menjalankan Test Backend

Masuk ke folder backend:

```bash
cd backend
```

Menjalankan semua test:

```bash
pytest
```

Menjalankan test dengan coverage:

```bash
pytest --cov=. --cov-report=term-missing
```

Menjalankan file test tertentu:

```bash
pytest tests/test_auth.py
```

Menjalankan satu test spesifik:

```bash
pytest tests/test_auth.py::test_login_success
```

---

## ✅ Contoh Output Test Backend

```text
tests/test_auth.py::test_register_success PASSED
tests/test_auth.py::test_login_success PASSED
tests/test_items.py::test_create_item PASSED

================ 10 passed in 2.10s ================
```

---

## 🧪 Penjelasan File Testing Backend

### 🔹 conftest.py

File ini digunakan untuk:

- Setup database testing
- Membuat test client
- Override dependency database
- Membuat authentication helper

Testing menggunakan SQLite sementara (`test.db`) agar:

- Lebih cepat
- Tidak mengganggu database utama
- Tidak membutuhkan PostgreSQL saat testing

---

### 🔹 test_auth.py

Digunakan untuk menguji fitur authentication:

- Register user
- Login user
- Validasi password salah
- Validasi duplicate email

---

### 🔹 test_items.py

Digunakan untuk menguji fitur CRUD item:

- Create item
- Read item
- Update item
- Delete item
- Search item

---

### 🔹 test_health.py

Digunakan untuk menguji endpoint:

```http
GET /health
```

Endpoint harus mengembalikan status healthy.

---

# ⚛️ Frontend Testing (React + Vitest)

## 📂 Struktur Testing Frontend

```text
frontend/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       ├── Header.test.jsx
│   │       └── ItemCard.test.jsx
│   │
│   └── test/
│       ├── setup.js
│       └── api.test.js
```

---

## 📦 Dependencies Frontend Testing

Frontend testing menggunakan:

- Vitest
- Testing Library React
- jsdom

Install dependencies:

```bash
cd frontend
npm install
```

---

## ▶️ Cara Menjalankan Test Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

Menjalankan semua test:

```bash
npm test
```

Mode watch:

```bash
npm run test:watch
```

Testing coverage:

```bash
npm run test:coverage
```

---

## ✅ Contoh Output Test Frontend

```text
✓ Header.test.jsx (2 tests)
✓ ItemCard.test.jsx (3 tests)
✓ api.test.js (2 tests)

Test Files 3 passed
Tests 7 passed
```

---

## 🧠 Penjelasan Testing Frontend

### 🔹 Header.test.jsx

Menguji:

- Judul aplikasi muncul
- Total items tampil dengan benar

---

### 🔹 ItemCard.test.jsx

Menguji:

- Informasi item tampil
- Tombol edit berjalan
- Tombol delete berjalan

---

### 🔹 api.test.js

Menguji:

- API request berhasil
- Error handling berjalan saat API gagal

---

# 🤖 Continuous Integration (CI)

Project menggunakan GitHub Actions untuk menjalankan testing otomatis.

File workflow:

```text
.github/workflows/ci.yml
```

---

## 🔄 Alur CI Pipeline

```text
Push / Pull Request
        ↓
GitHub Actions Triggered
        ↓
Test Backend
        ↓
Test Frontend
        ↓
Build Docker Images
        ↓
CI Status: PASS / FAIL
```

---

## 🧪 Jobs pada CI Pipeline

| Job | Fungsi |
|---|---|
| 🐍 Test Backend | Menjalankan pytest |
| ⚛️ Test Frontend | Menjalankan Vitest |
| 🐳 Build Docker | Build Docker image |

---

## 📖 Cara Membaca CI Log

### Langkah:

1. Buka repository GitHub
2. Klik tab Actions
3. Pilih workflow yang gagal
4. Klik job yang gagal
5. Expand step berwarna merah ❌
6. Baca pesan error

---

## ❌ Contoh Error CI

### Backend Error

```text
ModuleNotFoundError: No module named 'httpx'
```

Penyebab:

Dependency belum ada di `requirements.txt`

Solusi:

Tambahkan dependency lalu commit ulang.

---

### Frontend Error

```text
npm ERR! Missing package
```

Penyebab:

`package-lock.json` belum update

Solusi:

```bash
npm install
```

Lalu commit kembali.

---

### Docker Build Error

```text
COPY failed: file not found
```

Penyebab:

Path file di Dockerfile salah.

Solusi:

Periksa lokasi file dan instruksi `COPY`.

---

# 🐞 Cara Debug Test Failure

## 1. Jalankan Test Lokal

Selalu jalankan test di lokal sebelum push:

```bash
pytest
npm test
```

---

## 2. Baca Assertion Error

Contoh:

```text
AssertionError: expected 200 but got 404
```

Artinya endpoint tidak ditemukan atau route salah.

---

## 3. Periksa Response API

Tambahkan print debugging:

```python
print(response.json())
```

---

## 4. Periksa Environment Variables

Pastikan file `.env` sesuai konfigurasi.

---

## 5. Periksa Dependency

Pastikan semua dependency sudah di-install:

```bash
pip install -r requirements.txt
npm install
```

---

# ➕ Cara Menambahkan Test Baru

## 🔹 Backend

Tambahkan file baru di:

```text
backend/tests/
```

Contoh:

```text
test_dashboard.py
```

Contoh test:

```python
def test_dashboard(client):
    response = client.get("/dashboard")
    assert response.status_code == 200
```

---

## 🔹 Frontend

Tambahkan file test di:

```text
frontend/src/components/__tests__/
```

Contoh:

```text
SearchBar.test.jsx
```

Contoh test:

```jsx
it('renders search input', () => {
  render(<SearchBar />)
})
```

---

# 📋 Best Practices Testing

- Jalankan test sebelum commit
- Gunakan nama test yang jelas
- Pisahkan test backend dan frontend
- Hindari hardcode data sensitif
- Pastikan test independen
- Gunakan environment testing terpisah

---

# 🔐 Testing & Security

Testing juga membantu memastikan:

- Authentication berjalan aman
- JWT token tervalidasi
- Password tidak terekspos
- Endpoint private terlindungi

---

# 📊 Coverage Testing

Coverage menunjukkan seberapa banyak kode diuji.

Contoh:

```bash
pytest --cov=.
```

Target minimum coverage project:

- Backend ≥ 50%
- Frontend sesuai kebutuhan modul

Semakin tinggi coverage, semakin kecil kemungkinan bug tersembunyi.
---

# ✅ Kesimpulan

Testing merupakan bagian penting dalam pengembangan software modern.

Dengan kombinasi:

- Pytest
- Vitest
- GitHub Actions
- Docker

project SafeSpace memiliki proses validasi otomatis yang membantu menjaga kualitas aplikasi agar tetap stabil, aman, dan siap deployment.