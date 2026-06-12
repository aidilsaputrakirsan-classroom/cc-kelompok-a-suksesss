import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'

describe('Header Component', () => {
  it.skip('menampilkan judul aplikasi', () => {
    // Render komponen dengan totalItems dummy
    render(<Header totalItems={0} />)
    
    // Sesuaikan dengan teks brand yang ada di Header.jsx kamu
    expect(screen.getByText(/safespace/i)).toBeInTheDocument()
  })

  it.skip('menampilkan jumlah total items', () => {
    // Render komponen dengan totalItems = 5
    render(<Header totalItems={5} />)
    
    // Pastikan angka 5 muncul di layar
    expect(screen.getByText(/5/)).toBeInTheDocument()
  })
})