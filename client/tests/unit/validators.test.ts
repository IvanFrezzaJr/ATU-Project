import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmPassword,
} from '../../src/utils/validators'

describe('validateEmail', () => {
  it('returns null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull()
  })
  it('returns error for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe('Invalid email.')
    expect(validateEmail('test@.com')).toBe('Invalid email.')
    expect(validateEmail('test@com')).toBe('Invalid email.')
    expect(validateEmail('')).toBe('Invalid email.')
  })
})

describe('validateName', () => {
  it('returns null for name longer than 3 chars', () => {
    expect(validateName('John')).toBeNull()
  })
  it('returns error for short name', () => {
    expect(validateName('Jo')).toBe('Name must be longer than 3 characters.')
    expect(validateName('')).toBe('Name must be longer than 3 characters.')
  })
})

describe('validatePassword', () => {
  it('returns null for password at least 8 chars', () => {
    expect(validatePassword('password')).toBeNull()
    expect(validatePassword('12345678')).toBeNull()
  })
  it('returns error for short password', () => {
    expect(validatePassword('short')).toBe('Password must be at least 8 characters long.')
    expect(validatePassword('')).toBe('Password must be at least 8 characters long.')
  })
})

describe('validateConfirmPassword', () => {
  it('returns null if passwords match', () => {
    expect(validateConfirmPassword('password', 'password')).toBeNull()
  })
  it('returns error if passwords do not match', () => {
    expect(validateConfirmPassword('password', 'passw0rd')).toBe('Passwords do not match.')
    expect(validateConfirmPassword('password', '')).toBe('Passwords do not match.')
  })
})
