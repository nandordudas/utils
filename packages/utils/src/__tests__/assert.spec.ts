import { assert, assertType, recoverType } from '~/assert'

suite('assert', () => {
  suite('assert', () => {
    it('should not throw when condition is true', () => {
      expect(() => assert(true)).not.toThrow()
    })

    it('should throw when condition is false', () => {
      expect(() => assert(false)).toThrow('Assertion failed')
    })

    it('should throw with custom message', () => {
      expect(() => assert(false, 'Custom error')).toThrow('Custom error')
    })

    it('should throw with custom error constructor', () => {
      expect(() => assert(false, 'Type error', TypeError)).toThrow(TypeError)
    })
  })

  suite('assertType', () => {
    it('should not throw when type guard passes', () => {
      const value: unknown = 42
      expect(() => assertType(value, (v): v is number => typeof v === 'number')).not.toThrow()
    })

    it('should throw when type guard fails', () => {
      const value: unknown = '42'
      expect(() => assertType(value, (v): v is number => typeof v === 'number'))
        .toThrow('Expected value to satisfy type predicate, but got string')
    })

    it('should throw with custom error constructor', () => {
      const value: unknown = '42'
      expect(() => assertType(value, (v): v is number => typeof v === 'number', TypeError)).toThrow(TypeError)
    })
  })

  suite('recoverType', () => {
    it('should return value when type guard passes', () => {
      const value: unknown = 42
      const result = recoverType(value, (v): v is number => typeof v === 'number', 0)
      expect(result).toBe(42)
    })

    it('should return fallback when type guard fails', () => {
      const value: unknown = '42'
      const result = recoverType(value, (v): v is number => typeof v === 'number', 0)
      expect(result).toBe(0)
    })
  })
})
