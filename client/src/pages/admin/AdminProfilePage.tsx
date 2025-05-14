/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks'
import { useLocation } from 'wouter-preact'
import { getCurrentUser, updateUser } from '../../services/authService'
import { searchAddress } from '../../services/addressService'
import { uploadImage } from '../../services/itemService'

import { FormField } from '../../components/FormField'
import { GlobalMessage } from '../../components/GlobalMessage'

import { useAuth } from '../../context/AuthContext'
import { useFormErrors } from '../../hooks/useFormErrors'
import { validateEmail, validateName, validatePassword } from '../../utils/validators'

import styles from '../../styles/Auth.module.css'
import { UserUpdate } from '../../types/user'

const apiUrl = import.meta.env.VITE_API_URL

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
    street: '',
    city: '',
    state: '',
    postalcode: '',
    country: '',
  })

  const [initialForm, setInitialForm] = useState<typeof form | null>(null)

  const [addressLoading, setAddressLoading] = useState(false)
  const [globalMessage, setGlobalMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [, navigate] = useLocation()
  const { user, token } = useAuth()
  const { errors, setFieldError, clearFieldError, setErrors } = useFormErrors<typeof form>()

  useEffect(() => {
    if (!user) return

    const fetchUser = async () => {
      const currentUser = await getCurrentUser(user.id)
      const populatedForm = {
        name: currentUser.name,
        email: currentUser.email,
        password: '',
        image: currentUser.image ?? '',
        street: currentUser.street ?? '',
        city: currentUser.city ?? '',
        state: currentUser.state ?? '',
        postalcode: currentUser.postalcode ?? '',
        country: currentUser.country ?? '',
      }
      setForm(populatedForm)
      setInitialForm(populatedForm)
    }

    fetchUser()
  }, [user])

  const handleChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement

    setForm({ ...form, [target.name]: target.value })
  }

  const handleBlur = (field: keyof typeof form) => {
    if (!initialForm) return

    let error = ''

    if (field === 'name' && form.name !== initialForm.name) error = validateName(form.name) || ''
    if (field === 'email' && form.email !== initialForm.email)
      error = validateEmail(form.email) || ''
    if (field === 'password' && form.password) error = validatePassword(form.password) || ''

    if (error) {
      setFieldError(field as keyof typeof form, error)
    } else {
      clearFieldError(field as keyof typeof form)
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!user || !token) return navigate('/login')

    const nameErr = form.name !== initialForm?.name ? validateName(form.name) : ''
    const emailErr = form.email !== initialForm?.email ? validateEmail(form.email) : ''
    const passwordErr = form.password ? validatePassword(form.password) : ''

    if (nameErr || emailErr || passwordErr) {
      setErrors({
        name: nameErr || '',
        email: emailErr || '',
        password: passwordErr || '',
        image: '',
        street: '',
        city: '',
        state: '',
        postalcode: '',
        country: '',
      })
      setGlobalMessage({ type: 'error', text: 'Erro na validação do formulário.' })
      return
    }

    try {
      const payload: UserUpdate = {
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        image: form.image || undefined,
        street: form.street || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        postalcode: form.postalcode || undefined,
        country: form.country || undefined,
      }

      await updateUser(user.id, payload, token)
      setGlobalMessage({ type: 'success', text: 'Profile updated successfully!' })
      navigate('/')
    } catch (error) {
      console.error('Error updating user:', error)
      setGlobalMessage({ type: 'error', text: 'Error updating profile.' })
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const path = await uploadImage(file)
      setForm({ ...form, image: path })
    } catch (err) {
      console.error('Failed to upload image:', err)
      setGlobalMessage({ type: 'error', text: 'Error sending image.' })
    }
  }

  const handleSearchAddress = async () => {
    if (!form.street) return
    try {
      setAddressLoading(true)
      const address = await searchAddress(form.street)
      setAddressLoading(false)
      if (!address) return

      setForm({
        ...form,
        street: address.street,
        city: address.city,
        state: address.state,
        postalcode: address.postalcode,
        country: address.country,
      })
    } catch (err) {
      console.error('Error searching address:', err)
      setGlobalMessage({ type: 'error', text: 'Erro ao buscar endereço.' })
    }
  }

  return (
    <main>
      <div class="viewport">
        <h1 class={styles.center}>Profile</h1>

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
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            error={errors.email}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            error={errors.password}
          />

          <label for="file">User Image</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file) handleImageUpload(file)
            }}
          />

          {form.image && <img src={`${apiUrl}${form.image}`} alt="Profile" width="100" />}

          <h2 class={styles.center}>Address</h2>

          <FormField label="Street" name="street" value={form.street} onChange={handleChange} />
          <button type="button" onClick={handleSearchAddress}>
            {addressLoading ? 'Loading...' : 'Search'}
          </button>

          <FormField label="City" name="city" value={form.city} onChange={handleChange} />
          <FormField label="State" name="state" value={form.state} onChange={handleChange} />
          <FormField
            label="Postal Code"
            name="postalcode"
            value={form.postalcode}
            onChange={handleChange}
          />
          <FormField label="Country" name="country" value={form.country} onChange={handleChange} />

          <button type="submit">Update</button>
        </form>
      </div>
    </main>
  )
}
