// frontend/src/components/ItemCard.jsx
export default function ItemCard({ item, onAccept, onReject, onDelete, onWhatsApp, isDeleting }) {
  const fmtDate = (d) => {
    if (!d) return '—'
    try {
      return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return d
    }
  }

  return (
    <div className="consult-item">
      <div className="consult-item-header">
        <div>
          <div className="consult-item-name">{item.student_name}</div>
          <div className="consult-item-meta">{item.class} · {item.topic} · {item.method}</div>
        </div>
        <span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span>
      </div>
      <div className="consult-item-details">
        <span className="consult-detail-tag"><span className="detail-icon">📅</span>{fmtDate(item.date)}</span>
        {item.time_slot && <span className="consult-detail-tag"><span className="detail-icon">⏰</span>{item.time_slot}</span>}
        {item.place_name && <span className="consult-detail-tag"><span className="detail-icon">📍</span>{item.place_name}</span>}
        {item.topic && <span className="consult-detail-tag"><span className="detail-icon">📝</span>{item.topic}</span>}
      </div>
      <div className="consult-item-code">{item.tracking_code}</div>
      {item.status === 'PENDING' && (
        <div className="consult-item-actions">
          <button className="btn-accept" onClick={() => onAccept?.(item.id)} disabled={isDeleting}>✓ Terima</button>
          <button className="btn-reject" onClick={() => onReject?.(item.id)} disabled={isDeleting}>✕ Tolak</button>
        </div>
      )}
      {item.status === 'ACCEPTED' && (
        <div className="consult-item-actions">
          <button className="btn-whatsapp" onClick={() => onWhatsApp?.(item)}>📱 Chat WhatsApp</button>
        </div>
      )}
      {item.status === 'REJECTED' && (
        <div className="consult-item-actions">
          <button className="btn-wa-info" onClick={() => onWhatsApp?.(item)}>📱 Info Penolakan</button>
        </div>
      )}
      <div className="consult-item-actions">
        <button className="btn-delete" onClick={() => onDelete?.(item.id)} disabled={isDeleting}>
          {isDeleting ? 'Menghapus...' : '🗑 Hapus'}
        </button>
      </div>
    </div>
  )
}