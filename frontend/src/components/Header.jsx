function Header({ totalItems, isConnected, user, onLogout }) {
  const roleConfig = {
    admin:     { label: 'Admin',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)' },
    counselor: { label: 'Guru BK', color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)',   border: 'rgba(45,212,191,0.22)' },
    student:   { label: 'Siswa',   color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.22)' },
  }
  const role = roleConfig[user?.role] || roleConfig.student

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <>
      <style>{headerStyles}</style>
      <header className="hdr">
        {/* Brand */}
        <div className="hdr-brand">
          <div className="hdr-logo">🌿</div>
          <div className="hdr-brand-text">
            <span className="hdr-name">SafeSpace</span>
            <span className="hdr-tagline">Cloud Counseling</span>
          </div>
        </div>

        {/* Center: status */}
        <div className="hdr-center">
          <div className={`hdr-status ${isConnected ? 'hdr-status-ok' : 'hdr-status-err'}`}>
            <span className="hdr-status-dot"></span>
            <span>{isConnected ? 'Terhubung ke API' : 'API tidak tersedia'}</span>
          </div>
          {typeof totalItems === 'number' && (
            <div className="hdr-count">
              <span className="hdr-count-num">{totalItems}</span>
              <span className="hdr-count-label">items</span>
            </div>
          )}
        </div>

        {/* Right: user */}
        {user && (
          <div className="hdr-user">
            <div className="hdr-role-badge" style={{ color: role.color, background: role.bg, borderColor: role.border }}>
              {role.label}
            </div>
            <div className="hdr-avatar">{initials}</div>
            <div className="hdr-user-info">
              <span className="hdr-user-name">{user.name}</span>
              <span className="hdr-user-email">{user.email}</span>
            </div>
            <button className="hdr-logout" onClick={onLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Keluar
            </button>
          </div>
        )}
      </header>
    </>
  )
}

const headerStyles = `
  .hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 24px;
    height: 64px;
    background: rgba(8, 11, 20, 0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    position: sticky;
    top: 0;
    z-index: 80;
  }

  /* Brand */
  .hdr-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .hdr-logo {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, #7c3aed, #0d9488);
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .hdr-brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .hdr-name {
    font-family: 'Lora', Georgia, serif;
    font-size: 1rem;
    font-weight: 700;
    color: #f0eeff;
    letter-spacing: -0.01em;
  }

  .hdr-tagline {
    font-size: 0.68rem;
    color: rgba(180,175,220,0.5);
    letter-spacing: 0.02em;
  }

  /* Center */
  .hdr-center {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .hdr-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 500;
    border: 1px solid;
  }
  .hdr-status-ok {
    color: #2dd4bf;
    background: rgba(45,212,191,0.08);
    border-color: rgba(45,212,191,0.2);
  }
  .hdr-status-err {
    color: #fca5a5;
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.2);
  }

  @keyframes hdr-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .hdr-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    animation: hdr-pulse 2s ease-in-out infinite;
  }

  .hdr-count {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  .hdr-count-num {
    font-size: 1rem;
    font-weight: 700;
    color: #f0eeff;
  }
  .hdr-count-label {
    font-size: 0.75rem;
    color: rgba(180,175,220,0.55);
  }

  /* User area */
  .hdr-user {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .hdr-role-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    border: 1px solid;
  }

  .hdr-avatar {
    width: 34px;
    height: 34px;
    background: linear-gradient(135deg, rgba(124,58,237,0.5), rgba(13,148,136,0.4));
    border: 1px solid rgba(124,58,237,0.3);
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #c4b5fd;
    flex-shrink: 0;
  }

  .hdr-user-info {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }
  .hdr-user-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #f0eeff;
  }
  .hdr-user-email {
    font-size: 0.72rem;
    color: rgba(180,175,220,0.5);
  }

  .hdr-logout {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: rgba(220,215,255,0.65);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .hdr-logout:hover {
    background: rgba(239,68,68,0.1);
    border-color: rgba(239,68,68,0.25);
    color: #fca5a5;
  }

  @media (max-width: 640px) {
    .hdr-center { display: none; }
    .hdr-user-info { display: none; }
    .hdr-role-badge { display: none; }
  }
`

export default Header