import { useState } from 'react'

function DarkModeToggle() {
  // Lazy initialization: baca localStorage sekali saat pertama render
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true'
    // Terapkan class ke body dan shell saat pertama kali
    if (savedMode) {
      document.body.classList.add('dark-mode')
      document.querySelector('.shell')?.classList.add('dark-mode')
    }
    return savedMode
  })

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.body.classList.add('dark-mode')
      document.querySelector('.shell')?.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
      document.querySelector('.shell')?.classList.remove('dark-mode')
    }
    
    localStorage.setItem('darkMode', newMode.toString())
  }

  return (
    <button 
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  )
}

export default DarkModeToggle