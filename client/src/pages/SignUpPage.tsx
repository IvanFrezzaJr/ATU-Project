/** @jsxImportSource preact */
import { useState } from 'preact/hooks'
import { FormField } from '../components/FormField'
import { GlobalMessage } from '../components/GlobalMessage'
import { Link, useLocation } from 'wouter-preact'

import {
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators'
import { useFormErrors } from '../hooks/useFormErrors'
import styles from '../styles/Auth.module.css'
import { login, registerUser } from '../services/authService'

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [, navigate] = useLocation()

  const { errors, setFieldError, clearFieldError, setErrors } = useFormErrors<typeof form>()
  const [globalMessage, setGlobalMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement

    setForm({ ...form, [target.name]: target.value })
  }

  const handleBlur = (field: string) => {
    let error = ''
    if (field === 'name') error = validateName(form.name) || ''
    if (field === 'email') error = validateEmail(form.email) || ''
    if (field === 'password') error = validatePassword(form.password) || ''
    if (field === 'confirmPassword')
      error = validateConfirmPassword(form.password, form.confirmPassword) || ''

    if (error) {
      setFieldError(field as keyof typeof form, error)
    } else {
      clearFieldError(field as keyof typeof form)
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    // Validar tudo no frontend
    const nameErr = validateName(form.name)
    const emailErr = validateEmail(form.email)
    const passErr = validatePassword(form.password)
    const confirmErr = validateConfirmPassword(form.password, form.confirmPassword)

    if (nameErr || emailErr || passErr || confirmErr) {
      setErrors({
        name: nameErr || '',
        email: emailErr || '',
        password: passErr || '',
        confirmPassword: confirmErr || '',
      })
      setGlobalMessage({ type: 'error', text: 'Error validating the form.' })
      return
    }

    try {
      const user = await registerUser(form.name, form.email, form.password)

      console.log('Authenticated user:', user)
      await login(form.email, form.password)
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error signup:', error.message)
        setGlobalMessage({ type: 'error', text: error.message })
      } else {
        console.error('Unknown error:', error)
        setGlobalMessage({ type: 'error', text: 'Unknown error' })
      }
      return
    }

    setGlobalMessage({ type: 'success', text: 'Registration completed successfully!' })
  }

  return (
    <main>
      <div class={styles.content}>
        <div class="viewport">
          <h1 class={styles.center}>Sign Up</h1>
          <p class={styles.center}>
            Have an account?{' '}
            <Link href="/Login" aria-label="Login website">
              Sign In
            </Link>
          </p>

          {globalMessage && (
            <GlobalMessage
              type={globalMessage.type}
              message={globalMessage.text}
              onClose={() => setGlobalMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <FormField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              aria-label="Enter your full name"
            />
            <FormField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              aria-label="Enter your email address"
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              aria-label="Enter your password"
            />
            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              error={errors.confirmPassword}
              aria-label="Confirm your password"
            />

            <button type="submit" aria-label="Submit registration form">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
