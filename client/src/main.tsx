import { render } from 'preact'
// import './index.css'
import { App } from './app'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'

render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('app')!
)
