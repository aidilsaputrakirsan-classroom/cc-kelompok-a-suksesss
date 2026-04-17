import { useState, useEffect, useRef } from 'react'
import './App.css'

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

export default function App() {
  const [view, setView] = useState('home') // 'home', 'alur', 'ajukan'
  const [heroRef, heroVis] = useReveal()

  // ── FITUR CEK KONEKSI (Mengecek ke endpoint /health backendmu) ──
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then(res => res.json())
      .then(data => {
        console.log("SUKSES TERHUBUNG KE BACKEND:", data);
      })
      .catch(err => {
        console.error("GAGAL TERHUBUNG KE BACKEND. Pastikan uvicorn sudah menyala di port 8000!", err);
      });
  }, []);

  return (
    <div className="shell">
      <div className="orb orb-1" />
      
      {/* ── Navigation ── */}
      <nav className="nav">
        <div className="nav-brand" onClick={() => setView('home')}>
          <div className="nav-logo">🌿</div>
          <span>SafeSpace</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Beranda</button>
          <button className={`nav-link ${view === 'alur' ? 'active' : ''}`} onClick={() => setView('alur')}>Alur Kerja</button>
          <button className="nav-cta" onClick={() => setView('ajukan')}>Mulai Konseling →</button>
        </div>
      </nav>

      <main className="view-container">
        
        {/* ── VIEW: HOME ── */}
        {view === 'home' && (
          <div ref={heroRef} className={`reveal ${heroVis ? 'is-visible' : ''}`}>
            <section className="hero-grid">
              <div>
                <div style={{ color: '#2dd4bf', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '15px' }}>SAFE & PRIVATE COUNSELING</div>
                <h1 className="hero-h1">Tempat Aman untuk <br/><span className="gradient-text">Cerita Kamu.</span></h1>
                <p style={{ color: 'rgba(220,215,255,0.7)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '35px', maxWidth: '500px' }}>
                  Privasi adalah prioritas kami. Konsultasikan masalah belajarmu secara anonim dan aman dengan guru BK profesional ITK.
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button className="nav-cta" onClick={() => setView('ajukan')}>Ajukan Sekarang</button>
                  <button className="nav-link" onClick={() => setView('alur')} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px' }}>Lihat Cara Kerja ↓</button>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100%', height: '350px', background: 'rgba(124,58,237,0.1)', borderRadius: '30px', border: '1px solid rgba(124,58,237,0.2)', display: 'grid', placeItems: 'center' }}>
                  <span style={{ fontSize: '5rem' }}>🍃</span>
                </div>
              </div>
            </section>

            <section style={{ marginTop: '100px' }}>
              <h2 className="p-title" style={{ textAlign: 'center', fontSize: '2.2rem' }}>Tiga Fondasi Utama</h2>
              <div className="card-grid">
                <PrincipleCard icon="🔐" title="Privat" desc="Hanya kamu dan guru BK yang bisa mengakses percakapan. Admin pun tidak bisa melihatnya." />
                <PrincipleCard icon="🌱" title="Mudah" desc="Tidak perlu buat akun. Cukup isi form dan pantau status menggunakan kode pelacak unik." />
                <PrincipleCard icon="☁️" title="Fleksibel" desc="Atur jadwal dan tempat sesuai kenyamananmu, baik secara tatap muka maupun daring." />
              </div>
            </section>
          </div>
        )}

        {/* ── VIEW: ALUR KERJA ── */}
        {view === 'alur' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span style={{ color: '#7c3aed', fontWeight: 700 }}>STEP BY STEP</span>
              <h1 className="hero-h1" style={{ fontSize: '3rem' }}>Bagaimana ini bekerja?</h1>
            </div>
            <div className="step-container">
              <StepBox num="01" title="Isi Formulir" desc="Pilih guru BK, waktu, dan ceritakan sedikit tentang apa yang kamu hadapi." />
              <StepBox num="02" title="Terima Kode Pelacak" desc="Setelah mengirim, simpan kode unik yang muncul untuk cek status dikemudian hari." />
              <StepBox num="03" title="Konfirmasi Guru BK" desc="Gurumu akan melihat pengajuanmu dan memberikan jadwal pasti melalui sistem." />
              <StepBox num="04" title="Mulai Konseling" desc="Bertemu di tempat yang disepakati dan mulailah perjalanan kesehatan mentalmu." />
            </div>
            <center style={{ marginTop: '50px' }}>
              <button className="nav-cta" onClick={() => setView('ajukan')}>Siap Untuk Memulai? Klik Di Sini</button>
            </center>
          </div>
        )}

        {/* ── VIEW: AJUKAN KONSELING ── */}
        {view === 'ajukan' && (
          <div className="form-page">
            <div className="form-sidebar">
              <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '0.75rem' }}>FORM KONSELING</span>
              <h2 className="p-title" style={{ marginTop: '15px' }}>Suaramu berhak didengar.</h2>
              <p className="p-desc">Isi form ini dengan jujur agar guru BK bisa membantumu dengan maksimal. Data kamu aman bersama kami.</p>
              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#2dd4bf', fontSize: '0.9rem' }}><span>✓</span> Tanpa Akun</div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#2dd4bf', fontSize: '0.9rem' }}><span>✓</span> Enkripsi Privat</div>
              </div>
            </div>
            <div className="form-main">
              <ConsultForm />
            </div>
          </div>
        )}

      </main>

      <footer style={{ textAlign: 'center', padding: '40px', color: 'rgba(220,215,255,0.4)', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        SafeSpace — Cloud Counseling System ITK © 2026
      </footer>
    </div>
  )
}

function PrincipleCard({ icon, title, desc }) {
  return (
    <div className="p-card">
      <span className="p-icon">{icon}</span>
      <h3 className="p-title">{title}</h3>
      <p className="p-desc">{desc}</p>
    </div>
  )
}

function StepBox({ num, title, desc }) {
  return (
    <div className="step-box">
      <div className="step-num">{num}</div>
      <div>
        <h3 className="p-title" style={{ fontSize: '1.3rem', marginBottom: '5px' }}>{title}</h3>
        <p className="p-desc">{desc}</p>
      </div>
    </div>
  )
}

function ConsultForm() {
  // ── Penampung Data Input ──
  const [nama, setNama] = useState('')
  const [kelas, setKelas] = useState('')
  const [gender, setGender] = useState('')
  const [cerita, setCerita] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Fungsi Kirim Data ke Backend (FastAPI) ──
  const handleSubmit = async () => {
    // Validasi sederhana
    if (!nama || !kelas || !gender || !cerita) {
      alert("Harap isi semua kolom formulir!");
      return;
    }

    setLoading(true);

    // !! CATATAN PENTING !!
    // Pastikan nama field di bawah ini (full_name, grade, gender, description) 
    // SAMA PERSIS dengan apa yang diminta oleh schemas.ConsultationGuestCreate di file backend kamu.
    const payload = {
      full_name: nama,
      grade: kelas,
      gender: gender, 
      description: cerita
    };

    try {
      const response = await fetch("http://localhost:8000/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Jika Backend mengembalikan kode pelacak, kita tampilkan
        const trackCode = data.tracking_code || data.id || "Sukses";
        alert(`Pengajuan berhasil dikirim!\nSimpan kode pelacak Anda: ${trackCode}`);
        
        // Reset form setelah sukses
        setNama('');
        setKelas('');
        setGender('');
        setCerita('');
      } else {
        // Jika backend merespon tapi ada error (status 400, 422, dsb)
        console.error("Error dari backend:", data);
        alert("Gagal mengirim: " + (data.detail || "Terjadi kesalahan pada data"));
      }
    } catch (error) {
      // Jika server mati atau masalah jaringan
      console.error("Error jaringan:", error);
      alert("Gagal menyambung ke server. Pastikan backend sudah menyala!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div className="input-group">
        <label>Nama Lengkap</label>
        <input 
          className="f-input" 
          placeholder="Siapa namamu?" 
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="input-group">
          <label>Kelas</label>
          <input 
            className="f-input" 
            placeholder="Cth: XII IPA 1" 
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Jenis Kelamin</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`nav-link ${gender === 'L' ? 'nav-cta' : ''}`} 
              style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '14px' }} 
              onClick={() => setGender('L')}
            >
              Laki-laki
            </button>
            <button 
              className={`nav-link ${gender === 'P' ? 'nav-cta' : ''}`} 
              style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '14px' }} 
              onClick={() => setGender('P')}
            >
              Perempuan
            </button>
          </div>
        </div>
      </div>
      <div className="input-group">
        <label>Apa yang ingin kamu ceritakan?</label>
        <textarea 
          className="f-input" 
          rows="4" 
          placeholder="Tulis sedikit di sini..."
          value={cerita}
          onChange={(e) => setCerita(e.target.value)}
        ></textarea>
      </div>
      <button 
        className="nav-cta" 
        style={{ width: '100%', padding: '16px', fontSize: '1rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Sedang Mengirim... ⏳" : "Kirim Pengajuan 📤"}
      </button>
    </div>
  )
}