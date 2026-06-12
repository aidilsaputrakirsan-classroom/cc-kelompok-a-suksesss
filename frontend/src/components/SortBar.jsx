// frontend/src/components/SortBar.jsx
export default function SortBar({ sortBy, onSortChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-2)' }}>Urutkan:</span>
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="f-input" style={{ width: 'auto' }}>
        <option value="terbaru">Terbaru</option>
        <option value="nama">Nama Siswa</option>
      </select>
    </div>
  )
}