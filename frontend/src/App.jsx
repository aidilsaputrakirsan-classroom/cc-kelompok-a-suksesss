const principles = [
  {
    title: "Privat",
    description: "Hanya guru BK yang dipilih yang dapat melihat data konsultasi siswa.",
  },
  {
    title: "Mudah Diakses",
    description: "Siswa dapat mengirim pengajuan tanpa login dan tetap mendapat kode pelacakan.",
  },
  {
    title: "Fleksibel",
    description: "Pilihan kelas, topik, waktu, dan tempat dikelola dinamis dari dashboard guru BK.",
  },
]

const milestones = [
  "Menyiapkan konfigurasi project dan environment lokal",
  "Membangun halaman publik pertama untuk SafeSpace",
  "Menyiapkan pondasi autentikasi, data master, dan tracking konsultasi",
]

const stats = [
  { value: "3", label: "Akses utama", note: "Guest, Guru BK, Admin" },
  { value: "100%", label: "Data terisolasi", note: "Berdasarkan counselorId" },
  { value: "1", label: "Kode tracking", note: "Untuk cek status konsultasi" },
]

function App() {
  return (
    <div className="app-shell">
      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">SafeSpace • Cloud Counseling System</div>
            <h1>Ruang konseling sekolah yang privat, aman, dan siap berkembang.</h1>
            <p>
              SafeSpace memulai alur kerja bimbingan konseling dengan akses tanpa login
              untuk siswa, isolasi data per guru BK, dan fondasi cloud-native untuk
              monitoring serta dokumentasi.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#setup">Lanjut ke setup</a>
              <a className="button button-secondary" href="#principles">Lihat prinsip</a>
            </div>

            <div className="mini-notes">
              <span>Guest form ready</span>
              <span>JWT auth ready</span>
              <span>PostgreSQL ready</span>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="panel-card panel-accent">
              <span>Step 1</span>
              <strong>Project setup</strong>
              <p>Menyiapkan environment, branding, dan landing page awal SafeSpace.</p>
            </div>

            <div className="panel-grid">
              {stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <small>{stat.note}</small>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="section" id="principles">
          <div className="section-heading">
            <span>Core principles</span>
            <h2>Landasan awal yang dipakai untuk seluruh fitur berikutnya.</h2>
          </div>

          <div className="principle-grid">
            {principles.map((principle) => (
              <article className="principle-card" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section two-column" id="setup">
          <div className="section-heading compact">
            <span>Project setup</span>
            <h2>Apa yang disiapkan pada tahap pertama.</h2>
            <p>
              Tahap ini mengubah kerangka awal menjadi dasar SafeSpace yang konsisten,
              sehingga fitur counseling, tracking, dan dashboard bisa dibangun di atasnya.
            </p>
          </div>

          <div className="timeline-card">
            {milestones.map((item, index) => (
              <div className="timeline-item" key={item}>
                <div className="timeline-index">0{index + 1}</div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section access-strip">
          <article>
            <span>Public flow</span>
            <strong>Mulai dari landing page, pilih guru BK, lalu kirim form tanpa login.</strong>
          </article>
          <article>
            <span>Private flow</span>
            <strong>Guru BK hanya melihat data miliknya sendiri, admin tetap punya akses global.</strong>
          </article>
          <article>
            <span>Foundation</span>
            <strong>Backend FastAPI, PostgreSQL, dan frontend React Vite disiapkan sejak awal.</strong>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App