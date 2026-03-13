# 🧪 UI Testing Results 

Dokumen ini berisi hasil pengujian antarmuka (UI Testing) untuk memastikan integrasi frontend dan backend berjalan dengan baik.

Pengujian dilakukan berdasarkan checklist Workshop 3.6 dengan skenario penggunaan nyata oleh user.

---

## 📋 Informasi Pengujian

- **Role**: Lead QA & Documentation
- **Metode Testing**: Manual Testing
- **Tools**: Browser + Screenshot Tool
- **Environment**: Local Development
- **Status Keseluruhan**: 🟢 **SEMUA PASS**

---

## ✅ Hasil Pengujian UI

| No | Test Case | Langkah Pengujian | Expected Result | Actual Result | Status |
|----|-----------|------------------|-----------------|---------------|--------|
| 1 | Cek koneksi API | Jalankan aplikasi frontend | Status API menunjukkan Connected | API berhasil terhubung | ✅ PASS |
| 2 | Data items tampil | Buka halaman daftar item | Item dari backend muncul | Data tampil dengan benar | ✅ PASS |
| 3 | Tambah item baru | Isi form lalu submit | Item baru tersimpan | Item berhasil ditambahkan | ✅ PASS |
| 4 | Item muncul di daftar | Setelah submit | Item langsung muncul | Data tampil di list | ✅ PASS |
| 5 | Edit item | Klik tombol Edit | Form edit terbuka | Form berhasil terbuka | ✅ PASS |
| 6 | Update data item | Ubah harga lalu klik Update | Data diperbarui | Harga berhasil berubah | ✅ PASS |
| 7 | Search item | Gunakan SearchBar | Item sesuai keyword tampil | Pencarian bekerja | ✅ PASS |
| 8 | Hapus item | Klik Delete | Dialog konfirmasi muncul | Dialog tampil | ✅ PASS |
| 9 | Item terhapus | Konfirmasi delete | Item hilang dari daftar | Item berhasil dihapus | ✅ PASS |
| 10 | Empty state | Hapus semua item | Tampilan kosong muncul | Empty state tampil | ✅ PASS |

---

## 🖼️ Screenshot Pengujian

Screenshot hasil pengujian pada bagian berikut:

### 1. API Connected
![API Connected](./images/CC%203.1.png)

### 2. Items List
![Items List](./images/CC%203.2.png)

### 3. Add Item
![Add Item](./images/CC%203.3.png)

### 4. Item Muncul
![Edit Item](./images/CC%203.4.png)

### 5. Edit Item
![Search](./images/CC%203.5.png)

### 6. Ubah Data Harga
![Delete Confirmation](./images/CC%203.6.png)

### 7. Search Item
![Empty State](./images/CC%203.7.png)

### 8. Delete Item
![Empty State](./images/CC%203.8.png)

### 9. Item Hilang dari Daftar
![Empty State](./images/CC%203.9.png)

### 10. Deleta All Item
![Empty State](./images/CC%203.10.png)

---

## 🧾 Kesimpulan

Berdasarkan hasil pengujian, seluruh alur utama aplikasi berjalan sesuai dengan fungsionalitas yang diharapkan. Integrasi antara frontend dan backend berhasil dilakukan tanpa error.