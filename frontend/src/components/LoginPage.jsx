import { useState } from "react"

function LoginPage({ onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isRegister) {
        if (!formData.name.trim()) {
          setError("Nama wajib diisi")
          setLoading(false)
          return
        }
        if (formData.password.length < 8) {
          setError("Password minimal 8 karakter")
          setLoading(false)
          return
        }
        await onRegister(formData)
      } else {
        await onLogin(formData.email, formData.password)
      }
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        setError("Email atau password salah")
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Cloud App</h1>
        <p style={styles.subtitle}>Komputasi Awan — SI ITK</p>

        {/* Tab Switch */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(isRegister ? {} : styles.tabActive) }}
            onClick={() => { setIsRegister(false); setError("") }}
          >
            Login
          </button>
          <button
            style={{ ...styles.tab, ...(isRegister ? styles.tabActive : {}) }}
            onClick={() => { setIsRegister(true); setError("") }}
          >
            Register
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.field}>
              <label style={styles.label}>Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@student.itk.ac.id"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                required
                style={{ ...styles.input, flex: 1, border: "none", outline: "none", padding: 0 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.btnSubmit} disabled={loading}>
            {loading ? "Memuat..." : isRegister ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F4E79",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "2.5rem",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    margin: "0 0 0.25rem 0",
    color: "#1F4E79",
    fontSize: "2rem",
  },
  subtitle: {
    textAlign: "center",
    color: "#888",
    margin: "0 0 1.5rem 0",
    fontSize: "0.9rem",
  },
  tabs: {
    display: "flex",
    marginBottom: "1.5rem",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #e0e0e0",
  },
  tab: {
    flex: 1,
    padding: "0.7rem",
    border: "none",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "bold",
    color: "#888",
  },
  tabActive: {
    backgroundColor: "#1F4E79",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    gap: "0.5rem",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  btnSubmit: {
    padding: "0.8rem",
    backgroundColor: "#548235",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
  error: {
    backgroundColor: "#FBE5D6",
    color: "#C00000",
    padding: "0.6rem 1rem",
    borderRadius: "6px",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    textAlign: "center",
  },
}

export default LoginPage