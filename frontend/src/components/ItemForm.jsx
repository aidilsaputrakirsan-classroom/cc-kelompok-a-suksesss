import { useState, useEffect, useRef } from "react"

function ItemForm({ onSubmit, editingItem, onCancelEdit }) {
  const [formData, setFormData] = useState({
    student_name: "",
    counselor_id: "",
    topic: "",
    method: "INDIVIDUAL",
    date: "",
    time_slot: "",
    description: "",
  })
  const [error, setError] = useState("")
  const prevEditingItemRef = useRef()

  useEffect(() => {
    if (JSON.stringify(editingItem) === JSON.stringify(prevEditingItemRef.current)) return
    prevEditingItemRef.current = editingItem

    if (editingItem) {
      setFormData({
        student_name: editingItem.student_name || "",
        counselor_id: editingItem.counselor_id || "",
        topic: editingItem.topic || "",
        method: editingItem.method || "INDIVIDUAL",
        date: editingItem.date || "",
        time_slot: editingItem.time_slot || "",
        description: editingItem.description || "",
      })
    } else {
      setFormData({
        student_name: "",
        counselor_id: "",
        topic: "",
        method: "INDIVIDUAL",
        date: "",
        time_slot: "",
        description: "",
      })
    }
    setError("")
  }, [editingItem])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.student_name.trim()) { setError("Nama lengkap wajib diisi"); return; }
    if (!formData.counselor_id) { setError("Pilih guru BK"); return; }
    if (!formData.topic) { setError("Pilih topik masalah"); return; }
    if (!formData.date) { setError("Pilih tanggal konseling"); return; }

    try {
      await onSubmit(formData, editingItem?.id)
      // Reset form
      setFormData({
        student_name: "",
        counselor_id: "",
        topic: "",
        method: "INDIVIDUAL",
        date: "",
        time_slot: "",
        description: "",
      })
      if (onCancelEdit) onCancelEdit()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ background: 'rgba(10,14,26,0.65)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(16px)', marginBottom: '24px' }}>
      <h2 className="trio-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
        {editingItem ? "✏️ Edit Pengajuan Konseling" : "📝 Ajukan Konseling Baru"}
      </h2>

      {error && <div style={{ color: '#fca5a5', fontSize: '0.85rem', marginBottom: '12px' }}>⚠ {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="cform-row">
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Nama Lengkap *</label>
            <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} className="cform-input" placeholder="Contoh: Ahmad Fauzi" />
          </div>
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Pilih Guru BK *</label>
            <select name="counselor_id" value={formData.counselor_id} onChange={handleChange} className="cform-input">
              <option value="">-- Pilih --</option>
              <option value="1">Bu Anita</option>
              <option value="2">Pak Budi</option>
              <option value="3">Bu Citra</option>
            </select>
          </div>
        </div>

        <div className="cform-row">
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Topik Masalah *</label>
            <select name="topic" value={formData.topic} onChange={handleChange} className="cform-input">
              <option value="">-- Pilih --</option>
              <option value="Belajar">Belajar</option>
              <option value="Karir">Karir</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Sosial">Sosial</option>
              <option value="Pribadi">Pribadi</option>
            </select>
          </div>
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Metode *</label>
            <select name="method" value={formData.method} onChange={handleChange} className="cform-input">
              <option value="INDIVIDUAL">Individual (1-1)</option>
              <option value="GROUP">Kelompok</option>
            </select>
          </div>
        </div>

        <div className="cform-row">
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Tanggal Konseling *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="cform-input" />
          </div>
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Waktu (Opsional)</label>
            <input type="text" name="time_slot" placeholder="Contoh: 10:00 - 11:00" value={formData.time_slot} onChange={handleChange} className="cform-input" />
          </div>
        </div>

        <div className="cform-field">
          <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Deskripsi / Cerita Singkat</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="cform-input" placeholder="Ceritakan sedikit tentang masalah Anda..."></textarea>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
          {editingItem && (
            <button type="button" onClick={onCancelEdit} className="btn-sec" style={{ padding: '10px 20px' }}>✕ Batal</button>
          )}
          <button type="submit" className="nav-cta">{editingItem ? "💾 Update Pengajuan" : "📤 Kirim Pengajuan"}</button>
        </div>
      </form>
    </div>
  )
}

export default ItemForm