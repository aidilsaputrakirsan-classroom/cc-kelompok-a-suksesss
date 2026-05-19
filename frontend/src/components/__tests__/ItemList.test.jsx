import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemList from '../ItemList'

const mockItems = [
  { id: 1, name: 'Laptop', price: 15000000, quantity: 2 },
  { id: 2, name: 'Mouse', price: 250000, quantity: 5 }
]

describe('ItemList Component', () => {
  it('menampilkan pesan loading saat prop loading=true', () => {
    render(<ItemList items={[]} loading={true} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/memuat data/i)).toBeInTheDocument()
  })

  it('menampilkan pesan empty state jika items kosong dan tidak loading', () => {
    render(<ItemList items={[]} loading={false} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/belum ada item/i)).toBeInTheDocument()
  })

  it('menampilkan daftar item jika items tidak kosong', () => {
    render(<ItemList items={mockItems} loading={false} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('Mouse')).toBeInTheDocument()
    // Harga dengan format Rp 15.000.000 (ada titik pemisah ribuan)
    expect(screen.getByText(/Rp 15\.000\.000/)).toBeInTheDocument()
    expect(screen.getByText(/Rp 250\.000/)).toBeInTheDocument()
  })
})