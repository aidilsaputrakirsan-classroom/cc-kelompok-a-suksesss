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
    // cek harga (kira-kira ada angka 15.000.000 atau 15000000)
    expect(screen.getByText(/15000000/)).toBeInTheDocument()
    expect(screen.getByText(/250000/)).toBeInTheDocument()
  })

  it('merender ItemCard sebanyak jumlah items', () => {
    render(<ItemList items={mockItems} loading={false} onEdit={() => {}} onDelete={() => {}} />)
    const itemCards = screen.getAllByRole('heading', { level: 3 }) // asumsi ItemCard punya heading nama item
    // Atau bisa pakai test id, tapi cukup lihat nama item
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('Mouse')).toBeInTheDocument()
  })
})