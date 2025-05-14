import { render } from 'preact'
// import './index.css'
import { App } from './app.tsx'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'

render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('app')!
)
