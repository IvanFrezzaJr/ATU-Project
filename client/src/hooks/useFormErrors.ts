import { useState } from 'preact/hooks';

export function useFormErrors<T extends Record<string, string | string[] | number>>() {
  const [errors, setErrors] = useState<Partial<T>>({});

  function setFieldError(field: keyof T, message: string) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function clearFieldError(field: keyof T) {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  return { errors, setFieldError, clearFieldError, setErrors };
}
