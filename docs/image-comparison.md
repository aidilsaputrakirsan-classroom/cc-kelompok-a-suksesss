# 📊 Docker Image Size Comparison

Dokumen ini berisi perbandingan ukuran beberapa base image Python yang digunakan untuk evaluasi efisiensi Docker image pada backend aplikasi.

---

## 🎯 Tujuan

Membandingkan ukuran image berikut:

- `python:3.12`
- `python:3.12-slim`
- `python:3.12-alpine`

Perbandingan ini membantu menentukan base image terbaik berdasarkan:

- Ukuran image
- Efisiensi storage
- Kecepatan build & deployment

---

## 🧪 Metode Pengujian

Image diunduh menggunakan perintah:

```bash
docker pull python:3.12
docker pull python:3.12-slim
docker pull python:3.12-alpine
```

Kemudian ukuran image diperiksa menggunakan:

```bash
docker images python
```

---

## 📦 Hasil Perbandingan

![Perbandingan](./images/CC%205.1.png)

| Image | Disk Usage | Content Size | Keterangan |
|------|------------|-------------|------------|
| python:3.12 | 1.62 GB | 428 MB | Full Python image (lengkap) |
| python:3.12-slim | 179 MB | 45.4 MB | Versi minimal Debian |
| python:3.12-alpine | 75 MB | 18.7 MB | Sangat ringan berbasis Alpine Linux |

---

## 📈 Analisis

### 🐍 python:3.12
**Kelebihan**
- Dependency lengkap
- Kompatibilitas tinggi
- Mudah untuk development

**Kekurangan**
- Ukuran sangat besar
- Build dan deploy lebih lambat

---

### 🪶 python:3.12-slim
**Kelebihan**
- Ukuran jauh lebih kecil dari versi full
- Tetap stabil (Debian-based)
- Cocok untuk production backend

**Kekurangan**
- Beberapa package sistem perlu install manual

---

### ⚡ python:3.12-alpine
**Kelebihan**
- Ukuran paling kecil
- Sangat ringan dan cepat didownload

**Kekurangan**
- Menggunakan musl libc (bukan glibc)
- Beberapa Python packages sulit dikompilasi
- Debugging lebih kompleks

---

## ✅ Kesimpulan

Image **python:3.12-slim** dipilih sebagai base image backend karena memberikan keseimbangan terbaik antara:

- ✅ Ukuran image kecil
- ✅ Stabilitas tinggi
- ✅ Kompatibilitas dependency
- ✅ Build time lebih cepat dibanding full image

Walaupun `alpine` lebih kecil, risiko kompatibilitas dependency lebih tinggi sehingga kurang ideal untuk backend aplikasi ini.

---

## 📌 Rekomendasi QA

Gunakan:

```
python:3.12-slim
```

untuk environment production karena lebih efisien tanpa mengorbankan stabilitas aplikasi.

---

## 🧾 Author

Lead QA & Documentation (Azizah)
Cloud Computing Project - Week 5