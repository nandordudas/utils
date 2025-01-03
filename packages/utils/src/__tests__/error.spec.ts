import { raiseError } from '~/error'

suite('error', () => {
  suite('raiseError', () => {
    it('should throw Error with message', () => {
      expect(() => raiseError('test')).toThrow('test')
      expect(() => raiseError('test')).toThrow(Error)
    })

    it('should throw with custom error constructor', () => {
      expect(() => raiseError('test', TypeError)).toThrow(TypeError)
      expect(() => raiseError('test', TypeError)).toThrow('test')
    })

    it('should throw with cause', () => {
      const cause = new Error('cause')
      try {
        raiseError('test', Error, cause)
      }
      catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('test')
        expect((error as Error).cause).toBe(cause)
      }
    })

    it('should throw TypeError if message is not a string', () => {
      // @ts-expect-error: Testing runtime type check
      expect(() => raiseError(42)).toThrow(TypeError)
      // @ts-expect-error: Testing runtime type check
      expect(() => raiseError(42)).toThrow('Message must be a string')
    })

    it('should throw with custom error constructor and cause', () => {
      const cause = { code: 'TEST_ERROR' }
      try {
        raiseError('test', TypeError, cause)
      }
      catch (error) {
        expect(error).toBeInstanceOf(TypeError)
        expect((error as Error).message).toBe('test')
        expect((error as Error).cause).toBe(cause)
      }
    })

    it('should never return (type test)', () => {
      const throwError = () => {
        raiseError('test')
        return true // This line should be unreachable
      }

      expect(() => throwError()).toThrow()
    })
  })
})
