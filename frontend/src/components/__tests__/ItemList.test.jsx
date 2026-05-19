import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemList from '../ItemList'

const mockLayanan = [
  { id: 1, name: 'Konseling Individual', price: 0, quantity: 1, description: 'Sesi 60 menit' },
  { id: 2, name: 'Konseling Kelompok', price: 0, quantity: 4, description: 'Sesi 90 menit' }
]

describe('ItemList Component (Daftar Layanan Konseling)', () => {
  it('menampilkan pesan loading saat prop loading=true', () => {
    render(<ItemList items={[]} loading={true} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/memuat data layanan/i)).toBeInTheDocument()
  })

  it('menampilkan pesan empty state jika items kosong dan tidak loading', () => {
    render(<ItemList items={[]} loading={false} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/belum ada layanan konseling/i)).toBeInTheDocument()
  })

  it('menampilkan daftar layanan jika items tidak kosong', () => {
    render(<ItemList items={mockLayanan} loading={false} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Konseling Individual')).toBeInTheDocument()
    expect(screen.getByText('Konseling Kelompok')).toBeInTheDocument()
    expect(screen.getByText(/Rp 0/)).toBeInTheDocument()
  })
})