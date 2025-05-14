import { camelToSnake } from '../utils/caseConverters'
import { UserLogin, UserUpdate } from '../types/user'

const apiUrl = import.meta.env.VITE_API_URL
const authUrl = `${apiUrl}/auth`
const userUrl = `${apiUrl}/users`

export const login = async (email: string, password: string): Promise<UserLogin> => {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await fetch(`${authUrl}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || 'Error logging in')
  }

  return await response.json()
}

export const logout = async () => {
  const response = await fetch(`${authUrl}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) throw new Error('Erro logout')
}

export const getCurrentUser = async (userId: string) => {
  const response = await fetch(`${userUrl}/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) throw new Error('Error getting user')
  return await response.json()
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<UserUpdate> => {
  const response = await fetch(`${userUrl}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(`Error registering user: ${data.error}`)
  }

  return await response.json()
}

export const updateUser = async (
  userId: string,
  updates: Partial<UserUpdate>,
  token: string
): Promise<UserUpdate> => {
  const response = await fetch(`${userUrl}/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(camelToSnake(updates)),
  })

  if (!response.ok) throw new Error('Error updating user')
  return await response.json()
}

export const fetchUser = async (token: string) => {
  const response = await fetch(`${authUrl}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) throw new Error('Failed to fetch user')
  return await response.json()
}
