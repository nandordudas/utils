import { assert, assertType, recoverType } from '~/assert'

suite('assert', () => {
  suite('assert', () => {
    it('should narrow type after assertion', () => {
      const value: unknown = 42
      assert(typeof value === 'number')
      expectTypeOf(value).not.toBeString()
      expectTypeOf(value).toBeNumber()
    })
  })

  suite('assertType', () => {
    it('should narrow type after assertion', () => {
      const value: unknown = 42
      assertType(value, (v): v is number => typeof v === 'number')
      expectTypeOf(value).not.toBeString()
      expectTypeOf(value).toBeNumber()
    })
  })

  suite('recoverType', () => {
    it('should narrow type to union of guard type and fallback type', () => {
      const value: unknown = '42'
      const result = recoverType(value, (v): v is number => typeof v === 'number', 0)
      expectTypeOf(result).not.toBeString()
      expectTypeOf(result).toBeNumber()
    })
  })
})
