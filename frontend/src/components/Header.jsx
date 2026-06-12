// frontend/src/components/Header.jsx
import DarkModeToggle from './DarkModeToggle'

export default function Header({ view, setView, showAbout, setShowAbout }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => setView('home')}>
        <div className="nav-logo">👩🏻‍🏫</div>
        <span>SafeSpace</span>
      </div>
      <div className="nav-links">
        <button className={`nav-link ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Beranda</button>
        <button className={`nav-link ${view === 'alur' ? 'active' : ''}`} onClick={() => setView('alur')}>Alur Kerja</button>
        <button className={`nav-link ${view === 'bk' ? 'active' : ''}`} onClick={() => setView('bk')}>Dashboard BK</button>
        <button className={`nav-link ${view === 'status' ? 'active' : ''}`} onClick={() => setView('status')}>Status</button>
        <button className={`nav-link ${showAbout ? 'active' : ''}`} onClick={() => setShowAbout(true)}>About</button>
        <button className="nav-cta" onClick={() => setView('ajukan')}>Mulai Konseling →</button>
        <DarkModeToggle />
      </div>
    </nav>
  )
}