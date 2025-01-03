import { identity, invoke, wait } from '~/function'

suite('function', () => {
  suite('invoke', () => {
    it('should invoke function with arguments', () => {
      const fn = (a: number, b: number): number => a + b
      expect(invoke(fn, 1, 2)).toBe(3)
    })

    it('should handle function with no arguments', () => {
      const fn = () => 42
      expect(invoke(fn)).toBe(42)
    })

    it('should preserve function context', () => {
      const obj = {
        value: 42,
        getValue() {
          return this.value
        },
      }
      expect(invoke(obj.getValue.bind(obj))).toBe(42)
    })
  })

  suite('wait', () => {
    it('should wait for specified time', async () => {
      const start = performance.now()
      await wait(50)
      const duration = performance.now() - start
      expect(duration).toBeGreaterThanOrEqual(45) // Allow small timing variations
    })

    it('should handle zero duration', async () => {
      const start = Date.now()
      await wait(0)
      const duration = Date.now() - start
      expect(duration).toBeLessThan(10) // Should resolve almost immediately
    })

    it('should handle negative duration', async () => {
      const start = Date.now()
      await wait(-100)
      const duration = Date.now() - start
      expect(duration).toBeLessThan(10) // Should resolve almost immediately
    })

    it('should handle undefined duration', async () => {
      const start = Date.now()
      await wait()
      const duration = Date.now() - start
      expect(duration).toBeLessThan(10) // Should resolve almost immediately
    })
  })

  suite('identity', () => {
    it('should return primitive values unchanged', () => {
      expect(identity(42)).toBe(42)
      expect(identity('test')).toBe('test')
      expect(identity(true)).toBe(true)
      expect(identity(null)).toBe(null)
      expect(identity(undefined)).toBe(undefined)
    })

    it('should return objects unchanged', () => {
      const obj = { a: 1 }
      const arr = [1, 2, 3]

      expect(identity(obj)).toBe(obj)
      expect(identity(arr)).toBe(arr)
    })
  })
})
