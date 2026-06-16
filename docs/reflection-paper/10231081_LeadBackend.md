# Reflection Paper UAS Cloud Computing — Lead Backend
**Nama:** Rendy Rifandi Kurnia  
**Role:** Lead Backend Developer  
**Proyek:** SafeSpace — Cloud-Based Counseling Management System  

---

## 1. Pendahuluan dan Tanggung Jawab Peran

Sebagai Lead Backend dalam proyek **SafeSpace**, tanggung jawab utama saya adalah membangun fondasi sisi server yang menjadi penggerak utama seluruh fitur aplikasi. Saya bertugas memastikan logika bisnis berjalan benar, API konsisten, data tersimpan dengan baik, dan komunikasi antar service tetap stabil. Karena proyek ini berkembang dari backend monolith ke arsitektur microservices, pekerjaan saya tidak hanya berhenti pada membuat endpoint, tetapi juga mengatur struktur service, routing, keamanan, dan integrasi antar komponen.

Secara garis besar, peran saya mencakup:
1. **Membangun backend utama berbasis FastAPI:** Menyusun service utama untuk autentikasi, konsultasi, dashboard BK, validasi request, dan response yang konsisten.
2. **Menyiapkan fondasi data dan skema ORM:** Mengelola SQLAlchemy ORM untuk model user, consultation, student, class, topic, time slot, place, dan status konsultasi.
3. **Mengimplementasikan autentikasi dan otorisasi:** Membuat alur register, login, token JWT, serta pembatasan akses berdasarkan role konselor.
4. **Memecah sistem menjadi microservice:** Menyesuaikan backend ke bentuk `auth-service`, `item-service`, gateway Nginx, dan service pendukung monitoring.
5. **Menjaga isolasi data guru BK:** Memastikan setiap konselor hanya dapat melihat dan memproses konsultasi miliknya sendiri.
6. **Melakukan perbaikan teknis dan bug fixing:** Memperbaiki validasi input, format response, filter data, normalisasi nomor WhatsApp, seeding data awal, serta error handling agar API lebih siap dipakai frontend dan QA.

---

## 2. Kontribusi Utama dalam Proyek

Selama pengerjaan SafeSpace, kontribusi backend yang saya lakukan cukup besar dan bersifat langsung pada inti sistem.

* **Membangun service backend utama dengan FastAPI.** Saya mengerjakan entry point aplikasi pada [backend/main.py](C:/Users/USER/OneDrive/Documents/GitHub/cc-kelompok-a-suksesss/cc-kelompok-a-suksesss/backend/main.py), termasuk konfigurasi CORS, middleware error tracking, health check, validasi request, dan registrasi router dashboard BK. Dari sini backend dipersiapkan agar siap dipakai oleh frontend dan dapat diuji melalui Swagger UI.

* **Mengerjakan autentikasi berbasis JWT.** Saya membantu menyiapkan endpoint login konselor dan mekanisme token pada `POST /auth/counselor/login`, `POST /auth/counselor/token`, `GET /auth/me`, dan `GET /auth/counselor/me`. Alur ini penting supaya akses ke data internal hanya bisa dilakukan oleh user yang sah.

* **Menyusun alur konsultasi publik.** Saya mengerjakan endpoint publik untuk pengajuan konsultasi siswa tanpa login, termasuk validasi data siswa, pilihan konselor, master data kelas/topik/jam/tempat, dan pembuatan tracking code. Pada bagian ini saya juga memperbaiki beberapa validasi agar request yang masuk tidak merusak alur data.

* **Membangun dashboard BK yang terisolasi per konselor.** Pada [backend/routers/bk_dashboard.py](C:/Users/USER/OneDrive/Documents/GitHub/cc-kelompok-a-suksesss/cc-kelompok-a-suksesss/backend/routers/bk_dashboard.py), saya membuat endpoint statistik dashboard dan daftar konsultasi dengan pagination. Fokus utamanya adalah memastikan filter selalu menggunakan `counselor_id` milik user yang login, sehingga guru BK hanya melihat data miliknya sendiri.

* **Menyiapkan pemisahan microservice.** Saat sistem mulai diarahkan ke arsitektur microservices, saya menyesuaikan backend agar dipisah ke service yang lebih jelas: authentication service untuk login dan token, item/consultation service untuk data konsultasi dan master data, lalu gateway Nginx untuk routing. Hal ini terlihat pada konfigurasi `docker-compose.microservices.yml`, `docs/architecture.md`, dan `docs/operations-guide.md`.

* **Mendukung observability dan operasional service.** Saya ikut memastikan backend punya health check, logging yang lebih rapi, dan endpoint yang mudah dipantau. Pada service microservices juga disiapkan metrik Prometheus dan dashboard Grafana agar status service bisa dipantau saat dijalankan dengan Docker Compose.

---

## 3. Perbaikan dan Bug Fix yang Saya Lakukan

Bagian backend tidak hanya berisi penambahan fitur baru, tetapi juga perbaikan pada alur yang sebelumnya belum stabil.

* **Memperbaiki isolasi data konselor.** Saya memastikan query dashboard dan daftar konsultasi selalu difilter berdasarkan `counselor_id` dari user login. Ini penting karena tanpa filter yang tepat, guru BK bisa saja melihat data konselor lain.

* **Memperbaiki format validasi dan response error.** Saya menyesuaikan error handling supaya pesan validasi lebih singkat dan mudah dipahami, terutama untuk request yang gagal karena field kosong, format salah, atau data tidak sesuai.

* **Memperbaiki alur login Swagger UI.** Saya menambahkan endpoint OAuth2 login agar token bisa diuji langsung dari Swagger UI tanpa langkah manual yang berbelit.

* **Memperbaiki normalisasi nomor WhatsApp.** Pada pengolahan data konsultasi, nomor telepon dinormalisasi agar link WhatsApp bisa dibentuk dengan format yang valid. Ini penting supaya saat status konsultasi berubah, link komunikasi ke siswa tetap aman dipakai.

* **Menjaga konsistensi data master.** Saya memastikan data kelas, topik, waktu, dan tempat yang dipakai form publik hanya mengambil data aktif sehingga frontend tidak menampilkan pilihan yang sudah tidak valid.

* **Menyiapkan seed data dan health check.** Saya membantu menyiapkan data awal agar environment development bisa langsung dipakai, sekaligus menambahkan health endpoint supaya service mudah dicek saat dijalankan lokal maupun di Docker.

---

## 4. Tantangan yang Dihadapi

Selama pengerjaan backend, saya menemui beberapa tantangan teknis yang cukup nyata.

Tantangan terbesar adalah **menjaga isolasi data antar guru BK**. Karena semua data konsultasi tersimpan di sistem yang sama, saya harus sangat hati-hati agar query dashboard, daftar konsultasi, dan aksi accept/reject hanya bekerja pada data milik konselor yang sedang login. Kesalahan kecil di filter query bisa berakibat bocornya data antar pengguna.

Tantangan berikutnya adalah **menyesuaikan backend dari model monolith ke microservices**. Saat service dipisah, saya perlu memastikan route gateway, environment variable, port service, dan koneksi antar service tetap sinkron. Perubahan kecil pada satu service bisa memengaruhi service lain, jadi koordinasi implementasi menjadi penting.

Saya juga menghadapi tantangan dalam **menjaga response API tetap konsisten**. Frontend dan QA sangat bergantung pada format response backend. Karena itu, saat ada perubahan validasi atau penambahan endpoint, saya perlu memastikan output JSON tidak berubah sembarangan.

Selain itu, **debugging authentication dan Swagger UI** juga menjadi bagian yang cukup sering saya tangani. Saat token atau role tidak sesuai, endpoint protected tidak bisa diakses. Situasi seperti ini menuntut saya untuk memeriksa kembali dependency, schema, dan response login agar alur pengujian tetap lancar.

---

## 5. Pembelajaran yang Didapat

Melalui proyek SafeSpace, saya mendapat banyak pembelajaran yang lebih konkret dibanding sekadar teori backend di kelas.

Saya belajar bahwa **backend bukan hanya soal membuat endpoint**, tetapi soal merancang alur data yang aman, jelas, dan mudah diintegrasikan. Satu endpoint yang tampak sederhana bisa berdampak ke banyak bagian lain jika struktur datanya tidak stabil.

Saya juga memahami bahwa **microservice membutuhkan disiplin integrasi**. Pemisahan service memang membuat sistem lebih rapi, tetapi juga membuat komunikasi antar komponen harus jauh lebih terkontrol. Gateway, health check, token, dan database connection menjadi bagian yang tidak bisa diabaikan.

Selain itu, saya belajar bahwa **bug fixing adalah bagian penting dari pekerjaan backend**. Memperbaiki filter data, validasi input, format response, dan alur login sama pentingnya dengan menambah fitur baru, karena justru dari sana kualitas sistem terasa di frontend dan pada saat testing.

Secara non-teknis, saya belajar untuk lebih teliti dalam komunikasi tim. Backend sering menjadi penghubung antara kebutuhan frontend, QA, dan DevOps. Karena itu, setiap perubahan harus dijelaskan dengan jelas agar integrasi tidak tertunda.

---

## 6. Refleksi Pribadi

Proyek SafeSpace memberi saya pengalaman yang lebih realistis tentang bagaimana backend dibangun dalam proyek tim. Saya tidak hanya menulis logika server, tetapi juga melihat bagaimana service dipakai, diuji, di-deploy, dan dipantau.

Sebagai Lead Backend, saya merasa peran saya sangat menentukan kestabilan sistem. Kalau backend tidak rapi, maka frontend akan sulit diintegrasikan, QA akan sulit menguji, dan deployment juga berisiko bermasalah. Dari sini saya belajar bahwa kualitas backend bukan cuma diukur dari fitur yang berhasil dibuat, tetapi juga dari seberapa aman, konsisten, dan mudah dirawat service tersebut.

Pengalaman memecah sistem ke microservices juga mengubah cara saya melihat arsitektur aplikasi. Saya jadi lebih paham bahwa pemisahan service harus benar-benar didasarkan pada kebutuhan sistem, bukan sekadar memecah kode. Ada pertimbangan routing, monitoring, environment, serta tanggung jawab data di tiap service.

Ke depannya, saya ingin terus memperkuat kemampuan saya dalam desain API, keamanan backend, pengelolaan database, observability, dan arsitektur microservices supaya bisa membangun service yang lebih matang dan tahan terhadap perubahan kebutuhan.

---

## 7. Kesimpulan

Secara keseluruhan, proyek SafeSpace memberi saya pengalaman yang sangat berharga sebagai Lead Backend. Saya terlibat langsung dalam pembangunan API utama, autentikasi, dashboard BK, pemecahan service menjadi microservice, serta perbaikan-perbaikan teknis yang membuat sistem lebih stabil.

Melalui proyek ini saya belajar bahwa backend yang baik harus aman, konsisten, mudah diuji, dan mudah dipelihara. Saya juga belajar bahwa bug fix, integrasi antar service, dan koordinasi tim sama pentingnya dengan penulisan kode fitur baru. Pengalaman ini menjadi bekal yang sangat berguna bagi saya untuk mengerjakan sistem yang lebih kompleks di masa depan.
