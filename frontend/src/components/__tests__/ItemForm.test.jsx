import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemForm from '../ItemForm'

describe('ItemForm Component', () => {
  it('menampilkan form kosong saat tidak dalam mode edit', () => {
    render(<ItemForm onSubmit={() => {}} />)
    expect(screen.getByLabelText(/nama item/i)).toHaveValue('')
    expect(screen.getByLabelText(/harga/i)).toHaveValue('')
  })

  it('memanggil onSubmit dengan data yang benar saat submit valid', () => {
    const handleSubmit = vi.fn()
    render(<ItemForm onSubmit={handleSubmit} />)
    fireEvent.change(screen.getByLabelText(/nama item/i), { target: { value: 'Monitor' } })
    fireEvent.change(screen.getByLabelText(/harga/i), { target: { value: '2000000' } })
    fireEvent.change(screen.getByLabelText(/jumlah stok/i), { target: { value: '3' } })
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
    fireEvent.change(screen.getByLabelText(/harga/i), { target: { value: '1000' } })
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
    expect(screen.getByLabelText(/nama item/i)).toHaveValue('Laptop')
    expect(screen.getByLabelText(/harga/i)).toHaveValue('15000000')
    expect(screen.getByLabelText(/jumlah stok/i)).toHaveValue('5')
    expect(screen.getByLabelText(/deskripsi/i)).toHaveValue('Laptop gaming')
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