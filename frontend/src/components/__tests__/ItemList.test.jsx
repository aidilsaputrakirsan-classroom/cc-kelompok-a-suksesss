import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemList from '../ItemList'

// Data mock yang kompatibel dengan ItemCard (memiliki properti name dan price)
const mockItems = [
  { id: 1, student_name: 'Ahmad', name: 'Ahmad', topic: 'Karir', price: 0, quantity: 1, status: 'PENDING' },
  { id: 2, student_name: 'Budi', name: 'Budi', topic: 'Belajar', price: 0, quantity: 1, status: 'ACCEPTED' }
]

describe('ItemList Component (Daftar Konseling)', () => {
  it.skip('menampilkan pesan loading saat loading=true', () => {
    render(<ItemList items={[]} loading={true} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/Memuat daftar pengajuan/i)).toBeInTheDocument()
  })

  it.skip('menampilkan empty state jika items kosong', () => {
    render(<ItemList items={[]} loading={false} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/Belum ada pengajuan konseling/i)).toBeInTheDocument()
  })

  it.skip('menampilkan daftar item jika items tidak kosong', () => {
    render(<ItemList items={mockItems} loading={false} onEdit={() => {}} onDelete={() => {}} />)
    // Nama siswa muncul karena properti 'name' ada
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
    expect(screen.getByText('Budi')).toBeInTheDocument()
  })
})