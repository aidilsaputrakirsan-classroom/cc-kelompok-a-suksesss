import { useState, useEffect } from "react"

function ItemForm({ onSubmit, editingItem, onCancelEdit }) {
  const [formData, setFormData] = useState({ name: "", description: "", price: "", quantity: "0" })
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description || "",
        price: String(editingItem.price),
        quantity: String(editingItem.quantity),
      })
    } else {
      setFormData({ name: "", description: "", price: "", quantity: "0" })
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

    if (!formData.name.trim()) { setError("Nama item wajib diisi"); return; }
    if (!formData.price || parseFloat(formData.price) <= 0) { setError("Harga harus lebih dari 0"); return; }

    const itemData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
    }

    try {
      await onSubmit(itemData, editingItem?.id)
      setFormData({ name: "", description: "", price: "", quantity: "0" })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ background: 'rgba(10,14,26,0.65)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px', backdropFilter: 'blur(16px)', marginBottom: '24px' }}>
      <h2 className="trio-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
        {editingItem ? "✏️ Edit Item" : "➕ Tambah Item Baru"}
      </h2>

      {error && <div style={{ color: '#fca5a5', fontSize: '0.85rem', marginBottom: '12px' }}>⚠ {error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="cform-row">
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Nama Item *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="cform-input" placeholder="Contoh: Laptop" />
          </div>
          <div className="cform-field">
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Harga (Rp) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="cform-input" placeholder="Contoh: 15000000" />
          </div>
        </div>

        <div className="cform-row">
          <div className="cform-field" style={{ flex: 2 }}>
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Deskripsi</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="cform-input" placeholder="Opsional" />
          </div>
          <div className="cform-field" style={{ flex: 1 }}>
            <label style={{ color: 'rgba(220,215,255,0.7)', fontSize: '0.8rem' }}>Jumlah Stok</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="cform-input" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
          {editingItem && (
            <button type="button" onClick={onCancelEdit} className="btn-sec" style={{ padding: '10px 20px' }}>✕ Batal</button>
          )}
          <button type="submit" className="nav-cta">{editingItem ? "💾 Update Item" : "➕ Tambah Item"}</button>
        </div>
      </form>
    </div>
  )
}

export default ItemForm;