import { useState, useEffect } from 'preact/hooks'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

const ThemeToggle = () => {
  // Tenta pegar o tema do localStorage, ou usa o modo claro como padrão
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme : 'light'
  })

  // Atualiza o tema no documento e no localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    // Salva o tema no localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <a href="#" class="secondary" onClick={toggleTheme}>
      {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </a>
  )
}

export default ThemeToggle
