import { identity, invoke, wait } from '~/function'

suite('function types', () => {
  suite('invoke', () => {
    it('should preserve function parameter types', () => {
      const fn = (a: number, b: string) => ({ a, b })
      const result = invoke(fn, 1, 'test')

      assertType<{ a: number, b: string }>(result)
      expectTypeOf(result).toMatchTypeOf<{ a: number, b: string }>()
    })

    it('should preserve void return type', () => {
      const fn = () => {
        /* void */
      }
      const result = invoke(fn)

      assertType<void>(result)
      expectTypeOf(result).toBeVoid()
    })

    it('should handle async functions', () => {
      const fn = async (x: number) => x * 2
      const result = invoke(fn, 21)

      assertType<Promise<number>>(result)
      expectTypeOf(result).toMatchTypeOf<Promise<number>>()
    })
  })

  suite('wait', () => {
    it('should return Promise<void>', () => {
      const result = wait(100)
      assertType<Promise<void>>(result)
      expectTypeOf(result).toMatchTypeOf<Promise<void>>()
    })

    it('should accept optional parameter', () => {
      const result = wait()
      assertType<Promise<void>>(result)
    })
  })

  suite('identity', () => {
    it('should preserve exact input type', () => {
      const numResult = identity(42)
      const strResult = identity('test')
      const objResult = identity({ a: 1 })
      const literalResult = identity('literal' as const)

      assertType<number>(numResult)
      assertType<string>(strResult)
      assertType<{ a: number }>(objResult)
      assertType<'literal'>(literalResult)

      expectTypeOf(numResult).toBeNumber()
      expectTypeOf(strResult).toBeString()
      expectTypeOf(objResult).toMatchTypeOf<{ a: number }>()
      expectTypeOf(literalResult).toBeString()
    })

    it('should preserve union types', () => {
      const result = identity<string | number>('test')
      assertType<string | number>(result)
      expectTypeOf(result).toMatchTypeOf<string | number>()
    })
  })
})
