import { useState } from 'react'

function LoginPage({ onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        if (!formData.name.trim()) { setError('Nama wajib diisi'); setLoading(false); return }
        if (formData.password.length < 8) { setError('Password minimal 8 karakter'); setLoading(false); return }
        await onRegister(formData)
      } else {
        await onLogin(formData.email, formData.password)
      }
    } catch (err) {
      setError(err.message === 'UNAUTHORIZED' ? 'Email atau password salah' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{loginStyles}</style>
      <div className="lp-shell">

        {/* Kiri: branding */}
        <div className="lp-left">
          <div className="lp-brand">
            <div className="lp-logo">🌿</div>
            <h1 className="lp-app-name">SafeSpace</h1>
          </div>
          <h2 className="lp-tagline">
            Ruang konseling yang <span className="lp-highlight">privat</span>{' '}
            dan <span className="lp-highlight">aman</span>.
          </h2>
          <p className="lp-tagline-sub">
            Platform bimbingan konseling berbasis cloud untuk siswa
            dan guru BK Institut Teknologi Kalimantan.
          </p>

          <div className="lp-features">
            {[
              { icon: '🔒', text: 'Data terisolasi per guru BK' },
              { icon: '⚡', text: 'Akses cepat tanpa hambatan' },
              { icon: '☁️', text: 'Cloud-native & selalu tersedia' },
            ].map((f) => (
              <div className="lp-feature" key={f.text}>
                <span className="lp-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan: form */}
        <div className="lp-right">
          <div className="lp-card">
            <div className="lp-card-header">
              <h2 className="lp-form-title">
                {isRegister ? 'Buat akun baru' : 'Selamat datang kembali'}
              </h2>
              <p className="lp-form-sub">
                {isRegister
                  ? 'Daftar untuk mulai menggunakan SafeSpace'
                  : 'Masuk ke akun SafeSpace Anda'}
              </p>
            </div>

            {/* Tab */}
            <div className="lp-tabs">
              <button
                className={`lp-tab ${!isRegister ? 'lp-tab-active' : ''}`}
                onClick={() => { setIsRegister(false); setError('') }}
              >Login</button>
              <button
                className={`lp-tab ${isRegister ? 'lp-tab-active' : ''}`}
                onClick={() => { setIsRegister(true); setError('') }}
              >Register</button>
            </div>

            {error && (
              <div className="lp-error">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="lp-form">
              {isRegister && (
                <div className="lp-field">
                  <label className="lp-label">Nama Lengkap</label>
                  <input
                    className="lp-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap Anda"
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="lp-field">
                <label className="lp-label">Email</label>
                <input
                  className="lp-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@itk.ac.id"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="lp-field">
                <label className="lp-label">Password</label>
                <div className="lp-pass-wrap">
                  <input
                    className="lp-input lp-pass-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isRegister ? 'Minimal 8 karakter' : 'Password Anda'}
                    required
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="lp-submit" type="submit" disabled={loading}>
                {loading ? (
                  <span className="lp-loading">
                    <span className="lp-spinner"></span>
                    Memproses...
                  </span>
                ) : (
                  isRegister ? 'Buat Akun' : 'Masuk ke SafeSpace →'
                )}
              </button>
            </form>

            <p className="lp-footer-note">
              Komputasi Awan · Sistem Informasi ITK
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

const loginStyles = `
  .lp-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* Left panel */
  .lp-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(32px, 6vw, 80px);
    background: linear-gradient(145deg, rgba(109,40,217,0.18) 0%, rgba(13,148,136,0.1) 100%);
    border-right: 1px solid rgba(255,255,255,0.07);
  }

  .lp-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 40px;
  }

  .lp-logo {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #7c3aed, #0d9488);
    border-radius: 13px;
    display: grid;
    place-items: center;
    font-size: 20px;
    box-shadow: 0 4px 20px rgba(124,58,237,0.4);
  }

  .lp-app-name {
    font-family: 'Lora', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #f0eeff;
    letter-spacing: -0.02em;
  }

  .lp-tagline {
    font-family: 'Lora', Georgia, serif;
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 700;
    line-height: 1.2;
    color: #f0eeff;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }

  .lp-highlight {
    background: linear-gradient(90deg, #c4b5fd, #2dd4bf);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .lp-tagline-sub {
    font-size: 1rem;
    color: rgba(220,215,255,0.7);
    line-height: 1.7;
    max-width: 44ch;
    margin-bottom: 40px;
  }

  .lp-features {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .lp-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.9rem;
    color: rgba(220,215,255,0.75);
  }

  .lp-feature-icon {
    width: 34px;
    height: 34px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  /* Right panel */
  .lp-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(24px, 4vw, 56px);
    background: rgba(6,8,15,0.5);
  }

  .lp-card {
    width: 100%;
    max-width: 420px;
  }

  .lp-card-header {
    margin-bottom: 28px;
  }

  .lp-form-title {
    font-family: 'Lora', Georgia, serif;
    font-size: 1.7rem;
    font-weight: 700;
    color: #f0eeff;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .lp-form-sub {
    font-size: 0.9rem;
    color: rgba(220,215,255,0.6);
  }

  .lp-tabs {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .lp-tab {
    flex: 1;
    padding: 9px;
    border: none;
    background: transparent;
    border-radius: 9px;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(220,215,255,0.55);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .lp-tab-active {
    background: rgba(124,58,237,0.3);
    color: #c4b5fd;
    box-shadow: 0 2px 10px rgba(124,58,237,0.2);
  }

  .lp-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    background: rgba(194,65,12,0.12);
    border: 1px solid rgba(239,68,68,0.22);
    border-radius: 10px;
    color: #fca5a5;
    font-size: 0.875rem;
    margin-bottom: 16px;
  }

  .lp-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .lp-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .lp-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(220,215,255,0.75);
    letter-spacing: 0.01em;
  }

  .lp-input {
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 11px;
    font-size: 0.95rem;
    color: #f0eeff;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
  }
  .lp-input::placeholder { color: rgba(180,175,220,0.4); }
  .lp-input:focus {
    border-color: rgba(124,58,237,0.5);
    background: rgba(124,58,237,0.06);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
  }

  .lp-pass-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .lp-pass-input { padding-right: 46px; }
  .lp-eye {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(180,175,220,0.5);
    display: flex;
    align-items: center;
    padding: 4px;
    transition: color 0.2s;
  }
  .lp-eye:hover { color: rgba(196,181,253,0.8); }

  .lp-submit {
    padding: 13px;
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
    color: #fff;
    border: none;
    border-radius: 11px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(109,40,217,0.4);
    margin-top: 4px;
    font-family: 'DM Sans', sans-serif;
  }
  .lp-submit:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(109,40,217,0.5);
  }
  .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .lp-loading {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  @keyframes lp-spin { to { transform: rotate(360deg); } }
  .lp-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: lp-spin 0.7s linear infinite;
  }

  
  .lp-footer-note {
    text-align: center;
    font-size: 0.75rem;
    color: rgba(180,175,220,0.4);
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .lp-shell { grid-template-columns: 1fr; }
    .lp-left { display: none; }
    .lp-right { padding: 24px; min-height: 100vh; }
  }
`

export default LoginPage