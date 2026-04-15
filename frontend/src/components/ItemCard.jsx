import React from 'react';

function ItemCard({ item, onEdit, onDelete }) {
  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  }

  return (
    <div className="trio-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="trio-title" style={{ margin: 0 }}>{item.name}</h3>
        <span style={{ color: '#2dd4bf', fontWeight: 'bold' }}>{formatRupiah(item.price)}</span>
      </div>

      {item.description && (
        <p className="trio-desc" style={{ margin: 0 }}>{item.description}</p>
      )}

      <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'rgba(220,215,255,0.5)' }}>
        <span>📦 Stok: {item.quantity}</span>
        <span>🕐 {formatDate(item.created_at)}</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
        <button onClick={() => onEdit(item)} className="nav-link" style={{ background: 'rgba(124,58,237,0.2)', color: '#c4b5fd', borderRadius: '8px', flex: 1, padding: '8px' }}>
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(item.id)} className="nav-link" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderRadius: '8px', flex: 1, padding: '8px' }}>
          🗑️ Hapus
        </button>
      </div>
    </div>
  )
}

export default ItemCard;