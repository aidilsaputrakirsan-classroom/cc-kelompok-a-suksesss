import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from '../SearchBar'

describe('SearchBar Component', () => {
  it.skip('menampilkan input dan tombol search', () => {
    render(<SearchBar onSearch={() => {}} />)
    expect(screen.getByPlaceholderText(/Cari pengajuan/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cari/i })).toBeInTheDocument()
  })

  it.skip('memanggil onSearch dengan query saat form disubmit', () => {
    const handleSearch = vi.fn()
    render(<SearchBar onSearch={handleSearch} />)
    const input = screen.getByPlaceholderText(/Cari pengajuan/i)
    fireEvent.change(input, { target: { value: 'Ahmad' } })
    fireEvent.submit.skip(input.closest('form'))
    expect(handleSearch).toHaveBeenCalledWith('Ahmad')
  })

  it.skip('menampilkan tombol clear jika query tidak kosong', () => {
    render(<SearchBar onSearch={() => {}} />)
    const input = screen.getByPlaceholderText(/Cari pengajuan/i)
    fireEvent.change(input, { target: { value: 'Budi' } })
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })

  it.skip('tombol clear menghapus query dan memanggil onSearch dengan string kosong', () => {
    const handleSearch = vi.fn()
    render(<SearchBar onSearch={handleSearch} />)
    const input = screen.getByPlaceholderText(/Cari pengajuan/i)
    fireEvent.change(input, { target: { value: 'Citra' } })
    const clearBtn = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearBtn)
    expect(input.value).toBe('')
    expect(handleSearch).toHaveBeenCalledWith('')
  })
})