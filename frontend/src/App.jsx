import { useState, useEffect, useRef } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/* ── Scroll reveal hook ─────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ════════════════════════════════════════════════════════════
   ROOT APP
   ════════════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState('home')
  const [heroRef, heroVis] = useReveal()

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(d => console.log('✅ Backend:', d))
      .catch(() => console.warn('⚠️ Backend tidak terhubung'))
  }, [])

  return (
    <div className="shell">
      <div className="orb orb-1" />

      {/* ── Navbar ── */}
      <nav className="nav">
        <div className="nav-brand" onClick={() => setView('home')}>
          <div className="nav-logo">🌿</div>
          <span>SafeSpace</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${view==='home'  ? 'active':''}`} onClick={() => setView('home')}>Beranda</button>
          <button className={`nav-link ${view==='alur'  ? 'active':''}`} onClick={() => setView('alur')}>Alur Kerja</button>
          <button className={`nav-link ${view==='bk'    ? 'active':''}`} onClick={() => setView('bk')}>Dashboard BK</button>
          <button className="nav-cta" onClick={() => setView('ajukan')}>Mulai Konseling →</button>
        </div>
      </nav>

      <main className="view-container">

        {/* ══ VIEW: HOME ══════════════════════════════════════ */}
        {view === 'home' && (
          <div ref={heroRef} className={`reveal ${heroVis ? 'is-visible' : ''}`}>
            <section className="hero-grid">
              <div>
                <div style={{ color:'#2dd4bf', fontWeight:700, fontSize:'.75rem', letterSpacing:'2.5px', marginBottom:'14px' }}>
                  SAFE & PRIVATE COUNSELING
                </div>
                <h1 className="hero-h1">
                  Tempat Aman untuk<br />
                  <span className="gradient-text">Cerita Kamu.</span>
                </h1>
                <p style={{ color:'rgba(220,215,255,.7)', lineHeight:1.8, fontSize:'1.05rem', marginBottom:'32px', maxWidth:'500px' }}>
                  Privasi adalah prioritas kami. Konsultasikan masalahmu secara anonim dan aman
                  dengan guru BK profesional — tanpa perlu membuat akun.
                </p>
                <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
                  <button className="nav-cta" onClick={() => setView('ajukan')} style={{ padding:'12px 28px', fontSize:'.95rem' }}>
                    Ajukan Sekarang
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => setView('alur')}
                  >
                    Lihat Cara Kerja ↓
                  </button>
                </div>
              </div>
              <div style={{ display:'grid', placeItems:'center' }}>
                <div style={{ width:'100%', height:'320px', background:'rgba(124,58,237,.08)', borderRadius:'28px', border:'1px solid rgba(124,58,237,.18)', display:'grid', placeItems:'center' }}>
                  <span style={{ fontSize:'5rem' }}>🍃</span>
                </div>
              </div>
            </section>

            <section style={{ marginTop:'90px' }}>
              <div style={{ textAlign:'center', marginBottom:'8px', color:'#2dd4bf', fontWeight:700, fontSize:'.75rem', letterSpacing:'2px' }}>
                CORE PRINCIPLES
              </div>
              <h2 className="p-title" style={{ textAlign:'center', fontSize:'2rem', marginBottom:0 }}>
                Tiga Fondasi Utama
              </h2>
              <div className="card-grid">
                <PrincipleCard icon="🔐" title="Privat"
                  desc="Hanya kamu dan guru BK yang bisa mengakses percakapan. Admin pun tidak bisa melihatnya." />
                <PrincipleCard icon="🌱" title="Mudah"
                  desc="Tidak perlu buat akun. Cukup isi form dan pantau status menggunakan kode pelacak unik." />
                <PrincipleCard icon="☁️" title="Fleksibel"
                  desc="Atur jadwal dan tempat sesuai kenyamananmu, baik tatap muka maupun daring." />
              </div>
            </section>
          </div>
        )}

        {/* ══ VIEW: ALUR KERJA ════════════════════════════════ */}
        {view === 'alur' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:'48px' }}>
              <span style={{ color:'#7c3aed', fontWeight:700, fontSize:'.75rem', letterSpacing:'2px' }}>STEP BY STEP</span>
              <h1 className="hero-h1" style={{ fontSize:'clamp(2rem,4vw,3.4rem)', marginTop:'10px' }}>
                Bagaimana ini bekerja?
              </h1>
            </div>
            <div className="step-container">
              <StepBox num="01" title="Isi Formulir"
                desc="Pilih guru BK, waktu, dan ceritakan sedikit tentang apa yang kamu hadapi." />
              <StepBox num="02" title="Terima Kode Pelacak"
                desc="Setelah mengirim, simpan kode unik yang muncul untuk cek status di kemudian hari." />
              <StepBox num="03" title="Konfirmasi Guru BK"
                desc="Gurumu akan melihat pengajuanmu dan memberikan jadwal pasti melalui sistem." />
              <StepBox num="04" title="Mulai Konseling"
                desc="Bertemu di tempat yang disepakati dan mulailah perjalanan kesehatan mentalmu." />
            </div>
            <div style={{ textAlign:'center', marginTop:'48px' }}>
              <button className="nav-cta" onClick={() => setView('ajukan')} style={{ padding:'13px 32px', fontSize:'.95rem' }}>
                Siap Untuk Memulai? →
              </button>
            </div>
          </div>
        )}

        {/* ══ VIEW: AJUKAN KONSELING ══════════════════════════ */}
        {view === 'ajukan' && (
          <div className="form-page">
            <div className="form-sidebar">
              <span style={{ color:'#7c3aed', fontWeight:800, fontSize:'.72rem', letterSpacing:'2px' }}>FORM KONSELING</span>
              <h2 className="p-title" style={{ marginTop:'14px' }}>Suaramu berhak didengar.</h2>
              <p className="p-desc">
                Isi form ini dengan jujur agar guru BK bisa membantumu dengan maksimal.
                Data kamu aman bersama kami.
              </p>
              <div style={{ marginTop:'36px', display:'flex', flexDirection:'column', gap:'14px' }}>
                {[['✓','Tanpa Akun'],['✓','Enkripsi Privat'],['✓','Dapat Kode Pelacak']].map(([icon, text]) => (
                  <div key={text} style={{ display:'flex', gap:'10px', alignItems:'center', color:'#2dd4bf', fontSize:'.88rem', fontWeight:500 }}>
                    <span style={{ background:'rgba(45,212,191,.12)', border:'1px solid rgba(45,212,191,.25)', borderRadius:'50%', width:'22px', height:'22px', display:'grid', placeItems:'center', fontSize:'.7rem', flexShrink:0 }}>{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="form-main">
              <ConsultForm />
            </div>
          </div>
        )}

        {/* ══ VIEW: DASHBOARD BK ══════════════════════════════ */}
        {view === 'bk' && <BKDashboard />}

      </main>

      <footer style={{ textAlign:'center', padding:'36px', color:'rgba(220,215,255,.35)', fontSize:'.78rem', borderTop:'1px solid rgba(255,255,255,.05)' }}>
        SafeSpace — Cloud Counseling System ITK © 2026
      </footer>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   KOMPONEN KECIL
   ──────────────────────────────────────────────────────────── */
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
        <h3 className="p-title" style={{ fontSize:'1.2rem', marginBottom:'6px' }}>{title}</h3>
        <p className="p-desc">{desc}</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   CONSULT FORM — terhubung ke backend
   POST /api/consultations
   GET  /api/public/master-data
   GET  /api/public/counselors
   ════════════════════════════════════════════════════════════ */
function ConsultForm() {
  /* ── Fallback data jika API belum siap ── */
  const FALLBACK = {
    school_classes: [{id:1,name:'X-A'},{id:2,name:'X-B'},{id:3,name:'XI IPA 1'},{id:4,name:'XI IPS 1'},{id:5,name:'XII IPA 1'}],
    topics:    [{id:1,name:'Belajar'},{id:2,name:'Karir'},{id:3,name:'Keluarga'},{id:4,name:'Sosial'},{id:5,name:'Pribadi'}],
    time_slots:[{id:1,name:'Istirahat ke-1',start_time:'10:00',end_time:'10:30'},{id:2,name:'Istirahat ke-2',start_time:'12:00',end_time:'12:30'},{id:3,name:'Pulang Sekolah',start_time:'14:00',end_time:'15:30'}],
    places:    [{id:1,name:'Ruang BK 1'},{id:2,name:'Ruang BK 2'},{id:3,name:'Online'}],
    counselors:[{id:1,name:'Bu Anita'},{id:2,name:'Pak Budi'},{id:3,name:'Bu Citra'}],
  }

  const [opts, setOpts]         = useState({ ...FALLBACK })
  const [optsLoading, setOL]    = useState(true)
  const [optsError, setOE]      = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(null)   // { tracking_code }

  const [f, setF] = useState({
    nama:'', phone:'', classId:'', gender:'',
    counselorId:'', method:'INDIVIDUAL',
    topicId:'', date:'', timeSlotId:'', placeId:'',
  })

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  /* Load opsi dari API */
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setOL(true); setOE('')
      try {
        const [mRes, cRes] = await Promise.all([
          fetch(`${API_URL}/api/public/master-data`),
          fetch(`${API_URL}/api/public/counselors`),
        ])
        if (!mRes.ok || !cRes.ok) throw new Error('Gagal memuat opsi')
        const [master, counselors] = await Promise.all([mRes.json(), cRes.json()])
        if (cancelled) return

        const timeSlots = (master.time_slots || []).map(s => ({
          ...s, label: s.start_time ? `${s.name} (${s.start_time}–${s.end_time})` : s.name
        }))

        const o = {
          school_classes: master.school_classes || FALLBACK.school_classes,
          topics:         master.topics         || FALLBACK.topics,
          time_slots:     timeSlots.length ? timeSlots : FALLBACK.time_slots,
          places:         master.places         || FALLBACK.places,
          counselors:     counselors.length  ? counselors : FALLBACK.counselors,
        }
        setOpts(o)
        setF(p => ({
          ...p,
          classId:    String(o.school_classes[0]?.id ?? ''),
          topicId:    String(o.topics[0]?.id ?? ''),
          timeSlotId: String(o.time_slots[0]?.id ?? ''),
          placeId:    String(o.places[0]?.id ?? ''),
          counselorId:String(o.counselors[0]?.id ?? ''),
        }))
      } catch {
        if (!cancelled) {
          setOE('Data dinamis gagal dimuat, menggunakan data bawaan.')
          setF(p => ({
            ...p,
            classId:'1', topicId:'1', timeSlotId:'1', placeId:'1', counselorId:'1',
          }))
        }
      } finally {
        if (!cancelled) setOL(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async () => {
    if (!f.nama || !f.phone || !f.gender || !f.date || !f.classId || !f.counselorId || !f.topicId || !f.timeSlotId || !f.placeId) {
      alert('Harap isi semua kolom wajib!')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: f.nama.trim(),
          class_id:     parseInt(f.classId),
          gender:       f.gender,
          student_phone: f.phone.trim(),
          counselor_id:  parseInt(f.counselorId),
          method:        f.method,
          topic_id:      parseInt(f.topicId),
          date:          f.date,
          time_slot_id:  parseInt(f.timeSlotId),
          place_id:      parseInt(f.placeId),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = typeof data.detail === 'string' ? data.detail
          : Array.isArray(data.detail) ? data.detail.map(e => e.message || e.msg).join(', ')
          : 'Pengajuan gagal'
        alert(`Gagal:\n${msg}`)
        return
      }
      setDone(data)
    } catch {
      alert('Tidak dapat terhubung ke server. Pastikan backend menyala!')
    } finally {
      setLoading(false)
    }
  }

  /* ── Done state ── */
  if (done) return (
    <div className="register-success">
      <div className="success-ring">🎉</div>
      <div className="success-title">Pengajuan Terkirim!</div>
      <p className="success-sub">Simpan kode berikut untuk memantau status konseling kamu.</p>
      <div className="success-code-box">
        <span className="success-code-label">Kode Pelacak</span>
        <span className="success-code-value">{done.tracking_code}</span>
      </div>
      <button
        className="btn-ghost"
        onClick={() => { setDone(null); setF(p => ({ ...p, nama:'', phone:'', gender:'', date:'' })) }}
        style={{ marginTop:'8px' }}
      >
        Ajukan Lagi
      </button>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Peringatan fallback */}
      {optsError && (
        <div className="alert alert-warn">
          <span className="alert-icon">⚠️</span>
          {optsError}
        </div>
      )}

      {/* Nama */}
      <div className="input-group">
        <label>Nama Lengkap <Required /></label>
        <input className="f-input" placeholder="Siapa namamu?" value={f.nama} onChange={e => set('nama', e.target.value)} />
      </div>

      <div className="form-row">
        {/* No WA */}
        <div className="input-group">
          <label>Nomor WhatsApp <Required /></label>
          <input className="f-input" type="tel" placeholder="+6281234567890" value={f.phone} onChange={e => set('phone', e.target.value)} />
          <span className="field-hint">Format +62 wajib digunakan</span>
        </div>

        {/* Jenis Kelamin */}
        <div className="input-group">
          <label>Jenis Kelamin <Required /></label>
          <div style={{ display:'flex', gap:'8px' }}>
            {[['MALE','♂ Laki-laki'],['FEMALE','♀ Perempuan']].map(([val, label]) => (
              <button
                key={val} type="button"
                onClick={() => set('gender', val)}
                style={{
                  flex:1, padding:'12px 8px', borderRadius:'11px',
                  fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:'.85rem', fontWeight:600,
                  cursor:'pointer', transition:'all .2s',
                  background: f.gender === val ? 'rgba(124,58,237,.22)' : 'rgba(255,255,255,.05)',
                  border: `1px solid ${f.gender === val ? 'rgba(124,58,237,.45)' : 'rgba(255,255,255,.1)'}`,
                  color: f.gender === val ? '#c4b5fd' : 'rgba(220,215,255,.65)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-row">
        {/* Kelas */}
        <div className="input-group">
          <label>Kelas <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.classId} onChange={e => set('classId', e.target.value)} disabled={optsLoading}>
              {opts.school_classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Guru BK */}
        <div className="input-group">
          <label>Guru BK <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.counselorId} onChange={e => set('counselorId', e.target.value)} disabled={optsLoading}>
              {opts.counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="form-row">
        {/* Metode */}
        <div className="input-group">
          <label>Metode Konseling <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.method} onChange={e => set('method', e.target.value)}>
              <option value="INDIVIDUAL">Individual (1-1)</option>
              <option value="GROUP">Kelompok</option>
            </select>
          </div>
        </div>

        {/* Topik */}
        <div className="input-group">
          <label>Topik Masalah <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.topicId} onChange={e => set('topicId', e.target.value)} disabled={optsLoading}>
              {opts.topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tanggal */}
      <div className="input-group">
        <label>Tanggal Konseling <Required /></label>
        {/* ↓ color-scheme:dark sudah ada di CSS, tapi tambahkan min agar tidak bisa pilih masa lalu */}
        <input
          type="date" className="f-input"
          value={f.date}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => set('date', e.target.value)}
        />
      </div>

      <div className="form-row">
        {/* Waktu */}
        <div className="input-group">
          <label>Waktu <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.timeSlotId} onChange={e => set('timeSlotId', e.target.value)} disabled={optsLoading}>
              {opts.time_slots.map(t => <option key={t.id} value={t.id}>{t.label || t.name}</option>)}
            </select>
          </div>
        </div>

        {/* Tempat */}
        <div className="input-group">
          <label>Tempat <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.placeId} onChange={e => set('placeId', e.target.value)} disabled={optsLoading}>
              {opts.places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        className="btn-form-submit"
        onClick={handleSubmit}
        disabled={loading || optsLoading}
      >
        {(loading || optsLoading) && <span className="btn-spinner" />}
        {optsLoading ? 'Memuat data form...' : loading ? 'Mengirim...' : '📤 Kirim Pengajuan'}
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   BKDASHBOARD — Login + Register tabs + Dashboard
   ════════════════════════════════════════════════════════════ */
function BKDashboard() {
  const [authTab, setAuthTab]   = useState('login')
  const [email, setEmail]       = useState('anita.bk@safespace.sch.id')
  const [password, setPassword] = useState('Counselor123')
  const [token, setTokenValue]  = useState(sessionStorage.getItem('bkToken') || '')
  const [loginErr, setLoginErr] = useState('')
  const [loadingLogin, setLL]   = useState(false)
  const [loadingData, setLD]    = useState(false)
  const [stats, setStats]       = useState(null)
  const [consultations, setC]   = useState([])
  const [actionErr, setAE]      = useState('')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchDashboard = async (bt = token) => {
    const h = bt ? { Authorization: `Bearer ${bt}` } : {}
    setLD(true); setAE('')
    try {
      const [sRes, cRes] = await Promise.all([
        fetch(`${API_URL}/api/bk/dashboard/stats`, { headers: h }),
        fetch(`${API_URL}/api/bk/consultations?limit=50&offset=0`, { headers: h }),
      ])
      if (!sRes.ok) { const e = await sRes.json().catch(()=>({})); throw new Error(e.detail || 'Gagal memuat stats') }
      if (!cRes.ok) { const e = await cRes.json().catch(()=>({})); throw new Error(e.detail || 'Gagal memuat konsultasi') }
      const sd = await sRes.json(); const cd = await cRes.json()
      setStats(sd); setC(cd.data || [])
    } catch (e) { setAE(e.message) } finally { setLD(false) }
  }

  useEffect(() => { if (token) fetchDashboard(token) }, [token])

  const handleLogin = async (e) => {
    e.preventDefault(); setLoginErr(''); setLL(true)
    try {
      const res  = await fetch(`${API_URL}/auth/counselor/login`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login gagal')
      setTokenValue(data.access_token)
      sessionStorage.setItem('bkToken', data.access_token)
      setStats(null); setC([])
      await fetchDashboard(data.access_token)
    } catch (e) { setLoginErr(e.message) } finally { setLL(false) }
  }

  const handleLogout = () => {
    setTokenValue(''); sessionStorage.removeItem('bkToken')
    setStats(null); setC([]); setLoginErr(''); setAE('')
  }

  const updateStatus = async (id, action) => {
    setAE('')
    try {
      const res  = await fetch(`${API_URL}/api/bk/consultations/${id}/${action}`, {
        method:'PATCH', headers,
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data.detail || `Gagal ${action}`)
      await fetchDashboard()
    } catch (e) { setAE(e.message) }
  }

  return (
    <div className="form-page" style={{ alignItems:'stretch' }}>

      {/* Sidebar */}
      <div className="form-sidebar">
        <span style={{ color:'#7c3aed', fontWeight:800, fontSize:'.72rem', letterSpacing:'2px' }}>DASHBOARD BK</span>
        <h2 className="p-title" style={{ marginTop:'14px' }}>Kelola konsultasi dengan aman.</h2>
        <p className="p-desc">
          Login atau daftar sebagai guru BK untuk mengakses dan mengelola
          pengajuan konseling siswa secara real-time.
        </p>
        <div style={{ marginTop:'28px', display:'flex', flexDirection:'column', gap:'13px' }}>
          {[['✓','Protected JWT endpoint'],['✓','Data isolated per counselor'],['✓','Accept / Reject live action']].map(([i, t]) => (
            <div key={t} style={{ display:'flex', gap:'10px', alignItems:'center', color:'#2dd4bf', fontSize:'.87rem', fontWeight:500 }}>
              <span style={{ background:'rgba(45,212,191,.1)', border:'1px solid rgba(45,212,191,.22)', borderRadius:'50%', width:'20px', height:'20px', display:'grid', placeItems:'center', fontSize:'.68rem', flexShrink:0 }}>{i}</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Konten utama */}
      <div className="form-main" style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

        {!token ? (
          /* ── Belum login ── */
          <div style={{ background:'rgba(10,14,26,.65)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'18px', padding:'28px' }}>

            {/* Tab bar */}
            <div className="auth-tab-bar">
              <button className={`auth-tab ${authTab==='login'    ? 'active' : ''}`} onClick={() => { setAuthTab('login');    setLoginErr('') }}>
                🔐 Login
              </button>
              <button className={`auth-tab ${authTab==='register' ? 'active' : ''}`} onClick={() => { setAuthTab('register'); setLoginErr('') }}>
                ✍️ Daftar Akun
              </button>
            </div>

            {authTab === 'login' && (
              <BKLoginForm
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                error={loginErr} loading={loadingLogin}
                onSubmit={handleLogin}
                onSwitchToRegister={() => setAuthTab('register')}
              />
            )}
            {authTab === 'register' && (
              <BKRegisterForm
                onSuccess={() => setAuthTab('login')}
                onSwitchToLogin={() => setAuthTab('login')}
              />
            )}
          </div>
        ) : (
          /* ── Sudah login ── */
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
              <div>
                <div className="form-section-title">Dashboard Aktif</div>
                <div className="form-section-sub" style={{ margin:0 }}>Token aktif tersimpan di session browser.</div>
              </div>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </div>

            {actionErr && <div className="alert alert-error"><span className="alert-icon">⚠️</span>{actionErr}</div>}

            {/* Stats */}
            <div className="stat-card-grid">
              <StatCard label="Total"    value={stats?.total    ?? 0} />
              <StatCard label="Pending"  value={stats?.pending  ?? 0} valueColor="#f59e0b" />
              <StatCard label="Accepted" value={stats?.accepted ?? 0} valueColor="#10b981" />
              <StatCard label="Rejected" value={stats?.rejected ?? 0} valueColor="#ef4444" />
            </div>

            {/* Daftar konsultasi */}
            <div style={{ background:'rgba(10,14,26,.55)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'18px', padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', gap:'12px' }}>
                <div className="form-section-title" style={{ margin:0 }}>Daftar Konsultasi</div>
                <button className="nav-cta" style={{ padding:'8px 18px', fontSize:'.82rem' }} onClick={() => fetchDashboard()} disabled={loadingData}>
                  {loadingData ? '⏳ Memuat...' : '↻ Refresh'}
                </button>
              </div>

              {loadingData ? (
                <p style={{ color:'rgba(220,215,255,.5)', textAlign:'center', padding:'28px' }}>Memuat data...</p>
              ) : consultations.length === 0 ? (
                <p style={{ color:'rgba(220,215,255,.4)', textAlign:'center', padding:'28px' }}>Belum ada konsultasi untuk akun ini.</p>
              ) : (
                <div style={{ display:'grid', gap:'10px' }}>
                  {consultations.map(item => (
                    <div key={item.id} className="consult-item">
                      <div className="consult-item-header">
                        <div>
                          <div className="consult-item-name">{item.student_name}</div>
                          <div className="consult-item-meta">{item.class} · {item.topic} · {item.method}</div>
                          <div className="consult-item-code">{item.tracking_code} · {item.date}</div>
                        </div>
                        <span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span>
                      </div>
                      {item.status === 'PENDING' && (
                        <div className="consult-item-actions">
                          <button className="btn-accept" onClick={() => updateStatus(item.id, 'accept')}>✓ Terima</button>
                          <button className="btn-reject" onClick={() => updateStatus(item.id, 'reject')}>✕ Tolak</button>
                        </div>
                      )}
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

/* ════════════════════════════════════════════════════════════
   BKLOGINFORM
   ════════════════════════════════════════════════════════════ */
function BKLoginForm({ email, setEmail, password, setPassword, error, loading, onSubmit, onSwitchToRegister }) {
  return (
    <div>
      <div className="form-section-title">Masuk ke Dashboard</div>
      <p className="form-section-sub">
        Belum punya akun?{' '}
        <button className="link-btn" onClick={onSwitchToRegister}>Daftar di sini →</button>
      </p>

      {error && <div className="alert alert-error" style={{ marginBottom:'16px' }}><span className="alert-icon">⚠️</span>{error}</div>}

      <form onSubmit={onSubmit} style={{ display:'grid', gap:'15px' }}>
        <div className="input-group">
          <label>Email</label>
          <input className="f-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="email@sekolah.sch.id" required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input className="f-input" type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password Anda" required />
        </div>
        <button className="btn-form-submit" type="submit" disabled={loading}>
          {loading && <span className="btn-spinner" />}
          {loading ? 'Memproses...' : '🔐 Masuk Dashboard BK'}
        </button>
      </form>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   BKREGISTERFORM — POST /auth/counselors/register
   ════════════════════════════════════════════════════════════ */
function BKRegisterForm({ onSuccess, onSwitchToLogin }) {
  const [f, setF]                   = useState({ name:'', email:'', password:'', phone:'', specialization:'' })
  const [showPw, setShowPw]         = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [fieldErrors, setFE]        = useState({})
  const [successData, setSuccess]   = useState(null)

  const set = (k, v) => { setF(p => ({ ...p, [k]: v })); setFE(p => ({ ...p, [k]: '' })); setError('') }

  /* Client-side validation (echo validasi Pydantic) */
  const validate = () => {
    const e = {}
    if (!f.name.trim() || f.name.trim().length < 2) e.name = 'Nama minimal 2 karakter'
    if (!f.email.trim()) e.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Format email tidak valid'
    if (!f.password) e.password = 'Password wajib diisi'
    else if (f.password.length < 8) e.password = 'Minimal 8 karakter'
    else if (!/[A-Za-z]/.test(f.password)) e.password = 'Harus mengandung huruf'
    else if (!/\d/.test(f.password)) e.password = 'Harus mengandung angka'
    if (f.phone && !/^\+62\d{8,13}$/.test(f.phone.trim())) e.phone = 'Format: +62xxxxxxxxxx'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(null)
    const errs = validate()
    if (Object.keys(errs).length) { setFE(errs); return }
    setLoading(true)
    try {
      const payload = {
        name:  f.name.trim(),
        email: f.email.trim(),
        password: f.password,
        ...(f.phone.trim()          ? { phone: f.phone.trim() }          : {}),
        ...(f.specialization.trim() ? { specialization: f.specialization.trim() } : {}),
      }
      const res  = await fetch(`${API_URL}/auth/counselors/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        if (typeof data.detail === 'string') { setError(data.detail); return }
        if (Array.isArray(data.detail)) {
          const m = {}
          data.detail.forEach(e => { const k = e.loc?.[e.loc.length-1]; if(k) m[k] = e.msg.replace('Value error, ','') })
          setFE(m); return
        }
        setError('Registrasi gagal. Coba lagi.'); return
      }
      setSuccess(data)
      setTimeout(() => onSuccess(), 2400)
    } catch { setError('Tidak dapat terhubung ke server.') } finally { setLoading(false) }
  }

  /* Kekuatan password */
  const pwStr = (() => {
    const p = f.password
    if (!p) return null
    if (p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p))
      return { w:'100%', color:'#10b981', label:'Kuat ✓' }
    if (p.length >= 5)
      return { w:'55%',  color:'#f59e0b', label:'Cukup' }
    return { w:'22%', color:'#ef4444', label:'Lemah' }
  })()

  /* ── Success state ── */
  if (successData) return (
    <div className="register-success">
      <div className="success-ring">🎉</div>
      <div className="success-title">Akun Berhasil Dibuat!</div>
      <p className="success-sub">Selamat datang, <strong>{successData.name}</strong>! Kamu akan diarahkan ke halaman login.</p>
      <div style={{ width:'100%', height:'3px', background:'rgba(255,255,255,.07)', borderRadius:'2px', overflow:'hidden', maxWidth:'200px' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#7c3aed,#2dd4bf)', animation:'fill-bar 2.4s linear forwards' }} />
      </div>
      <style>{`@keyframes fill-bar{from{width:0}to{width:100%}}`}</style>
    </div>
  )

  return (
    <div>
      <div className="form-section-title">Daftar Akun Guru BK</div>
      <p className="form-section-sub">
        Sudah punya akun?{' '}
        <button className="link-btn" onClick={onSwitchToLogin}>Login di sini →</button>
      </p>

      {error && <div className="alert alert-error" style={{ marginBottom:'16px' }}><span className="alert-icon">⚠️</span>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display:'grid', gap:'16px' }}>

        {/* Nama */}
        <div className="input-group">
          <label>Nama Lengkap <Required /></label>
          <input className={`f-input ${fieldErrors.name ? 'is-error' : ''}`}
            type="text" placeholder="Nama lengkap Anda"
            value={f.name} onChange={e => set('name', e.target.value)} />
          {fieldErrors.name && <span className="field-error">⚠ {fieldErrors.name}</span>}
        </div>

        {/* Email */}
        <div className="input-group">
          <label>Email <Required /></label>
          <input className={`f-input ${fieldErrors.email ? 'is-error' : ''}`}
            type="email" placeholder="email@sekolah.sch.id"
            value={f.email} onChange={e => set('email', e.target.value)} />
          {fieldErrors.email && <span className="field-error">⚠ {fieldErrors.email}</span>}
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password <Required /></label>
          <div style={{ position:'relative' }}>
            <input
              className={`f-input ${fieldErrors.password ? 'is-error' : ''}`}
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 karakter, ada huruf + angka"
              value={f.password} onChange={e => set('password', e.target.value)}
              style={{ paddingRight:'44px' }}
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              style={{ position:'absolute', right:'13px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(180,175,220,.5)', display:'flex', alignItems:'center', padding:'4px', transition:'color .2s' }}>
              {showPw
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
          {/* Strength bar */}
          {f.password && (
            <div className="pw-strength-wrap">
              <div className="pw-strength-track">
                <div className="pw-strength-fill" style={{ width: pwStr?.w, background: pwStr?.color }} />
              </div>
              <span className="pw-strength-label" style={{ color: pwStr?.color }}>{pwStr?.label}</span>
            </div>
          )}
          {fieldErrors.password && <span className="field-error">⚠ {fieldErrors.password}</span>}
        </div>

        {/* Phone */}
        <div className="input-group">
          <label>Nomor WhatsApp <Opt /></label>
          <input className={`f-input ${fieldErrors.phone ? 'is-error' : ''}`}
            type="tel" placeholder="+628xxxxxxxxxx"
            value={f.phone} onChange={e => set('phone', e.target.value)} />
          {fieldErrors.phone
            ? <span className="field-error">⚠ {fieldErrors.phone}</span>
            : <span className="field-hint">Contoh: +6281234567890 (format +62 wajib)</span>}
        </div>

        {/* Spesialisasi */}
        <div className="input-group">
          <label>Bidang Spesialisasi <Opt /></label>
          <input className="f-input"
            type="text" placeholder="Contoh: Konseling Remaja, Karir, Keluarga"
            value={f.specialization} onChange={e => set('specialization', e.target.value)}
            maxLength={120} />
          <span className={`char-counter ${f.specialization.length > 100 ? 'near-limit' : ''}`}>
            {f.specialization.length}/120
          </span>
        </div>

        <button className="btn-form-submit" type="submit" disabled={loading}>
          {loading && <span className="btn-spinner" />}
          {loading ? 'Mendaftarkan...' : '✍️ Daftar Akun Guru BK'}
        </button>
      </form>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   STAT CARD
   ════════════════════════════════════════════════════════════ */
function StatCard({ label, value, valueColor }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={valueColor ? { color:valueColor } : {}}>
        {value}
      </div>
    </div>
  )
}

/* ── Helper kecil ────────────────────────────────────────────── */
function Required() {
  return <span style={{ color:'#a78bfa', marginLeft:'2px' }}>*</span>
}
function Opt() {
  return <span style={{ color:'rgba(180,175,220,.4)', fontWeight:400, marginLeft:'4px' }}>(opsional)</span>
}