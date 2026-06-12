// frontend/src/App.jsx
import { useState, useEffect, useCallback } from 'react'
import './App.css'
import DarkModeToggle from './components/DarkModeToggle'
import AboutPage from './components/AboutPage'
import ServiceBanner from './components/ServiceBanner'
import { useServiceHealth } from './hooks/useServiceHealth'
import StatusPage from './pages/StatusPage'
import Header from './components/Header'
import LoginPage from './components/LoginPage'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'
import SearchBar from './components/SearchBar'
import SortBar from './components/SortBar'
import Spinner from './components/Spinner'
import Toast from './components/Toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ---------- safeFetch (sama seperti asli) ----------
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options)
    if (response.status === 503) {
      const error = new Error('Service temporarily unavailable')
      error.type = 'service-down'
      throw error
    }
    if (response.status === 401) {
      sessionStorage.removeItem('bkToken')
      const error = new Error('Session expired')
      error.type = 'auth-error'
      throw error
    }
    return response
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Cannot connect to backend server')
      networkError.type = 'network-error'
      throw networkError
    }
    throw error
  }
}

// ---------- Root App ----------
export default function App() {
  const [view, setView] = useState('home')
  const [showAbout, setShowAbout] = useState(false)
  const { healthStatus, checkHealth } = useServiceHealth(API_URL)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }])
  }
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    safeFetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(d => console.log('✅ Backend:', d))
      .catch(() => console.warn('⚠️ Backend tidak terhubung'))
  }, [])

  if (showAbout) {
    return <AboutPage onBack={() => setShowAbout(false)} />
  }

  return (
    <div className="shell">
      <div className="orb orb-1" />
      {healthStatus.network === 'down' && (
        <ServiceBanner type="network" onRetry={checkHealth} />
      )}

      <Header view={view} setView={setView} showAbout={showAbout} setShowAbout={setShowAbout} />

      <main className="view-container">
        {view === 'home' && <HomeView setView={setView} />}
        {view === 'alur' && <AlurView setView={setView} />}
        {view === 'ajukan' && <AjukanView serviceDown={healthStatus.network === 'down'} addToast={addToast} />}
        {view === 'bk' && <BKDashboardView serviceDown={healthStatus.network === 'down'} addToast={addToast} />}
        {view === 'status' && <StatusPage />}
      </main>

      <footer style={{ textAlign: 'center', padding: '36px', color: 'var(--clr-text-muted)', fontSize: '.78rem', borderTop: '1px solid var(--clr-border)' }}>
        SafeSpace — Cloud Counseling System ITK © 2026
      </footer>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

// ---------- HomeView ----------
function HomeView({ setView }) {
  return (
    <div className="reveal is-visible">
      <section className="hero-grid">
        <div>
          <div style={{ color: 'var(--clr-teal)', fontWeight: 700, fontSize: '.75rem', letterSpacing: '2.5px', marginBottom: '14px' }}>
            SAFE & PRIVATE COUNSELING
          </div>
          <h1 className="hero-h1">
            Tempat Aman untuk<br />
            <span className="gradient-text">Cerita Kamu.</span>
          </h1>
          <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '32px', maxWidth: '500px' }}>
            Privasi adalah prioritas kami. Konsultasikan masalahmu secara anonim dan aman
            dengan guru BK profesional — tanpa perlu membuat akun.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button className="nav-cta" onClick={() => setView('ajukan')} style={{ padding: '12px 28px', fontSize: '.95rem' }}>
              Ajukan Sekarang
            </button>
            <button className="btn-ghost" onClick={() => setView('alur')}>
              Lihat Cara Kerja ↓
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div style={{ width: '100%', height: '320px', background: 'var(--clr-surface-2)', borderRadius: '28px', border: '1px solid var(--clr-border)', display: 'grid', placeItems: 'center' }}>
            <span style={{ fontSize: '5rem' }}>👩🏻‍🏫</span>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--clr-teal)', fontWeight: 700, fontSize: '.75rem', letterSpacing: '2px' }}>CORE PRINCIPLES</div>
        <h2 className="p-title" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 0 }}>Tiga Fondasi Utama</h2>
        <div className="card-grid">
          <PrincipleCard icon="🔐" title="Privat" desc="Hanya kamu dan guru BK yang bisa mengakses percakapan. Admin pun tidak bisa melihatnya." />
          <PrincipleCard icon="✅" title="Mudah" desc="Tidak perlu buat akun. Cukup isi form dan pantau status menggunakan kode pelacak unik." />
          <PrincipleCard icon="☁️" title="Fleksibel" desc="Atur jadwal dan tempat sesuai kenyamananmu, baik tatap muka maupun daring." />
        </div>
      </section>
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

// ---------- AlurView ----------
function AlurView({ setView }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span style={{ color: 'var(--clr-purple)', fontWeight: 700, fontSize: '.75rem', letterSpacing: '2px' }}>STEP BY STEP</span>
        <h1 className="hero-h1" style={{ fontSize: 'clamp(2rem,4vw,3.4rem)', marginTop: '10px' }}>Bagaimana ini bekerja?</h1>
      </div>
      <div className="step-container">
        <StepBox num="01" title="Isi Formulir" desc="Pilih guru BK, waktu, dan ceritakan sedikit tentang apa yang kamu hadapi." />
        <StepBox num="02" title="Terima Kode Pelacak" desc="Setelah mengirim, simpan kode unik yang muncul untuk cek status di kemudian hari." />
        <StepBox num="03" title="Konfirmasi Guru BK" desc="Gurumu akan melihat pengajuanmu dan memberikan jadwal pasti melalui sistem." />
        <StepBox num="04" title="Mulai Konseling" desc="Bertemu di tempat yang disepakati dan mulailah perjalanan kesehatan mentalmu." />
      </div>
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <button className="nav-cta" onClick={() => setView('ajukan')} style={{ padding: '13px 32px', fontSize: '.95rem' }}>
          Siap Untuk Memulai? →
        </button>
      </div>
    </div>
  )
}

function StepBox({ num, title, desc }) {
  return (
    <div className="step-box">
      <div className="step-num">{num}</div>
      <div>
        <h3 className="p-title" style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{title}</h3>
        <p className="p-desc">{desc}</p>
      </div>
    </div>
  )
}

// ---------- AjukanView ----------
function AjukanView({ serviceDown, addToast }) {
  return (
    <div className="form-page">
      <div className="form-sidebar">
        <span style={{ color: 'var(--clr-purple)', fontWeight: 800, fontSize: '.72rem', letterSpacing: '2px' }}>FORM KONSELING</span>
        <h2 className="p-title" style={{ marginTop: '14px' }}>Suaramu berhak didengar.</h2>
        <p className="p-desc">Isi form ini dengan jujur agar guru BK bisa membantumu dengan maksimal. Data kamu aman bersama kami.</p>
        {serviceDown && (
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', fontSize: '.82rem', color: '#f59e0b', lineHeight: 1.5 }}>
            ⚠️ Layanan sedang dalam mode terbatas. Pengajuan mungkin tertunda hingga layanan pulih.
          </div>
        )}
        <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[['✓', 'Tanpa Akun'], ['✓', 'Enkripsi Privat'], ['✓', 'Dapat Kode Pelacak']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--clr-teal)', fontSize: '.88rem', fontWeight: 500 }}>
              <span style={{ background: 'rgba(45,212,191,.12)', border: '1px solid rgba(45,212,191,.25)', borderRadius: '50%', width: '22px', height: '22px', display: 'grid', placeItems: 'center', fontSize: '.7rem', flexShrink: 0 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>
      <div className="form-main">
        <ItemForm mode="consultation" addToast={addToast} />
      </div>
    </div>
  )
}

// ---------- BKDashboardView ----------
function BKDashboardView({ serviceDown, addToast }) {
  const [token, setTokenValue] = useState(sessionStorage.getItem('bkToken') || '')
  const [loadingData, setLD] = useState(false)
  const [stats, setStats] = useState(null)
  const [consultations, setC] = useState([])
  const [actionErr, setAE] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [filterMethod, setFilterMethod] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('terbaru')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const normalizeItem = (item) => ({
    id: item.id,
    tracking_code: item.tracking_code,
    method: item.method,
    status: item.status,
    date: item.date,
    created_at: item.created_at,
    student_name: item.student_name || item.student?.name || '',
    student_gender: item.student_gender || item.student?.gender || '',
    student_phone: item.student_phone || item.student?.phone || '',
    counselor_name: item.counselor_name || '',
    class: item.class || item.student?.school_class || '',
    topic: item.topic || item.topic_name || '',
    time_slot: item.time_slot || item.time_slot_name || '',
    place_name: item.place_name || '',
    whatsapp_link: item.whatsapp_link || null,
    rejection_reason: item.rejection_reason || null,
  })

  const fetchDashboard = useCallback(async (bt = token, fm = filterMethod, fg = filterGender, fs = filterStatus, sq = searchQuery) => {
    const h = bt ? { Authorization: `Bearer ${bt}` } : {}
    setLD(true)
    setAE('')
    try {
      const params = new URLSearchParams()
      params.append('limit', '50')
      params.append('offset', '0')
      if (fm) params.append('method', fm.toUpperCase())
      if (fg) params.append('gender', fg.toUpperCase())
      if (fs) params.append('status', fs.toUpperCase())
      if (sq) params.append('search', sq)

      const [sRes, cRes] = await Promise.all([
        safeFetch(`${API_URL}/api/bk/dashboard/stats`, { headers: h }),
        safeFetch(`${API_URL}/api/bk/consultations?${params}`, { headers: h }),
      ])
      if (!sRes.ok) {
        const e = await sRes.json().catch(() => ({}))
        throw new Error(e.detail || 'Gagal memuat stats')
      }
      if (!cRes.ok) {
        const e = await cRes.json().catch(() => ({}))
        throw new Error(e.detail || 'Gagal memuat konsultasi')
      }

      const sd = await sRes.json()
      const cd = await cRes.json()
      setStats(sd)
      let rawItems = Array.isArray(cd) ? cd : cd.data || []
      // Sorting frontend
      if (sortBy === 'terbaru') rawItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      else if (sortBy === 'nama') rawItems.sort((a, b) => (a.student_name || '').localeCompare(b.student_name || ''))
      setC(rawItems.map(normalizeItem))
    } catch (e) {
      setAE(e.message)
    } finally {
      setLD(false)
    }
  }, [token, filterMethod, filterGender, filterStatus, searchQuery, sortBy])

  useEffect(() => {
    if (token) fetchDashboard()
  }, [token, fetchDashboard])

  const handleLoginSuccess = async (newToken) => {
    sessionStorage.setItem('bkToken', newToken)
    setTokenValue(newToken)
    setStats(null)
    setC([])
    await fetchDashboard(newToken)
    addToast('Login berhasil', 'success')
  }

  const handleRegisterSuccess = () => {
    addToast('Registrasi berhasil, silakan login', 'success')
  }

  const handleLogout = () => {
    setTokenValue('')
    sessionStorage.removeItem('bkToken')
    setStats(null)
    setC([])
    setAE('')
    addToast('Logout berhasil', 'success')
  }

  const updateStatus = async (id, action) => {
    setAE('')
    try {
      const res = await safeFetch(`${API_URL}/api/bk/consultations/${id}/${action}`, {
        method: 'PATCH',
        headers,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.detail || `Gagal ${action}`)
      await fetchDashboard()
      addToast(`Konsultasi ${action === 'accept' ? 'diterima' : 'ditolak'}`, 'success')
    } catch (e) {
      setAE(e.message)
      addToast(e.message, 'error')
    }
  }

  const normalizeWaNumber = (phone) => {
    if (!phone) return null
    const value = String(phone).trim()
    const digits = value.replace(/\D/g, '')
    if (value.startsWith('+62') && digits.startsWith('62')) return digits
    if (digits.startsWith('62')) return digits
    if (digits.startsWith('0')) return `62${digits.slice(1)}`
    return null
  }

  const buildWhatsAppLink = (item) => {
    if (item.whatsapp_link) return item.whatsapp_link
    const waNumber = normalizeWaNumber(item.student_phone)
    if (!waNumber) return null
    const counselorName = item.counselor_name || 'Guru BK'
    if (item.status === 'ACCEPTED') {
      const msg = `Halo ${item.student_name}, saya ${counselorName} dari BK. Pengajuan konsultasi Anda diterima. Mari kita atur jadwal.`
      return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
    }
    if (item.status === 'REJECTED') {
      const reason = item.rejection_reason || 'Belum dicantumkan'
      const msg = `Halo ${item.student_name}, mohon maaf pengajuan konsultasi Anda tidak dapat diproses. Alasan: ${reason}`
      return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
    }
    return null
  }

  const openWhatsApp = (item) => {
    const link = buildWhatsAppLink(item)
    if (!link) {
      setAE('Nomor WhatsApp siswa tidak valid. Pastikan format +62xxxxxxxx')
      return
    }
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const deleteConsultation = async (id) => {
    const ok = window.confirm('Hapus konsultasi ini? Tindakan ini tidak bisa dibatalkan.')
    if (!ok) return
    setAE('')
    setDeletingId(id)
    try {
      const res = await safeFetch(`${API_URL}/api/bk/consultations/${id}`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || 'Gagal menghapus konsultasi')
      }
      await fetchDashboard()
      addToast('Konsultasi berhasil dihapus', 'success')
    } catch (e) {
      setAE(e.message)
      addToast(e.message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  if (!token) {
    return (
      <div className="form-page" style={{ alignItems: 'stretch' }}>
        <div className="form-sidebar">
          <span style={{ color: 'var(--clr-purple)', fontWeight: 800, fontSize: '.72rem', letterSpacing: '2px' }}>DASHBOARD BK</span>
          <h2 className="p-title" style={{ marginTop: '14px' }}>Kelola konsultasi dengan aman.</h2>
          <p className="p-desc">
            Login atau daftar sebagai guru BK untuk mengakses dan mengelola pengajuan konseling siswa secara real-time.
          </p>
          {serviceDown && (
            <div
              style={{
                marginTop: '20px',
                padding: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '10px',
                fontSize: '.82rem',
                color: '#f59e0b',
                lineHeight: 1.5,
              }}
            >
              ⚠️ Layanan autentikasi sedang gangguan. Beberapa fitur dashboard mungkin tidak tersedia.
            </div>
          )}
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {[
              ['✓', 'Protected JWT endpoint'],
              ['✓', 'Data isolated per counselor'],
              ['✓', 'Accept / Reject live action'],
            ].map(([i, t]) => (
              <div
                key={t}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  color: 'var(--clr-teal)',
                  fontSize: '.87rem',
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    background: 'rgba(45,212,191,.1)',
                    border: '1px solid rgba(45,212,191,.22)',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '.68rem',
                    flexShrink: 0,
                  }}
                >
                  {i}
                </span>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="form-main">
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
            serviceDown={serviceDown}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="form-page" style={{ alignItems: 'stretch' }}>
      <div className="form-sidebar">
        <span style={{ color: 'var(--clr-purple)', fontWeight: 800, fontSize: '.72rem', letterSpacing: '2px' }}>
          DASHBOARD BK
        </span>
        <h2 className="p-title" style={{ marginTop: '14px' }}>
          Kelola konsultasi dengan aman.
        </h2>
        <p className="p-desc">Lihat dan kelola pengajuan konseling siswa.</p>
        <button className="btn-ghost" onClick={handleLogout} style={{ marginTop: '20px' }}>
          Logout
        </button>
      </div>
      <div className="form-main" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {actionErr && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {actionErr}
          </div>
        )}
        <div className="stat-card-grid">
          <div className="stat-card">
            <div className="stat-card-label">Total Konsultasi</div>
            <div className="stat-card-value">{stats?.total ?? 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Menunggu Persetujuan</div>
            <div className="stat-card-value" style={{ color: '#f59e0b' }}>
              {stats?.pending ?? 0}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Disetujui</div>
            <div className="stat-card-value" style={{ color: '#10b981' }}>
              {stats?.accepted ?? 0}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Ditolak</div>
            <div className="stat-card-value" style={{ color: '#ef4444' }}>
              {stats?.rejected ?? 0}
            </div>
          </div>
        </div>
        <div className="bk-main-grid">
          <div className="bk-chart-panel">
            <div className="bk-panel-title">Statistik Konsultasi</div>
            <DonutChart stats={stats} />
          </div>
          <div className="bk-list-panel">
            <div className="bk-filter-section">
              <div className="bk-filter-title">🔍 Filter Konsultasi</div>
              <div className="bk-filter-group">
                <div className="bk-filter-item">
                  <label className="bk-filter-label">Metode</label>
                  <select
                    className="bk-filter-select"
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="INDIVIDUAL">Individual (1-1)</option>
                    <option value="GROUP">Kelompok</option>
                  </select>
                </div>
                <div className="bk-filter-item">
                  <label className="bk-filter-label">Gender</label>
                  <select
                    className="bk-filter-select"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="MALE">Laki-laki</option>
                    <option value="FEMALE">Perempuan</option>
                  </select>
                </div>
                <div className="bk-filter-item">
                  <label className="bk-filter-label">Status</label>
                  <select
                    className="bk-filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div className="bk-panel-title" style={{ margin: 0 }}>
                Konsultasi Terbaru
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <SearchBar onSearch={setSearchQuery} />
                <SortBar sortBy={sortBy} onSortChange={setSortBy} />
                <button
                  className="nav-cta"
                  style={{ padding: '8px 16px', fontSize: '.8rem' }}
                  onClick={() => fetchDashboard()}
                  disabled={loadingData}
                >
                  {loadingData ? '⏳' : '↻'} Refresh
                </button>
              </div>
            </div>
            {loadingData ? (
              <Spinner />
            ) : (
              <ItemList
                items={consultations}
                onAccept={(id) => updateStatus(id, 'accept')}
                onReject={(id) => updateStatus(id, 'reject')}
                onDelete={deleteConsultation}
                onWhatsApp={openWhatsApp}
                isDeletingId={deletingId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- DonutChart ----------
function DonutChart({ stats }) {
  const total = stats?.total || 0
  const pending = stats?.pending || 0
  const accepted = stats?.accepted || 0
  const rejected = stats?.rejected || 0

  if (total === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '160px',
          color: 'var(--clr-text-muted)',
          fontSize: '.85rem',
        }}
      >
        Belum ada data
      </div>
    )
  }

  const cx = 80,
    cy = 80,
    r = 56,
    stroke = 20
  const circumference = 2 * Math.PI * r
  const segments = [
    { value: accepted, color: '#10b981', label: 'Diterima' },
    { value: pending, color: '#f59e0b', label: 'Menunggu' },
    { value: rejected, color: '#ef4444', label: 'Ditolak' },
  ]
  let offset = 0
  const arcs = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0
    const dash = pct * circumference
    const gap = circumference - dash
    const startOffset = circumference - (offset * circumference) / total
    offset += seg.value
    return { ...seg, dash, gap, strokeDashoffset: startOffset }
  })

  return (
    <div className="donut-wrap">
      <div className="donut-chart-area">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--clr-border)"
            strokeWidth={stroke}
          />
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={stroke}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={arc.strokeDashoffset}
              strokeLinecap="butt"
              style={{
                transition: 'stroke-dasharray .8s ease',
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          ))}
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="var(--clr-text)"
            fontSize="22"
            fontWeight="700"
            fontFamily="Playfair Display, serif"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill="var(--clr-text-2)"
            fontSize="10"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Total
          </text>
        </svg>
      </div>
      <div className="donut-legend">
        {[
          { label: 'Diterima', value: accepted, color: '#10b981' },
          { label: 'Menunggu', value: pending, color: '#f59e0b' },
          { label: 'Ditolak', value: rejected, color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} className="donut-legend-item">
            <span
              className="donut-legend-dot"
              style={{ background: item.color }}
            />
            <span className="donut-legend-label">{item.label}</span>
            <span className="donut-legend-value" style={{ color: item.color }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}