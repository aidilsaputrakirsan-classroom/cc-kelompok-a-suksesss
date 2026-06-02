import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ItemForm from '../ItemForm'

describe('ItemForm Component (Pengajuan Konseling)', () => {
  it('menampilkan form kosong saat tidak dalam mode edit', () => {
    render(<ItemForm onSubmit={() => {}} />)
    expect(screen.getByPlaceholderText(/Contoh: Ahmad Fauzi/)).toHaveValue('')
  })

  it('memanggil onSubmit dengan data yang benar saat submit valid', () => {
    const handleSubmit = vi.fn()
    const { container } = render(<ItemForm onSubmit={handleSubmit} />)
    
    // Isi nama
    fireEvent.change(screen.getByPlaceholderText(/Contoh: Ahmad Fauzi/), { target: { value: 'Siti' } })
    
    // Pilih Guru BK (select pertama)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })   // Bu Anita
    
    // Pilih Topik Masalah (select kedua)
    fireEvent.change(selects[1], { target: { value: 'Belajar' } })
    
    // Isi tanggal menggunakan querySelector berdasarkan name
    const dateInput = container.querySelector('input[name="date"]')
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } })
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Kirim Pengajuan/i }))
    
    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        student_name: 'Siti',
        counselor_id: '1',
        topic: 'Belajar',
        date: '2025-12-31'
      }),
      undefined
    )
  })

  it('menampilkan error jika nama kosong', () => {
    const handleSubmit = vi.fn()
    render(<ItemForm onSubmit={handleSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: /Kirim Pengajuan/i }))
    expect(screen.getByText(/Nama lengkap wajib diisi/i)).toBeInTheDocument()
  })
})