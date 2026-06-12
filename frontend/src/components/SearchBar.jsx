// frontend/src/components/SearchBar.jsx
import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flex: 1 }}>
      <input
        type="text"
        placeholder="Cari nama siswa atau topik..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="f-input"
        style={{ flex: 1 }}
      />
      <button type="submit" className="btn-ghost">🔍 Cari</button>
      {query && <button type="button" onClick={handleClear} className="btn-ghost">✕</button>}
    </form>
  )
}