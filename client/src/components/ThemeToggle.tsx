import { useState, useEffect } from 'preact/hooks';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };



  return (
    <a href="#" class="secondary" onClick={toggleTheme}>
       {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        
    </a>
  );
};

export default ThemeToggle;
