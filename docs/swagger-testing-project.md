# 🧪 API Testing Documentation (Swagger)

Dokumen ini berisi hasil pengujian API backend menggunakan Swagger UI pada aplikasi **SafeSpace**.

---

## 🔗 Akses Swagger

Swagger UI dapat diakses melalui:

http://localhost:8000/docs

---

## 🔐 Authentication Testing

### 1. GET /health
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Endpoint mengembalikan status `healthy`
  - Menandakan backend berjalan dengan baik
   ![Health Check](./images/CC%207.1.png)

---

### 2. POST /auth/register
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - User baru berhasil dibuat
  - Validasi berjalan dengan baik (tidak menerima duplicate user)
   ![Health Check](./images/CC%207.2.png)


---

### 3. POST /auth/login
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Login berhasil menggunakan akun terdaftar
  - Sistem menghasilkan access token (JWT)
   ![Health Check](./images/CC%207.3.png)


---

### 4. POST /auth/token
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Endpoint berfungsi sebagai alternatif login
  - Token berhasil dihasilkan


---

### 5. Authorize (JWT)
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Token digunakan dengan format:
    ```
    Bearer <access_token>
    ```
  - Endpoint protected dapat diakses setelah authorize
   ![Health Check](./images/CC%207.4.png)


---

### 6. GET /auth/me
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Menampilkan data user yang sedang login
  - Validasi token berjalan dengan baik
   ![Health Check](./images/CC%207.5.png)


---

## 📦 Items CRUD Testing

### 1. POST /items
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Item berhasil dibuat dan tersimpan di database
   ![Health Check](./images/CC%207.6.png)


---

### 2. GET /items
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Menampilkan seluruh data item
  - Data sesuai dengan hasil input
   ![Health Check](./images/CC%207.7.png)


---

### 3. GET /items/stats
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Menampilkan statistik jumlah item
  - Data sesuai dengan kondisi database
   ![Health Check](./images/CC%207.8.png)


---

### 4. GET /items/{item_id}
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Mengambil data item berdasarkan ID
  - Data sesuai dengan item yang dipilih
   ![Health Check](./images/CC%207.9.png)


---

### 5. PUT /items/{item_id}
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Data item berhasil diperbarui
  - Perubahan dapat diverifikasi melalui GET endpoint
   ![Health Check](./images/CC%207.10.png)


---

### 6. DELETE /items/{item_id}
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Item berhasil dihapus dari database
  - Data tidak lagi muncul pada GET /items
   ![Health Check](./images/CC%207.11.png)


---

## 👥 Additional Endpoint

### GET /team
- **Status:** ✅ Berhasil
- **Deskripsi:**
  - Endpoint berjalan dengan baik
  - Menampilkan informasi tim
   ![Health Check](./images/CC%207.12.png)


---

## 🔄 End-to-End Flow Testing

Pengujian dilakukan dengan alur berikut:

1. Register user baru  
2. Login untuk mendapatkan token  
3. Authorize menggunakan JWT  
4. Create item  
5. Get items  
6. Get item by ID  
7. Update item  
8. Delete item  

- **Hasil:** ✅ Semua proses berjalan dengan baik tanpa error

---

## ⚠️ Negative Testing

Beberapa skenario pengujian tambahan:

- Login dengan password salah → ❌ Ditolak (validasi berjalan)  
- Akses endpoint tanpa token → ❌ Unauthorized  
- Mengakses item yang sudah dihapus → ❌ Data tidak ditemukan  

- **Hasil:** ✅ Sistem berhasil menangani error dengan baik

---

## 📊 Kesimpulan

Hasil pengujian menunjukkan bahwa:

- Backend berjalan dengan stabil  
- Authentication (JWT) berfungsi dengan baik  
- Semua endpoint CRUD berjalan normal  
- Validasi dan error handling berjalan sesuai harapan  

Status: ✅ **SEMUA FITUR BERJALAN DENGAN BAIK**
