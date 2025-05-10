export function validateEmail(email: string): string | null {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? null : 'Email inválido.';
  }
  
  export function validateName(name: string): string | null {
    return name.length > 3 ? null : 'Nome deve ter mais de 3 caracteres.';
  }
  
  export function validatePassword(password: string): string | null {
    return password.length >= 8 ? null : 'Senha deve ter no mínimo 8 caracteres.';
  }
  
  export function validateConfirmPassword(password: string, confirm: string): string | null {
    return password === confirm ? null : 'As senhas não coincidem.';
  }
  