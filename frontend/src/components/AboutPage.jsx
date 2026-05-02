function AboutPage({ onBack }) {
  const team = [
    { name: "Rendy Rifandi Kurnia ", nim: "10231081", role: "Lead Backend" },
    { name: "Riska Fadlun Khairiyah Purba", nim: "10231083", role: "Lead Frontend" },
    { name: "Rizki Abdul Aziz", nim: "10231085", role: "Lead DevOps" },
    { name: "Siti Nur Azizah Putri Awni", nim: "10231087", role: "Lead QA & Docs" },
  ]

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={onBack} style={{ marginBottom: "20px", padding: "8px 16px", cursor: "pointer" }}>
        ← Kembali
      </button>
      
      <h1>About This Project</h1>
      <p>Aplikasi Cloud-Native yang dibangun untuk mata kuliah Komputasi Awan ITK Balikpapan.</p>
      
      <h2>Tech Stack</h2>
      <ul>
        <li><strong>Backend:</strong> FastAPI + PostgreSQL</li>
        <li><strong>Frontend:</strong> React + Vite</li>
        <li><strong>Container:</strong> Docker + Docker Compose</li>
        <li><strong>CI/CD:</strong> GitHub Actions (coming soon)</li>
      </ul>
      
      <h2>Tim Pengembang</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Nama</th>
            <th>NIM</th>
            <th>Peran</th>
          </tr>
        </thead>
        <tbody>
          {team.map((m, i) => (
            <tr key={i}>
              <td>{m.name}</td>
              <td>{m.nim}</td>
              <td>{m.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AboutPage