import { useState, useEffect } from 'react'

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Cek localStorage saat component mount
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode === 'true') {
      setIsDarkMode(true)
      document.body.classList.add('dark-mode')
      document.querySelector('.shell')?.classList.add('dark-mode')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    // Toggle class di body dan shell
    if (newMode) {
      document.body.classList.add('dark-mode')
      document.querySelector('.shell')?.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
      document.querySelector('.shell')?.classList.remove('dark-mode')
    }
    
    // Simpan ke localStorage
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