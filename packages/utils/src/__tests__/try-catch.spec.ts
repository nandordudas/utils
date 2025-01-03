import type { TypedFn } from '~/types'
import {
  chain,
  getOrElse,
  isFailure,
  isSuccess,
  matchResult,
  tryCatch,
} from '~/try-catch'

describe('try-catch', () => {
  describe('tryCatch', () => {
    it('should handle sync success', () => {
      const syncFn: TypedFn<[], number> = () => 42
      const result = tryCatch(syncFn)
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result))
        expect(result.value).toBe(42)
    })

    it('should handle sync failure', () => {
      const error = new Error('test error')
      const syncFn: TypedFn<[], number> = () => {
        throw error
      }
      const result = tryCatch(syncFn)
      expect(isFailure(result)).toBe(true)
      if (isFailure(result))
        expect(result.error).toBe(error)
    })

    it('should handle async success', async () => {
      const asyncFn: TypedFn<[], Promise<number>> = () => Promise.resolve(42)
      const result = await tryCatch(asyncFn)
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result))
        expect(result.value).toBe(42)
    })

    it('should handle async failure', async () => {
      const error = new Error('test error')
      const asyncFn: TypedFn<[], Promise<number>> = () => Promise.reject(error)
      const result = await tryCatch(asyncFn)
      expect(isFailure(result)).toBe(true)
      if (isFailure(result))
        expect(result.error).toBe(error)
    })
  })

  describe('matchResult', () => {
    it('should match success case', () => {
      const syncFn: TypedFn<[], number> = () => 42
      const result = tryCatch(syncFn)
      const matched = matchResult(result, {
        success: value => value * 2,
        failure: () => 0,
      })
      expect(matched).toBe(84)
    })

    it('should match failure case', () => {
      const syncFn: TypedFn<[], string> = () => {
        throw new Error('test error')
      }
      const result = tryCatch(syncFn)
      const matched = matchResult(result, {
        success: value => value,
        failure: (error: Error) => error.message,
      })
      expect(matched).toBe('test error')
    })

    it('should throw if missing handlers', () => {
      const syncFn: TypedFn<[], number> = () => 42
      const result = tryCatch(syncFn)
      expect(() => matchResult(result, {} as any)).toThrow('missing.join is not a function')
    })
  })

  describe('getOrElse', () => {
    it('should return value for success', () => {
      const syncFn: TypedFn<[], number> = () => 42
      const result = tryCatch(syncFn)
      expect(getOrElse(result, 0)).toBe(42)
    })

    it('should return default for failure', () => {
      const syncFn: TypedFn<[], number> = () => {
        throw new Error('test error')
      }
      const result = tryCatch(syncFn)
      expect(getOrElse(result, 0)).toBe(0)
    })
  })

  describe('chain', () => {
    it('should chain success results', () => {
      const syncFn: TypedFn<[], number> = () => 42
      const result = tryCatch(syncFn)
      const chained = chain(result, value => tryCatch(() => value * 2))
      expect(isSuccess(chained)).toBe(true)
      if (isSuccess(chained))
        expect(chained.value).toBe(84)
    })

    it('should not chain failure results', () => {
      const error = new Error('test error')
      const syncFn: TypedFn<[], number> = () => {
        throw error
      }
      const result = tryCatch(syncFn)
      const chained = chain(result, value => tryCatch(() => value * 2))
      expect(isFailure(chained)).toBe(true)
      if (isFailure(chained))
        expect(chained.error).toBe(error)
    })
  })
})
