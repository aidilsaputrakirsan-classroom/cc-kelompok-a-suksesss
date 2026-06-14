// frontend/src/components/ItemForm.jsx
import { useState, useEffect } from 'react'
import RetryButton from './RetryButton'

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8001'
const ITEM_API_URL = import.meta.env.VITE_ITEM_API_URL || 'http://localhost:8002'

async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options)
    if (response.status === 503) {
      const error = new Error('Service temporarily unavailable')
      error.type = 'service-down'
      throw error
    }
    if (response.status === 401) {
      sessionStorage.removeItem('bkToken')
      const error = new Error('Session expired')
      error.type = 'auth-error'
      throw error
    }
    return response
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error('Cannot connect to backend server')
      networkError.type = 'network-error'
      throw networkError
    }
    throw error
  }
}

function Required() {
  return <span style={{ color: 'var(--clr-purple)', marginLeft: '2px' }}>*</span>
}

export default function ItemForm({ mode = 'consultation', addToast, editingItem, onCancelEdit }) {
  const FALLBACK = {
    school_classes: [{ id: 1, name: 'X-A' }, { id: 2, name: 'X-B' }, { id: 3, name: 'XI IPA 1' }, { id: 4, name: 'XI IPS 1' }, { id: 5, name: 'XII IPA 1' }],
    topics: [{ id: 1, name: 'Belajar' }, { id: 2, name: 'Karir' }, { id: 3, name: 'Keluarga' }, { id: 4, name: 'Sosial' }, { id: 5, name: 'Pribadi' }],
    time_slots: [{ id: 1, name: 'Istirahat ke-1', start_time: '10:00', end_time: '10:30' }, { id: 2, name: 'Istirahat ke-2', start_time: '12:00', end_time: '12:30' }, { id: 3, name: 'Pulang Sekolah', start_time: '14:00', end_time: '15:30' }],
    places: [{ id: 1, name: 'Ruang BK 1' }, { id: 2, name: 'Ruang BK 2' }, { id: 3, name: 'Online' }],
    counselors: [{ id: 1, name: 'Bu Anita' }, { id: 2, name: 'Pak Budi' }, { id: 3, name: 'Bu Citra' }],
  }

  const [opts, setOpts] = useState({ ...FALLBACK })
  const [optsLoading, setOL] = useState(true)
  const [optsError, setOE] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [f, setF] = useState({ nama: '', phone: '', classId: '', gender: '', counselorId: '', method: 'INDIVIDUAL', topicId: '', date: '', timeSlotId: '', placeId: '' })

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setOL(true)
      setOE('')
      try {
        const [mRes, cRes] = await Promise.all([
          safeFetch(`${ITEM_API_URL}/api/public/master-data`),
          safeFetch(`${ITEM_API_URL}/api/public/counselors`),
        ])
        if (!mRes.ok || !cRes.ok) throw new Error('Gagal memuat opsi')
        const [master, counselors] = await Promise.all([mRes.json(), cRes.json()])
        if (cancelled) return
        const timeSlots = (master.time_slots || []).map(s => ({
          ...s,
          label: s.start_time ? `${s.name} (${s.start_time}–${s.end_time})` : s.name,
        }))
        const o = {
          school_classes: master.school_classes || FALLBACK.school_classes,
          topics: master.topics || FALLBACK.topics,
          time_slots: timeSlots.length ? timeSlots : FALLBACK.time_slots,
          places: master.places || FALLBACK.places,
          counselors: counselors.length ? counselors : FALLBACK.counselors,
        }
        setOpts(o)
        setF(p => ({
          ...p,
          classId: String(o.school_classes[0]?.id ?? ''),
          topicId: String(o.topics[0]?.id ?? ''),
          timeSlotId: String(o.time_slots[0]?.id ?? ''),
          placeId: String(o.places[0]?.id ?? ''),
          counselorId: String(o.counselors[0]?.id ?? ''),
        }))
      } catch {
        if (!cancelled) {
          setOE('Data dinamis gagal dimuat, menggunakan data bawaan.')
          setF(p => ({ ...p, classId: '1', topicId: '1', timeSlotId: '1', placeId: '1', counselorId: '1' }))
        }
      } finally {
        if (!cancelled) setOL(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async () => {
    if (!f.nama || !f.phone || !f.gender || !f.date || !f.classId || !f.counselorId || !f.topicId || !f.timeSlotId || !f.placeId) {
      alert('Harap isi semua kolom wajib!')
      return
    }
    setLoading(true)
    setSubmitError(null)
    try {
      const res = await safeFetch(`${ITEM_API_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: f.nama.trim(),
          class_id: parseInt(f.classId),
          gender: f.gender,
          student_phone: f.phone.trim(),
          counselor_id: parseInt(f.counselorId),
          method: f.method,
          topic_id: parseInt(f.topicId),
          date: f.date,
          time_slot_id: parseInt(f.timeSlotId),
          place_id: parseInt(f.placeId),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = typeof data.detail === 'string' ? data.detail : Array.isArray(data.detail) ? data.detail.map(e => e.message || e.msg).join(', ') : 'Pengajuan gagal'
        setSubmitError({ type: 'api-error', message: msg })
        return
      }
      setDone(data)
      if (addToast) addToast('Pengajuan berhasil dikirim', 'success')
    } catch (error) {
      let msg = 'Terjadi kesalahan. Silakan coba lagi.'
      if (error.type === 'service-down') msg = 'Layanan konsultasi sedang tidak tersedia. Silakan coba lagi dalam beberapa saat.'
      else if (error.type === 'network-error') msg = 'Tidak dapat terhubung ke server. Pastikan koneksi internet Anda stabil.'
      setSubmitError({ type: error.type || 'unknown', message: msg })
      if (addToast) addToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="register-success">
        <div className="success-ring">🎉</div>
        <div className="success-title">Pengajuan Terkirim!</div>
        <p className="success-sub">Simpan kode berikut untuk memantau status konseling kamu.</p>
        <div className="success-code-box">
          <span className="success-code-label">Kode Pelacak</span>
          <span className="success-code-value">{done.tracking_code}</span>
        </div>
        <button className="btn-ghost" onClick={() => { setDone(null); setF(p => ({ ...p, nama: '', phone: '', gender: '', date: '' })) }} style={{ marginTop: '8px' }}>
          Ajukan Lagi
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {optsError && <div className="alert alert-warn"><span className="alert-icon">⚠️</span>{optsError}</div>}
      {submitError && (
        <div className="error-box">
          <div className="error-box__header">
            <span className="error-box__icon">{submitError.type === 'network-error' ? '🔌' : '⚠️'}</span>
            <div className="error-box__content">
              <div className="error-box__title">Gagal Mengirim</div>
              <div className="error-box__message">{submitError.message}</div>
            </div>
          </div>
          <div className="error-box__actions">
            <RetryButton onRetry={handleSubmit} isLoading={loading} />
            <button className="error-box__dismiss-btn" onClick={() => setSubmitError(null)}>Tutup</button>
          </div>
        </div>
      )}
      <div className="input-group">
        <label>Nama Lengkap <Required /></label>
        <input className="f-input" placeholder="Siapa namamu?" value={f.nama} onChange={e => set('nama', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="input-group">
          <label>Nomor WhatsApp <Required /></label>
          <input className="f-input" type="tel" placeholder="+6281234567890" value={f.phone} onChange={e => set('phone', e.target.value)} />
          <span className="field-hint">Format +62 wajib digunakan</span>
        </div>
        <div className="input-group">
          <label>Jenis Kelamin <Required /></label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['MALE', '♂ Laki-laki'], ['FEMALE', '♀ Perempuan']].map(([val, label]) => (
              <button key={val} type="button" onClick={() => set('gender', val)} style={{ flex: 1, padding: '12px 8px', borderRadius: '11px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s', background: f.gender === val ? 'rgba(124,58,237,.22)' : 'var(--clr-surface-2)', border: `1px solid ${f.gender === val ? 'rgba(124,58,237,.45)' : 'var(--clr-border)'}`, color: f.gender === val ? '#c4b5fd' : 'var(--clr-text-2)' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label>Kelas <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.classId} onChange={e => set('classId', e.target.value)} disabled={optsLoading}>
              {opts.school_classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label>Guru BK <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.counselorId} onChange={e => set('counselorId', e.target.value)} disabled={optsLoading}>
              {opts.counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="form-row">
        <div className="input-group">
          <label>Metode Konseling <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.method} onChange={e => set('method', e.target.value)}>
              <option value="INDIVIDUAL">Individual (1-1)</option>
              <option value="GROUP">Kelompok</option>
            </select>
          </div>
        </div>
        <div className="input-group">
          <label>Topik Masalah <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.topicId} onChange={e => set('topicId', e.target.value)} disabled={optsLoading}>
              {opts.topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="input-group">
        <label>Tanggal Konseling <Required /></label>
        <input type="date" className="f-input" value={f.date} min={new Date().toISOString().split('T')[0]} onChange={e => set('date', e.target.value)} />
      </div>
      <div className="form-row">
        <div className="input-group">
          <label>Waktu <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.timeSlotId} onChange={e => set('timeSlotId', e.target.value)} disabled={optsLoading}>
              {opts.time_slots.map(t => <option key={t.id} value={t.id}>{t.label || t.name}</option>)}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label>Tempat <Required /></label>
          <div className="f-select-wrap">
            <select className="f-input" value={f.placeId} onChange={e => set('placeId', e.target.value)} disabled={optsLoading}>
              {opts.places.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <button className="btn-form-submit" onClick={handleSubmit} disabled={loading || optsLoading}>
        {(loading || optsLoading) && <span className="btn-spinner" />}
        {optsLoading ? 'Memuat data form...' : loading ? 'Mengirim...' : '📤 Kirim Pengajuan'}
      </button>
    </div>
  )
}