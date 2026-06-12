// frontend/src/components/LoginPage.jsx
import { useState } from 'react'
import RetryButton from './RetryButton'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

export default function LoginPage({ onLoginSuccess, onRegisterSuccess, serviceDown }) {
  const [authTab, setAuthTab] = useState('login')
  const [email, setEmail] = useState('anita.bk@safespace.sch.id')
  const [password, setPassword] = useState('Counselor123')
  const [loginErr, setLoginErr] = useState('')
  const [loginErrorType, setLoginErrorType] = useState(null)
  const [loadingLogin, setLL] = useState(false)
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phone: '', specialization: '', showPw: false })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerFieldErrors, setRegisterFieldErrors] = useState({})
  const [registerSuccess, setRegisterSuccess] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginErr('')
    setLoginErrorType(null)
    setLL(true)
    try {
      const res = await safeFetch(`${API_URL}/api/bk/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login gagal')
      onLoginSuccess(data.access_token)
    } catch (e) {
      setLoginErr(e.message)
      if (e.type === 'service-down') setLoginErrorType('service-down')
      else if (e.type === 'network-error') setLoginErrorType('network-error')
      else setLoginErrorType('api-error')
    } finally {
      setLL(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegisterError('')
    setRegisterFieldErrors({})
    const errors = {}
    if (!registerData.name.trim() || registerData.name.trim().length < 2) errors.name = 'Nama minimal 2 karakter'
    if (!registerData.email.trim()) errors.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) errors.email = 'Format email tidak valid'
    if (!registerData.password) errors.password = 'Password wajib diisi'
    else if (registerData.password.length < 8) errors.password = 'Minimal 8 karakter'
    else if (!/[A-Za-z]/.test(registerData.password)) errors.password = 'Harus mengandung huruf'
    else if (!/\d/.test(registerData.password)) errors.password = 'Harus mengandung angka'
    if (registerData.phone && !/^\+62\d{8,13}$/.test(registerData.phone.trim())) errors.phone = 'Format: +62xxxxxxxxxx'
    if (Object.keys(errors).length) { setRegisterFieldErrors(errors); return }
    setRegisterLoading(true)
    try {
      const payload = {
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        ...(registerData.phone.trim() ? { phone: registerData.phone.trim() } : {}),
        ...(registerData.specialization.trim() ? { specialization: registerData.specialization.trim() } : {}),
      }
      const res = await safeFetch(`${API_URL}/api/bk/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        if (typeof data.detail === 'string') { setRegisterError(data.detail); return }
        if (Array.isArray(data.detail)) {
          const m = {}
          data.detail.forEach(e => {
            const k = e.loc?.[e.loc.length - 1]
            if (k) m[k] = e.msg.replace('Value error, ', '')
          })
          setRegisterFieldErrors(m)
          return
        }
        setRegisterError('Registrasi gagal. Coba lagi.')
        return
      }
      setRegisterSuccess(data)
      setTimeout(() => onRegisterSuccess(), 2400)
    } catch {
      setRegisterError('Tidak dapat terhubung ke server.')
    } finally {
      setRegisterLoading(false)
    }
  }

  if (registerSuccess) {
    return (
      <div className="register-success">
        <div className="success-ring">🎉</div>
        <div className="success-title">Akun Berhasil Dibuat!</div>
        <p className="success-sub">Selamat datang, <strong>{registerSuccess.name}</strong>! Kamu akan diarahkan ke halaman login.</p>
        <div style={{ width: '100%', height: '3px', background: 'var(--clr-surface-2)', borderRadius: '2px', overflow: 'hidden', maxWidth: '200px' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#7c3aed,#2dd4bf)', animation: 'fill-bar 2.4s linear forwards' }} />
        </div>
        <style>{`@keyframes fill-bar{from{width:0}to{width:100%}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '18px', padding: '28px' }}>
      <div className="auth-tab-bar">
        <button className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => { setAuthTab('login'); setLoginErr('') }}>🔐 Login</button>
        <button className={`auth-tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => { setAuthTab('register'); setLoginErr('') }}>✍️ Daftar Akun</button>
      </div>
      {authTab === 'login' && (
        <div>
          <div className="form-section-title">Masuk ke Dashboard</div>
          <p className="form-section-sub">Belum punya akun? <button className="link-btn" onClick={() => setAuthTab('register')}>Daftar di sini →</button></p>
          {loginErr && <div className="alert alert-error" style={{ marginBottom: '16px' }}><span className="alert-icon">⚠️</span>{loginErr}</div>}
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '15px' }}>
            <div className="input-group"><label>Email</label><input className="f-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@sekolah.sch.id" required /></div>
            <div className="input-group"><label>Password</label><input className="f-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password Anda" required /></div>
            <button className="btn-form-submit" type="submit" disabled={loadingLogin}>{loadingLogin && <span className="btn-spinner" />}{loadingLogin ? 'Memproses...' : '🔐 Masuk Dashboard BK'}</button>
          </form>
          {loginErrorType && <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}><RetryButton onRetry={handleLogin} isLoading={loadingLogin} label={loginErrorType === 'service-down' ? 'Coba Login Lagi' : 'Refresh'} /></div>}
        </div>
      )}
      {authTab === 'register' && (
        <div>
          <div className="form-section-title">Daftar Akun Guru BK</div>
          <p className="form-section-sub">Sudah punya akun? <button className="link-btn" onClick={() => setAuthTab('login')}>Login di sini →</button></p>
          {registerError && <div className="alert alert-error" style={{ marginBottom: '16px' }}><span className="alert-icon">⚠️</span>{registerError}</div>}
          <form onSubmit={handleRegister} style={{ display: 'grid', gap: '16px' }}>
            <div className="input-group"><label>Nama Lengkap <span style={{ color: 'var(--clr-purple)' }}>*</span></label><input className={`f-input ${registerFieldErrors.name ? 'is-error' : ''}`} type="text" placeholder="Nama lengkap Anda" value={registerData.name} onChange={e => setRegisterData(p => ({ ...p, name: e.target.value }))} />{registerFieldErrors.name && <span className="field-error">⚠ {registerFieldErrors.name}</span>}</div>
            <div className="input-group"><label>Email <span style={{ color: 'var(--clr-purple)' }}>*</span></label><input className={`f-input ${registerFieldErrors.email ? 'is-error' : ''}`} type="email" placeholder="email@sekolah.sch.id" value={registerData.email} onChange={e => setRegisterData(p => ({ ...p, email: e.target.value }))} />{registerFieldErrors.email && <span className="field-error">⚠ {registerFieldErrors.email}</span>}</div>
            <div className="input-group"><label>Password <span style={{ color: 'var(--clr-purple)' }}>*</span></label><div style={{ position: 'relative' }}><input className={`f-input ${registerFieldErrors.password ? 'is-error' : ''}`} type={registerData.showPw ? 'text' : 'password'} placeholder="Min. 8 karakter, ada huruf + angka" value={registerData.password} onChange={e => setRegisterData(p => ({ ...p, password: e.target.value }))} style={{ paddingRight: '44px' }} /><button type="button" onClick={() => setRegisterData(p => ({ ...p, showPw: !p.showPw }))} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>{registerData.showPw ? '🙈' : '👁️'}</button></div>{registerFieldErrors.password && <span className="field-error">⚠ {registerFieldErrors.password}</span>}</div>
            <div className="input-group"><label>Nomor WhatsApp <span style={{ color: 'var(--clr-text-muted)' }}>(opsional)</span></label><input className={`f-input ${registerFieldErrors.phone ? 'is-error' : ''}`} type="tel" placeholder="+628xxxxxxxxxx" value={registerData.phone} onChange={e => setRegisterData(p => ({ ...p, phone: e.target.value }))} /><span className="field-hint">Contoh: +6281234567890 (format +62 wajib)</span>{registerFieldErrors.phone && <span className="field-error">⚠ {registerFieldErrors.phone}</span>}</div>
            <div className="input-group"><label>Bidang Spesialisasi <span style={{ color: 'var(--clr-text-muted)' }}>(opsional)</span></label><input className="f-input" type="text" placeholder="Contoh: Konseling Remaja, Karir, Keluarga" value={registerData.specialization} onChange={e => setRegisterData(p => ({ ...p, specialization: e.target.value }))} maxLength={120} /><span className="char-counter">{registerData.specialization.length}/120</span></div>
            <button className="btn-form-submit" type="submit" disabled={registerLoading}>{registerLoading && <span className="btn-spinner" />}{registerLoading ? 'Mendaftarkan...' : '✍️ Daftar Akun Guru BK'}</button>
          </form>
        </div>
      )}
    </div>
  )
}