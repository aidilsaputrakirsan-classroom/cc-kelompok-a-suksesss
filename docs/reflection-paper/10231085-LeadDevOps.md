# Reflection Paper – Rizki Abdul Aziz

## Pendahuluan

SafeSpace merupakan aplikasi konseling berbasis web yang dikembangkan sebagai solusi sistem konseling berbasis cloud yang bertujuan untuk mempermudah interaksi antara siswa dan guru BK di lingkungan sekolah. Banyak siswa kadang takut untuk melakukan konseling dengan guru karena takut dicap 'lemah', dan ungkapan merendahkan lainnya. Sehingga SafeSpace ini dirancang untuk menjawab tantangan privasi dan efisiensi dalam proses bimbingan konseling, di mana setiap data perlu dikelola dengan tingkat keamanan yang tinggi namun tetap mudah diakses, serta data yang telah diinput ke dalam sistem tidak dapat diakses oleh siapapun kecuali konselor atau guru yang dituju.

Dalam pengembangan SafeSpace, saya memegang peran sebagai Lead DevOps. Tanggung jawab saya mencakup lebih dari sekadar memastikan aplikasi "bisa jalan". Saya bertanggung jawab penuh atas perancangan dan pemeliharaan arsitektur sistem—memastikan bagaimana setiap komponen, mulai dari frontend, backend, hingga integrasi database pihak ketiga seperti Supabase, dapat saling terhubung dan berkomunikasi dengan aman, efisien, dan konsisten.

## Kontribusi dalam Proyek

Sebagai Lead DevOps, kontribusi saya berfokus pada pembangunan fondasi arsitektur antara pengembangan kode dan operasional server. Langkah pertama yang saya lakukan adalah menerapkan *branch protection rules* pada repositori GitHub untuk menjaga integritas kode utama dari perubahan yang tidak disengaja. Selanjutnya, saya memimpin transisi arsitektur aplikasi dari monolith menjadi microservices, memecah layanan menjadi entitas sendiri seperti Auth Service dan Item Service.

Untuk memastikan komunikasi *environment* antar tim berjalan dapat berjalan dengan maksimal, saya mengimplementasikan containerization menggunakan Docker dan Docker Compose. Saya juga melakukan migrasi basis data dari PostgreSQL lokal menuju basis data terkelola berbasis *cloud* menggunakan Supabase. Hal ini dilakukan agar aplikasi memiliki skalabilitas yang lebih baik.

Di sisi operasional, saya mengatur konfigurasi jaringan dan keamanan melalui Nginx sebagai API Gateway, mengelola environment variables (seperti konfigurasi CORS dan database URL), serta membangun pipeline untuk deployment secara otomatis ke platform Render. Terakhir, saya menyiapkan sistem monitoring menggunakan Prometheus dan Grafana untuk memastikan kesehatan seluruh layanan dapat dipantau secara real-time.

## Tantangan yang Dihadapi

Selama proses pengembangan, ada beberapa tantangan yang cukup melelahkan. Salah satu tantangan terbesar adalah momen ketika saya harus memigrasikan sistem dari monolith ke microservices. Mungkin karena saat itu pikiran saya lagi *burnout*, saya kebingungan bagaimana sebenarnya migrasi data monolith ke microservices ini. Sehingga sempat terjadi kerusakan yang malah nyebar kemana-mana. Namun setelah pelan pelan mencari tahu, ternyata inti permasalahannya cuma belum mengkomunikasikan antara frontend render dengan auth-service dan item-service menggunakan VITE_AUTH_URL dan VITE_API_URL.

Tantangan lain yang paling sering muncul sih terkait masalah CORS (Cross-Origin Resource Sharing). Sangat melelahkan melihat log error merah di browser yang terus-menerus memblokir permintaan dari frontend ke backend. Saya menyadari bahwa dalam arsitektur yang terdistribusi, mengizinkan akses antar domain tidak sesederhana menambahkan satu baris kode, melainkan harus diatur dengan ketat melalui gateway.

Dan mungkin tantangan lain namun sedikit out of topic yaitu pemyimpanan disk C yang sering penuh, karena berulang kali harus build libray-library docker. Ngebuat images dan container yang cukup banyak di awal awal produksi sehingga memakan ram laptop. Sehingga harus sering sering ngebersihin file file build docker yang sudah lama atau nge-remove images dan container yang udah ga dipakai lagi.

Selain itu, konfigurasi routing pada Nginx juga menjadi rintangan tersendiri. Saya sempat terjebak dalam looping error 404 Not Found. Saya harus merombak ulang konfigurasi Nginx dari yang awalnya menumpuk banyak endpoint, menjadi sistem wildcard path mapping yang lebih dinamis. Kesalahan sekecil kurangnya satu karakter garis miring (/) pada pengaturan proxy_pass ternyata bisa membuat seluruh jalur API terputus. Hal ini menuntut tingkat ketelitian yang sangat tinggi.

## Pembelajaran yang Didapat

Melalui proyek SafeSpace ini, saya mendapat beberapa pembelajaran penting. Saya belajar bahwa menjadi seorang pengembang perangkat lunak tidak cukup hanya dengan memastikan "kode berjalan di laptop saya" melainkan bagaimana ketika sistem ini nantinya digunakan di perangkat orang lain yang ingin menjalankan sistem tersebut. Saya mendapatkan pemahaman mengenai manajemen jaringan Docker, fungsi krusial reverse proxy, hingga bagaimana mengelola variabel lingkungan untuk memisahkan konfigurasi local dan production.

Dari sisi pemecahan masalah (troubleshooting), saya belajar bahwa debugging pada infrastruktur cloud bukanlah proses menebak error nya dimana, melainkan membaca alur komunikasi antar server. Ketika sebuah data tidak muncul di layar pengguna, saya belajar untuk mengurutkan pengecekan mulai dari frontend, konfigurasi Nginx, aturan CORS, hingga health check di backend.

Dari sisi non-teknis, peran ini mengajarkan saya tentang tanggung jawab yang besar. Sebagai fondasi dari aplikasi, ketika infrastruktur yang saya bangun mengalami gangguan, pekerjaan anggota tim lain seperti frontend dan backend akan ikut terhenti. Hal ini melatih saya untuk bekerja dengan lebih tenang di bawah tekanan dan mengambil keputusan teknis yang efisien.