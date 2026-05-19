import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemForm from '../ItemForm'

describe('ItemForm Component', () => {
  it('menampilkan form kosong saat tidak dalam mode edit', () => {
    render(<ItemForm onSubmit={() => {}} />)
    // Gunakan regex untuk placeholder, tidak case-sensitive
    const nameInput = screen.getByPlaceholderText(/contoh: laptop/i)
    const priceInput = screen.getByPlaceholderText(/contoh: 15000000/i)
    expect(nameInput).toBeInTheDocument()
    expect(priceInput).toBeInTheDocument()
    expect(nameInput).toHaveValue('')
    expect(priceInput).toHaveValue('')
  })

  it('memanggil onSubmit dengan data yang benar saat submit valid', async () => {
    const handleSubmit = vi.fn()
    render(<ItemForm onSubmit={handleSubmit} />)
    fireEvent.change(screen.getByPlaceholderText(/contoh: laptop/i), { target: { value: 'Monitor' } })
    fireEvent.change(screen.getByPlaceholderText(/contoh: 15000000/i), { target: { value: '2000000' } })
    fireEvent.change(screen.getByPlaceholderText(/opsional/i), { target: { value: 'Monitor 24 inch' } })
    // Input quantity biasanya default '0', cari berdasarkan display value
    const quantityInput = screen.getByDisplayValue('0')
    fireEvent.change(quantityInput, { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: /tambah item/i }))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Monitor', price: 2000000, quantity: 3 }),
      undefined
    )
  })

  it('menampilkan error jika nama item kosong', () => {
    const handleSubmit = vi.fn()
    render(<ItemForm onSubmit={handleSubmit} />)
    fireEvent.change(screen.getByPlaceholderText(/contoh: 15000000/i), { target: { value: '1000' } })
    fireEvent.click(screen.getByRole('button', { name: /tambah item/i }))
    expect(handleSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/nama item wajib diisi/i)).toBeInTheDocument()
  })

  it('menampilkan data awal saat mode edit', () => {
    const editingItem = {
      id: 1,
      name: 'Laptop',
      price: 15000000,
      quantity: 5,
      description: 'Laptop gaming'
    }
    render(<ItemForm editingItem={editingItem} onSubmit={() => {}} />)
    expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15000000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Laptop gaming')).toBeInTheDocument()
  })

  it('memanggil onCancelEdit jika tombol batal diklik (mode edit)', () => {
    const handleCancel = vi.fn()
    const editingItem = { id: 1, name: 'Item', price: 100, quantity: 1 }
    render(<ItemForm editingItem={editingItem} onSubmit={() => {}} onCancelEdit={handleCancel} />)
    const cancelBtn = screen.getByRole('button', { name: /batal/i })
    fireEvent.click(cancelBtn)
    expect(handleCancel).toHaveBeenCalled()
  })
})