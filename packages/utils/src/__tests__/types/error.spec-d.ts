import { raiseError } from '~/error'

suite('error', () => {
  suite('raiseError', () => {
    it('should have never return type', () => {
      expectTypeOf(raiseError).returns.toBeNever()
    })

    it('should accept string message', () => {
      expectTypeOf(raiseError).parameter(0).toBeString()
    })

    it.skip('should accept error constructor', () => {
      type ErrorConstructor = new (message?: string, options?: ErrorOptions) => Error
      expectTypeOf(raiseError)
        .parameter(1)
        // @ts-expect-error ErrorConstructor is not assignable to Error
        .toEqualTypeOf<ErrorConstructor | undefined>()
    })

    it('should accept unknown cause', () => {
      expectTypeOf(raiseError).parameter(2).toBeUnknown()
    })

    it('should not accept non-string message', () => {
      // @ts-expect-error: message must be string
      raiseError(42)
      // @ts-expect-error: message must be string
      raiseError(true)
      // @ts-expect-error: message must be string
      raiseError(null)
      // @ts-expect-error: message must be string
      raiseError(undefined)
    })

    it('should not accept non-error constructor', () => {
      // @ts-expect-error: must be error constructor
      raiseError('test', {})
      // @ts-expect-error: must be error constructor
      raiseError('test', () => {})
      // @ts-expect-error: must be error constructor
      raiseError('test', class Test {})
    })

    it('should work with custom error classes', () => {
      class CustomError extends Error {}
      expectTypeOf(raiseError('test', CustomError)).toBeNever()
    })

    it('should work with all error overloads', () => {
      // Basic overload
      expectTypeOf(raiseError('test')).toBeNever()

      // With error constructor
      expectTypeOf(raiseError('test', TypeError)).toBeNever()

      // With error constructor and cause
      expectTypeOf(raiseError('test', TypeError, { code: 'TEST_ERROR' })).toBeNever()
    })
  })
})
