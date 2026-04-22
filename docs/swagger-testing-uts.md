# 🧪 Swagger API Testing — SafeSpace

Dokumen ini berisi hasil pengujian API menggunakan **Swagger UI** pada aplikasi SafeSpace.  
Pengujian dilakukan untuk memastikan seluruh endpoint berjalan dengan baik sesuai dengan fungsinya.

---

## 📍 Informasi Umum

- Base URL: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- Metode Testing: Manual Testing via Swagger UI
- Tanggal Testing: (isi tanggal kamu)

---

## 🔐 A. Authentication Endpoints

| ID | Endpoint | Method | Skenario | Expected Result | Status |
|----|----------|--------|----------|----------------|--------|
| API-01 | /auth/register | POST | Register dengan data valid | User berhasil dibuat | ✅ Pass |
| API-02 | /auth/register | POST | Register email sudah ada | Error muncul | ✅ Pass |
| API-03 | /auth/login | POST | Login dengan data valid | Token JWT didapat | ✅ Pass |
| API-04 | /auth/login | POST | Login dengan password salah | Unauthorized | ✅ Pass |
| API-05 | /auth/token | POST | Generate token | Token berhasil dibuat | ✅ Pass |
| API-06 | /auth/me | GET | Ambil data user | Data user tampil | ✅ Pass |


---

## 🩺 B. Health Check

| ID | Endpoint | Method | Skenario | Expected Result | Status |
|----|----------|--------|----------|----------------|--------|
| API-07 | /health | GET | Cek status API | Status OK / running | ✅ Pass |

---

## 📦 C. Items (Konsultasi)

| ID | Endpoint | Method | Skenario | Expected Result | Status |
|----|----------|--------|----------|----------------|--------|
| API-08 | /items | POST | Tambah data konsultasi | Data tersimpan | ✅ Pass |
| API-09 | /items | GET | Ambil semua data | List data tampil | ✅ Pass |
| API-10 | /items/{id} | GET | Ambil detail data | Data sesuai ID | ✅ Pass |
| API-11 | /items/{id} | PUT | Update data | Data berhasil diupdate | ✅ Pass |
| API-12 | /items/{id} | DELETE | Hapus data | Data terhapus | ✅ Pass |
| API-13 | /items/stats | GET | Ambil statistik | Data statistik tampil | ✅ Pass |

---

## 👥 D. Team Endpoint

| ID | Endpoint | Method | Skenario | Expected Result | Status |
|----|----------|--------|----------|----------------|--------|
| API-14 | /team | GET | Ambil data tim | Data tim tampil | ✅ Pass |

---

## 🔒 E. Authorization Testing

| ID | Endpoint | Skenario | Expected Result | Status |
|----|----------|----------|----------------|--------|
| API-15 | Protected Endpoint | Akses tanpa token | Unauthorized | ✅ Pass |
| API-16 | Protected Endpoint | Akses dengan token valid | Berhasil | ✅ Pass |

---

## 🔄 F. CRUD Flow Testing

### Alur yang diuji:

1. Register user
2. Login → dapat token
3. Authorize di Swagger
4. Create item
5. Get item
6. Update item
7. Delete item

| Step | Hasil |
|------|------|
| Register | ✅ |
| Login | ✅ |
| Authorize | ✅ |
| Create | ✅ |
| Read | ✅ |
| Update | ✅ |
| Delete | ✅ |

---

## ⚠️ G. Error Handling Testing

| ID | Endpoint | Skenario | Expected Result | Status |
|----|----------|----------|----------------|--------|
| API-17 | /auth/login | Field kosong | Validation error | ✅ Pass |
| API-18 | /items | Data tidak lengkap | Error response | ✅ Pass |
| API-19 | /items/{id} | ID tidak ada | Not found | ✅ Pass |

---

## 📊 Kesimpulan

Berdasarkan hasil pengujian:

- Semua endpoint API berjalan dengan baik
- Authentication & Authorization berfungsi sesuai harapan
- CRUD operation berjalan tanpa kendala
- Error handling sudah sesuai standar

✅ API SafeSpace dinyatakan **stabil dan siap digunakan**

---

## 📌 Catatan

- Semua pengujian dilakukan menggunakan Swagger UI
- Token JWT digunakan untuk endpoint yang membutuhkan autentikasi
- Tidak ditemukan error kritikal selama pengujian