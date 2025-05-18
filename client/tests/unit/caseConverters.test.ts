import { describe, it, expect } from 'vitest'
import { snakeToCamel, camelToSnake } from '../../src/utils/caseConverters'

describe('caseConverters', () => {
  describe('snakeToCamel', () => {
    it('converts snake_case keys to camelCase', () => {
      const input = { first_key: 1, second_key: 2 }
      const output = snakeToCamel(input)
      expect(output).toEqual({ firstKey: 1, secondKey: 2 })
    })

    it('handles nested objects', () => {
      const input = { outer_key: { inner_key: 3 } }
      const output = snakeToCamel(input)
      expect(output).toEqual({ outerKey: { innerKey: 3 } })
    })

    it('handles arrays of objects', () => {
      const input = [{ some_key: 1 }, { another_key: 2 }]
      const output = snakeToCamel(input)
      expect(output).toEqual([{ someKey: 1 }, { anotherKey: 2 }])
    })

    it('returns primitives as is', () => {
      expect(snakeToCamel(42)).toBe(42)
      expect(snakeToCamel('test')).toBe('test')
      expect(snakeToCamel(null)).toBe(null)
    })
  })

  describe('camelToSnake', () => {
    it('converts camelCase keys to snake_case', () => {
      const input = { firstKey: 1, secondKey: 2 }
      const output = camelToSnake(input)
      expect(output).toEqual({ first_key: 1, second_key: 2 })
    })

    it('handles nested objects', () => {
      const input = { outerKey: { innerKey: 3 } }
      const output = camelToSnake(input)
      expect(output).toEqual({ outer_key: { inner_key: 3 } })
    })

    it('handles arrays of objects', () => {
      const input = [{ someKey: 1 }, { anotherKey: 2 }]
      const output = camelToSnake(input)
      expect(output).toEqual([{ some_key: 1 }, { another_key: 2 }])
    })

    it('returns primitives as is', () => {
      expect(camelToSnake(42)).toBe(42)
      expect(camelToSnake('test')).toBe('test')
      expect(camelToSnake(null)).toBe(null)
    })
  })
})
