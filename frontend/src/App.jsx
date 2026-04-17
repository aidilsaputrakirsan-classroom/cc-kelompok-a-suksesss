import { useState, useEffect, useRef } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
  const [view, setView] = useState('home') // 'home', 'alur', 'ajukan', 'bk'
  const [heroRef, heroVis] = useReveal()

  // ── FITUR CEK KONEKSI (Mengecek ke endpoint /health backendmu) ──
  useEffect(() => {
    fetch(`${API_URL}/health`)
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
          <button className={`nav-link ${view === 'bk' ? 'active' : ''}`} onClick={() => setView('bk')}>Dashboard BK</button>
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

        {/* ── VIEW: DASHBOARD BK ── */}
        {view === 'bk' && <BKDashboard />}

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
  // Fallback untuk development jika endpoint master data belum siap.
  const fallbackClassOptions = [
    { id: 1, name: 'X-A' },
    { id: 2, name: 'X-B' },
    { id: 3, name: 'XI IPA 1' },
    { id: 4, name: 'XI IPS 1' },
    { id: 5, name: 'XII IPA 1' },
    { id: 6, name: 'XII IPS 1' },
  ]
  const fallbackCounselorOptions = [
    { id: 1, name: 'Bu Anita' },
    { id: 2, name: 'Pak Budi' },
    { id: 3, name: 'Bu Citra' },
  ]
  const fallbackTopicOptions = [
    { id: 1, name: 'Belajar' },
    { id: 2, name: 'Karir' },
    { id: 3, name: 'Keluarga' },
    { id: 4, name: 'Sosial' },
    { id: 5, name: 'Pribadi' },
  ]
  const fallbackTimeSlotOptions = [
    { id: 1, name: 'Istirahat ke-1', start_time: '10:00', end_time: '10:30' },
    { id: 2, name: 'Istirahat ke-2', start_time: '12:00', end_time: '12:30' },
    { id: 3, name: 'Pulang Sekolah', start_time: '14:00', end_time: '15:30' },
  ]
  const fallbackPlaceOptions = [
    { id: 1, name: 'Ruang BK 1' },
    { id: 2, name: 'Ruang BK 2' },
    { id: 3, name: 'Online' },
  ]

  // ── Penampung Data Input ──
  const [classOptions, setClassOptions] = useState([])
  const [counselorOptions, setCounselorOptions] = useState([])
  const [topicOptions, setTopicOptions] = useState([])
  const [timeSlotOptions, setTimeSlotOptions] = useState([])
  const [placeOptions, setPlaceOptions] = useState([])

  const [nama, setNama] = useState('')
  const [phone, setPhone] = useState('')
  const [classId, setClassId] = useState('')
  const [gender, setGender] = useState('')
  const [counselorId, setCounselorId] = useState('')
  const [method, setMethod] = useState('INDIVIDUAL')
  const [topicId, setTopicId] = useState('')
  const [date, setDate] = useState('')
  const [timeSlotId, setTimeSlotId] = useState('')
  const [placeId, setPlaceId] = useState('')
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const setOptions = ({ school_classes, topics, time_slots, places, counselors }) => {
      if (cancelled) return

      const normalizedTimeSlots = (time_slots || []).map((item) => ({
        ...item,
        label: item.start_time && item.end_time
          ? `${item.name} (${item.start_time} - ${item.end_time})`
          : item.name,
      }))

      setClassOptions(school_classes || [])
      setTopicOptions(topics || [])
      setTimeSlotOptions(normalizedTimeSlots)
      setPlaceOptions(places || [])
      setCounselorOptions(counselors || [])

      setClassId((school_classes && school_classes[0]) ? String(school_classes[0].id) : '')
      setTopicId((topics && topics[0]) ? String(topics[0].id) : '')
      setTimeSlotId((normalizedTimeSlots && normalizedTimeSlots[0]) ? String(normalizedTimeSlots[0].id) : '')
      setPlaceId((places && places[0]) ? String(places[0].id) : '')
      setCounselorId((counselors && counselors[0]) ? String(counselors[0].id) : '')
    }

    const loadOptions = async () => {
      setOptionsLoading(true)
      setOptionsError('')

      try {
        const [masterResponse, counselorResponse] = await Promise.all([
          fetch(`${API_URL}/api/public/master-data`),
          fetch(`${API_URL}/api/public/counselors`),
        ])

        const [masterData, counselors] = await Promise.all([
          masterResponse.json(),
          counselorResponse.json(),
        ])

        if (!masterResponse.ok) {
          throw new Error(`Gagal memuat master data (${masterResponse.status})`)
        }
        if (!counselorResponse.ok) {
          throw new Error(`Gagal memuat data guru BK (${counselorResponse.status})`)
        }

        setOptions({
          school_classes: masterData.school_classes,
          topics: masterData.topics,
          time_slots: masterData.time_slots,
          places: masterData.places,
          counselors,
        })
      } catch (err) {
        console.error('Gagal mengambil dropdown dinamis:', err)
        if (!cancelled) {
          setOptionsError('Data dinamis gagal dimuat, menggunakan data fallback.')
        }
        setOptions({
          school_classes: fallbackClassOptions,
          topics: fallbackTopicOptions,
          time_slots: fallbackTimeSlotOptions,
          places: fallbackPlaceOptions,
          counselors: fallbackCounselorOptions,
        })
      } finally {
        if (!cancelled) {
          setOptionsLoading(false)
        }
      }
    }

    loadOptions()

    return () => {
      cancelled = true
    }
  }, [])

  const formatErrorDetail = (detail) => {
    if (!detail) return 'Terjadi kesalahan pada data'
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === 'string') return item
          if (item && typeof item === 'object') {
            const field = item.field ? `${item.field}: ` : ''
            return `${field}${item.message || 'Input tidak valid'}`
          }
          return 'Input tidak valid'
        })
        .join('\n')
    }
    return 'Terjadi kesalahan pada data'
  }

  // ── Fungsi Kirim Data ke Backend (FastAPI) ──
  const handleSubmit = async () => {
    if (!nama || !phone || !gender || !date || !classId || !counselorId || !topicId || !timeSlotId || !placeId) {
      alert('Harap isi semua kolom wajib!')
      return
    }

    setLoading(true)

    const payload = {
      student_name: nama.trim(),
      class_id: parseInt(classId, 10),
      gender,
      student_phone: phone.trim(),
      counselor_id: parseInt(counselorId, 10),
      method,
      topic_id: parseInt(topicId, 10),
      date,
      time_slot_id: parseInt(timeSlotId, 10),
      place_id: parseInt(placeId, 10),
    }

    try {
      const response = await fetch(`${API_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        const trackCode = data.tracking_code || data.id || 'Sukses'
        alert(`Pengajuan berhasil dikirim!\nSimpan kode pelacak Anda: ${trackCode}`)

        setNama('')
        setPhone('')
        setGender('')
        setDate('')
      } else {
        console.error('Error dari backend:', data)
        alert(`Gagal mengirim:\n${formatErrorDetail(data.detail)}`)
      }
    } catch (error) {
      console.error('Error jaringan:', error)
      alert('Gagal menyambung ke server. Pastikan backend sudah menyala!')
    } finally {
      setLoading(false)
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
      {optionsError && (
        <div style={{ color: '#fbbf24', fontSize: '0.85rem' }}>
          {optionsError}
        </div>
      )}
      <div className="form-row">
        <div className="input-group">
          <label>Nomor WhatsApp (+62...)</label>
          <input
            className="f-input"
            placeholder="Contoh: +6281234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Jenis Kelamin</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`nav-link ${gender === 'MALE' ? 'nav-cta' : ''}`}
              style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '14px' }}
              onClick={() => setGender('MALE')}
            >
              Laki-laki
            </button>
            <button
              type="button"
              className={`nav-link ${gender === 'FEMALE' ? 'nav-cta' : ''}`}
              style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '14px' }}
              onClick={() => setGender('FEMALE')}
            >
              Perempuan
            </button>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Kelas</label>
          <select className="f-input" value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Guru BK</label>
          <select className="f-input" value={counselorId} onChange={(e) => setCounselorId(e.target.value)}>
            {counselorOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Metode Konseling</label>
          <select className="f-input" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="INDIVIDUAL">Individual</option>
            <option value="GROUP">Group</option>
          </select>
        </div>
        <div className="input-group">
          <label>Topik</label>
          <select className="f-input" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            {topicOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="input-group">
        <label>Tanggal Konseling</label>
        <input
          type="date"
          className="f-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="input-group">
          <label>Jam</label>
          <select className="f-input" value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value)}>
            {timeSlotOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Tempat</label>
          <select className="f-input" value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
            {placeOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="nav-cta"
        style={{ width: '100%', padding: '16px', fontSize: '1rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        onClick={handleSubmit}
        disabled={loading || optionsLoading}
      >
        {optionsLoading ? 'Memuat Data Form... ⏳' : loading ? 'Sedang Mengirim... ⏳' : 'Kirim Pengajuan 📤'}
      </button>
    </div>
  )
}

function BKDashboard() {
  const [email, setEmail] = useState('anita.bk@safespace.sch.id')
  const [password, setPassword] = useState('Counselor123')
  const [token, setTokenValue] = useState(sessionStorage.getItem('bkToken') || '')
  const [loginError, setLoginError] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [stats, setStats] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [actionError, setActionError] = useState('')

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchDashboard = async (bearerToken = token) => {
    const headers = bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}
    setLoadingData(true)
    setActionError('')
    try {
      const [statsResponse, consultationsResponse] = await Promise.all([
        fetch(`${API_URL}/api/bk/dashboard/stats`, { headers }),
        fetch(`${API_URL}/api/bk/consultations?limit=50&offset=0`, { headers }),
      ])

      if (!statsResponse.ok) {
        const error = await statsResponse.json().catch(() => ({}))
        throw new Error(error.detail || `Gagal memuat stats (${statsResponse.status})`)
      }
      if (!consultationsResponse.ok) {
        const error = await consultationsResponse.json().catch(() => ({}))
        throw new Error(error.detail || `Gagal memuat konsultasi (${consultationsResponse.status})`)
      }

      const statsData = await statsResponse.json()
      const consultationsData = await consultationsResponse.json()
      setStats(statsData)
      setConsultations(consultationsData.data || [])
    } catch (error) {
      setActionError(error.message)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchDashboard(token)
    }
  }, [token])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoadingLogin(true)
    try {
      const response = await fetch(`${API_URL}/auth/counselor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login gagal')
      }

      setTokenValue(data.access_token)
      sessionStorage.setItem('bkToken', data.access_token)
      setStats(null)
      setConsultations([])
      await fetchDashboard(data.access_token)
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleLogout = () => {
    setTokenValue('')
    sessionStorage.removeItem('bkToken')
    setStats(null)
    setConsultations([])
    setLoginError('')
    setActionError('')
  }

  const updateStatus = async (id, action) => {
    setActionError('')
    try {
      const response = await fetch(`${API_URL}/api/bk/consultations/${id}/${action}`, {
        method: 'PATCH',
        headers: authHeaders,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || `Gagal ${action}`)
      }
      await fetchDashboard()
    } catch (error) {
      setActionError(error.message)
    }
  }

  return (
    <div className="form-page" style={{ alignItems: 'stretch' }}>
      <div className="form-sidebar">
        <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '0.75rem' }}>DASHBOARD BK</span>
        <h2 className="p-title" style={{ marginTop: '15px' }}>Kelola konsultasi dengan aman.</h2>
        <p className="p-desc">Login sebagai guru BK untuk melihat data milikmu sendiri, lalu terima atau tolak pengajuan secara langsung.</p>
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ color: '#2dd4bf', fontSize: '0.9rem' }}>✓ Protected JWT endpoint</div>
          <div style={{ color: '#2dd4bf', fontSize: '0.9rem' }}>✓ Data isolated per counselor</div>
          <div style={{ color: '#2dd4bf', fontSize: '0.9rem' }}>✓ Accept / Reject live action</div>
        </div>
      </div>

      <div className="form-main" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {!token ? (
          <div style={{ background: 'rgba(10,14,26,0.65)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
            <h2 className="p-title" style={{ marginBottom: '14px' }}>Login Guru BK</h2>
            {loginError && <div style={{ color: '#fca5a5', marginBottom: '12px' }}>⚠ {loginError}</div>}
            <form onSubmit={handleLogin} style={{ display: 'grid', gap: '14px' }}>
              <div className="input-group">
                <label>Email</label>
                <input className="f-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input className="f-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button className="nav-cta" type="submit" disabled={loadingLogin}>
                {loadingLogin ? 'Memproses...' : 'Masuk Dashboard BK'}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
              <div>
                <h2 className="p-title" style={{ marginBottom: '6px' }}>Dashboard Aktif</h2>
                <p className="p-desc" style={{ margin: 0 }}>Token aktif tersimpan di session browser.</p>
              </div>
              <button className="nav-link" onClick={handleLogout} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '12px' }}>
                Logout
              </button>
            </div>

            {actionError && <div style={{ color: '#fca5a5' }}>⚠ {actionError}</div>}

            <div className="card-grid" style={{ marginTop: 0 }}>
              <StatCard label="Total" value={stats?.total ?? 0} />
              <StatCard label="Pending" value={stats?.pending ?? 0} />
              <StatCard label="Accepted" value={stats?.accepted ?? 0} />
              <StatCard label="Rejected" value={stats?.rejected ?? 0} />
            </div>

            <div style={{ background: 'rgba(10,14,26,0.65)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="p-title" style={{ margin: 0 }}>Daftar Konsultasi</h2>
                <button className="nav-cta" type="button" onClick={() => fetchDashboard()} disabled={loadingData}>
                  {loadingData ? 'Memuat...' : 'Refresh'}
                </button>
              </div>

              {loadingData ? (
                <p className="p-desc">Memuat data...</p>
              ) : consultations.length === 0 ? (
                <p className="p-desc">Belum ada konsultasi untuk akun ini.</p>
              ) : (
                <div style={{ display: 'grid', gap: '14px' }}>
                  {consultations.map((item) => (
                    <div key={item.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#f0eeff' }}>{item.student_name}</div>
                          <div style={{ color: 'rgba(220,215,255,0.65)', fontSize: '0.9rem' }}>{item.class} · {item.topic} · {item.method}</div>
                          <div style={{ color: 'rgba(220,215,255,0.55)', fontSize: '0.85rem', marginTop: '4px' }}>{item.tracking_code} · {item.date}</div>
                        </div>
                        <div style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.78rem', color: item.status === 'ACCEPTED' ? '#10b981' : item.status === 'REJECTED' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>
                          {item.status}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                        {item.status === 'PENDING' && (
                          <>
                            <button className="nav-cta" type="button" onClick={() => updateStatus(item.id, 'accept')}>Terima</button>
                            <button className="nav-link" type="button" onClick={() => updateStatus(item.id, 'reject')} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '12px' }}>Tolak</button>
                          </>
                        )}
                        {item.status !== 'PENDING' && (
                          <button className="nav-link" type="button" onClick={() => fetchDashboard()} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '12px' }}>Reload Status</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="p-card" style={{ marginTop: 0 }}>
      <div style={{ color: 'rgba(220,215,255,0.6)', fontSize: '0.8rem', letterSpacing: '1.2px', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f0eeff', marginTop: '6px' }}>{value}</div>
    </div>
  )
}