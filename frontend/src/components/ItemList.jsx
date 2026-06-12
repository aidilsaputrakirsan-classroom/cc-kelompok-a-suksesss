// frontend/src/components/ItemList.jsx
import ItemCard from './ItemCard'

export default function ItemList({ items, onAccept, onReject, onDelete, onWhatsApp, isDeletingId }) {
  if (!items || items.length === 0) {
    return <p className="bk-empty-text">Belum ada konsultasi untuk akun ini.</p>
  }
  return (
    <div style={{ display: 'grid', gap: '10px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onAccept={onAccept}
          onReject={onReject}
          onDelete={onDelete}
          onWhatsApp={onWhatsApp}
          isDeleting={isDeletingId === item.id}
        />
      ))}
    </div>
  )
}