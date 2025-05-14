// src/utils/caseConverters.ts

export const snakeToCamel = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as unknown as T
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const camelKey = key.replace(/_([a-z])/g, (_, g) => g.toUpperCase())
        acc[camelKey] = snakeToCamel(value)
        return acc
      },
      {} as Record<string, unknown>
    ) as T
  }

  return obj
}

export const camelToSnake = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake) as unknown as T
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        acc[snakeKey] = camelToSnake(value)
        return acc
      },
      {} as Record<string, unknown>
    ) as T
  }

  return obj
}
