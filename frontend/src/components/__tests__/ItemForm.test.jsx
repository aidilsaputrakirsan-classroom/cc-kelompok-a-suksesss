import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemForm from '../ItemForm'

describe('ItemForm Component (Layanan Konseling)', () => {
  it('menampilkan form kosong saat tidak dalam mode edit', () => {
    render(<ItemForm onSubmit={() => {}} />)
    expect(screen.getByPlaceholderText('Contoh: Konseling Individual')).toHaveValue('')
    expect(screen.getByPlaceholderText('Contoh: 0 (gratis)')).toHaveValue('')
  })

  it('memanggil onSubmit dengan data yang benar saat submit valid', () => {
    const handleSubmit = vi.fn()
    render(<ItemForm onSubmit={handleSubmit} />)
    fireEvent.change(screen.getByPlaceholderText('Contoh: Konseling Individual'), { target: { value: 'Konseling Individual' } })
    fireEvent.change(screen.getByPlaceholderText('Contoh: 0 (gratis)'), { target: { value: '0' } })
    fireEvent.change(screen.getByPlaceholderText('Durasi, metode, dll.'), { target: { value: 'Sesi 60 menit' } })
    fireEvent.change(screen.getByDisplayValue('0'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: /tambah layanan/i }))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Konseling Individual', price: 0, quantity: 1 }),
      undefined
    )
  })

  it('menampilkan error jika nama layanan kosong', () => {
    const handleSubmit = vi.fn()
    render(<ItemForm onSubmit={handleSubmit} />)
    fireEvent.change(screen.getByPlaceholderText('Contoh: 0 (gratis)'), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /tambah layanan/i }))
    expect(handleSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/nama layanan wajib diisi/i)).toBeInTheDocument()
  })

  it('menampilkan data awal saat mode edit (layanan konseling)', () => {
    const editingItem = {
      id: 1,
      name: 'Konseling Kelompok',
      price: 0,
      quantity: 4,
      description: 'Sesi 90 menit'
    }
    render(<ItemForm editingItem={editingItem} onSubmit={() => {}} />)
    expect(screen.getByDisplayValue('Konseling Kelompok')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Sesi 90 menit')).toBeInTheDocument()
  })

  it('memanggil onCancelEdit jika tombol batal diklik (mode edit)', () => {
    const handleCancel = vi.fn()
    const editingItem = { id: 1, name: 'Konseling', price: 0, quantity: 1 }
    render(<ItemForm editingItem={editingItem} onSubmit={() => {}} onCancelEdit={handleCancel} />)
    const cancelBtn = screen.getByRole('button', { name: /batal/i })
    fireEvent.click(cancelBtn)
    expect(handleCancel).toHaveBeenCalled()
  })
})