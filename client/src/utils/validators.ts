export function validateEmail(email: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? null : 'Invalid email.'
}

export function validateName(name: string): string | null {
  return name.length > 3 ? null : 'Name must be longer than 3 characters.'
}

export function validatePassword(password: string): string | null {
  return password.length >= 8 ? null : 'Password must be at least 8 characters long.'
}

export function validateConfirmPassword(password: string, confirm: string): string | null {
  return password === confirm ? null : 'Passwords do not match.'
}
