# 📘 Git Workflow Guide — Cloud Team Suksesss

Dokumen ini menjelaskan standar workflow Git yang digunakan dalam pengembangan proyek, termasuk **branching strategy**, **commit convention**, **Pull Request (PR) process**, serta **code review guidelines**.

---

## 🎯 Tujuan

* Menjaga kualitas kode tetap tinggi
* Memastikan kolaborasi tim berjalan rapi & terstruktur
* Menghindari konflik dan kesalahan saat pengembangan
* Menyediakan standar yang konsisten untuk seluruh anggota tim

---

## 🌿 1. Branching Strategy (GitHub Flow)

Tim menggunakan **GitHub Flow**, dengan prinsip utama:

* `main` selalu dalam kondisi **deployable (siap dijalankan)**
* Semua perubahan dilakukan melalui **branch terpisah**
* Tidak boleh langsung push ke `main`
* Semua perubahan harus melalui **Pull Request (PR)**

---

## 🏷️ 2. Branch Naming Convention

Format penamaan branch:

```
tipe/deskripsi-singkat
```

Gunakan **lowercase** dan **kebab-case**

### 📌 Jenis Branch

| Tipe        | Keterangan                       | Contoh                      |
| ----------- | -------------------------------- | --------------------------- |
| `feature/`  | Fitur baru                       | `feature/item-filter`       |
| `fix/`      | Perbaikan bug                    | `fix/login-error`           |
| `docs/`     | Dokumentasi                      | `docs/git-workflow`         |
| `refactor/` | Perbaikan kode tanpa ubah fungsi | `refactor/auth-module`      |
| `chore/`    | Maintenance/config               | `chore/update-dependencies` |

---

## 📝 3. Commit Message Convention

Menggunakan **Conventional Commits**

### Format:

```
tipe: deskripsi singkat
```

### Contoh:

| Tipe       | Contoh                              |
| ---------- | ----------------------------------- |
| `feat`     | `feat: add consultation endpoint`   |
| `fix`      | `fix: resolve token expiration bug` |
| `docs`     | `docs: update README documentation` |
| `refactor` | `refactor: simplify CRUD logic`     |
| `chore`    | `chore: update dependencies`        |
| `test`     | `test: add API test cases`          |

---

## 🔄 4. Pull Request (PR) Process

### 📌 Alur PR

1. Update branch `main`

```bash
git checkout main
git pull origin main
```

2. Buat branch baru

```bash
git checkout -b feature/nama-fitur
```

3. Lakukan perubahan & commit

```bash
git add .
git commit -m "feat: add new feature"
```

4. Push ke GitHub

```bash
git push origin feature/nama-fitur
```

5. Buat Pull Request di repository

---

### 📄 Struktur PR

**Title:**

```
feat: add consultation feature
```

**Description:**

```md
## Perubahan
- Menambahkan fitur X
- Update endpoint Y

## Checklist
- [x] Sudah dites
- [x] Tidak ada error
```

---

### 🔀 Merge Strategy

Tim menggunakan:

> ✅ **Squash & Merge**

**Alasan:**

* History lebih rapi
* 1 fitur = 1 commit di main
* Mudah rollback

---

## 👀 5. Code Review Guidelines

Saat melakukan review PR, perhatikan:

### 🔍 Aspek yang Dicek

| Aspek          | Penjelasan                          |
| -------------- | ----------------------------------- |
| Fungsionalitas | Apakah fitur berjalan sesuai tujuan |
| Readability    | Apakah kode mudah dibaca            |
| Best Practices | Apakah mengikuti standar tim        |
| Edge Cases     | Apakah kondisi ekstrem ditangani    |
| Security       | Apakah ada potensi celah keamanan   |

---

### ✅ Contoh Review yang Baik

* 👍 "Nice! Struktur kodenya sudah rapi"
* 💡 "Saran: tambahkan error handling untuk kondisi null"
* ❓ "Kenapa pakai status code 200, bukan 201?"

---

### ❌ Contoh Review yang Buruk

* "Kodenya salah"
* "LGTM" (tanpa review)
* Komentar kosong

---

## 👥 6. CODEOWNERS Integration

File `CODEOWNERS` digunakan untuk menentukan reviewer otomatis berdasarkan file yang diubah.

### 📌 Konfigurasi:

```
# Backend — Lead Backend
/backend/                @NorEndGate

# Frontend — Lead Frontend
/frontend/               @risch24

# Docker & Infrastructure — Lead DevOps
docker-compose.yml       @rizkiiaaz
/backend/Dockerfile      @rizkiiaaz
/frontend/Dockerfile     @rizkiiaaz
Makefile                 @rizkiiaaz

# Documentation — Lead QA & Docs
README.md                @Azizah66
/docs/                   @Azizah66
```

### 🎯 Manfaat:

* Reviewer otomatis ditentukan
* Mempercepat proses review
* Tanggung jawab lebih jelas

---

## 🔐 7. Branch Protection Rules

Branch `main` dilindungi dengan aturan:

* ❌ Tidak bisa push langsung
* ✅ Wajib melalui Pull Request
* ✅ Wajib minimal 1 approval
* ✅ Harus lolos review sebelum merge

---

## ✅ 8. Best Practices

* Selalu pull `main` sebelum membuat branch
* Commit kecil tapi sering
* Gunakan nama branch yang jelas
* Tulis commit message yang deskriptif
* Jangan merge tanpa review
* Hapus branch setelah merge

---

## 📌 Kesimpulan

Workflow ini memastikan:

* Kolaborasi tim berjalan efektif
* Kode tetap rapi dan terstruktur
* Risiko bug dan konflik berkurang

Dengan mengikuti standar ini, pengembangan proyek menjadi lebih **terkontrol, aman, dan profesional**.

---