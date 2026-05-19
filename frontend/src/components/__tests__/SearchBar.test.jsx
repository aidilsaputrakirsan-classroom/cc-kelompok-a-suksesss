import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from '../SearchBar'

describe('SearchBar Component', () => {
  it('menampilkan input dan tombol search', () => {
    render(<SearchBar onSearch={() => {}} />)
    expect(screen.getByPlaceholderText(/cari layanan konseling/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cari/i })).toBeInTheDocument()
  })

  it('memanggil onSearch dengan query saat form disubmit', () => {
    const handleSearch = vi.fn()
    render(<SearchBar onSearch={handleSearch} />)
    const input = screen.getByPlaceholderText(/cari layanan konseling/i)
    fireEvent.change(input, { target: { value: 'individual' } })
    fireEvent.submit(input.closest('form'))
    expect(handleSearch).toHaveBeenCalledWith('individual')
  })

  it('menampilkan tombol clear jika query tidak kosong', () => {
    render(<SearchBar onSearch={() => {}} />)
    const input = screen.getByPlaceholderText(/cari layanan konseling/i)
    fireEvent.change(input, { target: { value: 'kelompok' } })
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it('tombol clear menghapus query dan memanggil onSearch dengan string kosong', () => {
    const handleSearch = vi.fn()
    render(<SearchBar onSearch={handleSearch} />)
    const input = screen.getByPlaceholderText(/cari layanan konseling/i)
    fireEvent.change(input, { target: { value: 'pribadi' } })
    const clearBtn = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearBtn)
    expect(input.value).toBe('')
    expect(handleSearch).toHaveBeenCalledWith('')
  })
})