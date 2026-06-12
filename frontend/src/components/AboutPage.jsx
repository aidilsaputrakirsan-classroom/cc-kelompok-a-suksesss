function AboutPage({ onBack }) {
  const team = [
    { name: "Rendy Rifandi Kurnia", nim: "10231081", role: "Lead Backend" },
    { name: "Riska Fadlun Khairiyah Purba", nim: "10231083", role: "Lead Frontend" },
    { name: "Rizki Abdul Aziz", nim: "10231085", role: "Lead DevOps" },
    { name: "Siti Nur Azizah Putri Awni", nim: "10231087", role: "Lead QA & Docs" },
  ]

  const techStack = [
    { icon: "⚙️", name: "Backend", tech: "FastAPI + PostgreSQL" },
    { icon: "🎨", name: "Frontend", tech: "React + Vite" },
    { icon: "🐳", name: "Container", tech: "Docker + Docker Compose" },
    { icon: "🚀", name: "CI/CD", tech: "GitHub Actions (coming soon)" }
  ]

  return (
    <div className="about-container">
      {/* Header */}
      <div className="about-header">
        <button className="about-back-btn" onClick={onBack}>
          ← Kembali
        </button>
      </div>

      {/* Title Section */}
      <div className="about-title-section">
        <div className="about-label">About This Project</div>
        <h1 className="about-title">SafeSpace</h1>
        <p className="about-description">
          Aplikasi Cloud-Native yang dibangun untuk mata kuliah Komputasi Awan ITK Balikpapan. 
          Platform konseling digital yang aman, privat, dan mudah diakses oleh siswa.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="about-section">
        <h2 className="about-section-title">🛠️ Tech Stack</h2>
        <div className="about-tech-grid">
          {techStack.map((tech, i) => (
            <div key={i} className="about-tech-card">
              <div className="about-tech-icon">{tech.icon}</div>
              <div className="about-tech-name">{tech.name}</div>
              <div className="about-tech-description">{tech.tech}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="about-section">
        <h2 className="about-section-title">👥 Tim Pengembang</h2>
        <div className="about-table-wrapper">
          <table className="about-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIM</th>
                <th>Peran</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, i) => (
                <tr key={i}>
                  <td>{member.name}</td>
                  <td>{member.nim}</td>
                  <td>{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="about-footer">
        <p>
          SafeSpace adalah aplikasi Cloud-Native untuk sistem konseling digital di sekolah.
        </p>
        <p>
          Dibangun dengan ❤️ oleh tim Komputasi Awan ITK © 2026
        </p>
      </div>
    </div>
  )
}

export default AboutPage