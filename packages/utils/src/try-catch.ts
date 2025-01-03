import type { TypedFn } from '~/types'
import { raiseError } from '~/error'
import { isInstanceOf } from '~/is'

interface Success<T> {
  readonly ok: true
  readonly value: T
}

interface Failure<E> {
  readonly ok: false
  readonly error: E
}

/**
 * @template T Result type
 * @template E Error type
 * @see {@link Success}
 * @see {@link Failure}
 * @example
 * const result: Result<number> = { ok: true, value: 42 }
 * const result: Result<number, Error> = { ok: false, error: new Error('foo') }
 */
export type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * Returns true if the result is a success.
 * @template T Result type
 * @param result Result to check
 * @returns `result` is a success
 * @example
 * isSuccess({ ok: true, value: 42 }) // true
 * isSuccess({ ok: false, error: new Error('foo') }) // false
 */
export function isSuccess<T>(result: Result<T>): result is Success<T> /* @__PURE__ */ {
  return result.ok === true
}

/**
 * Returns true if the result is a failure.
 * @template E Error type
 * @param result Result to check
 * @returns `result` is a failure
 * @example
 * isFailure({ ok: true, value: 42 }) // false
 * isFailure({ ok: false, error: new Error('foo') }) // true
 */
export function isFailure<E>(result: Result<unknown, E>): result is Failure<E> /* @__PURE__ */ {
  return result.ok === false
}

class ResultMatchError extends Error {
  constructor(missing: string[]) {
    super(`Missing handlers: ${missing.join(', ')}`)
  }
}

interface ResultPatterns<T, E, R> {
  success: (value: T) => R
  failure: (error: E) => R
}

/**
 * Matches a result against a set of patterns.
 * @template T Result type
 * @template E Error type
 * @template R Return type
 * @param result Result to match
 * @param patterns Patterns to match against
 * @returns `result` matches `patterns`
 * @throws {Error} When no patterns provided
 * @example
 * matchResult(createSuccess(42), {
 *   success: result => result, // 42
 *   failure: error => error, // undefined
 * })
 *
 * matchResult(createFailure(new Error('foo')), {
 *   success: result => result, // undefined
 *   failure: error => error, // Error
 * })
 */
export function matchResult<T, E, R>(
  result: Result<T, E>,
  patterns: ResultPatterns<T, E, R>,
): R /* @__PURE__ */ {
  if (!patterns.success || !patterns.failure)
    raiseError('Unhandled cases', ResultMatchError)

  return result.ok
    ? patterns.success(result.value)
    : patterns.failure(result.error)
}

function createSuccess<T>(value: T): Success<T> /* @__PURE__ */ {
  return {
    ok: true,
    value,
  }
}

function createFailure<E>(error: E): Failure<E> /* @__PURE__ */ {
  return {
    ok: false,
    error,
  }
}

/**
 * Wraps an async function in a try-catch block.
 * @overload
 * @template T Result type
 * @template E Error type
 * @param fn Function to wrap
 * @returns Wrapped function
 * @example
 * tryCatch(() => Promise.resolve(42)) // { ok: true, value: 42 }
 * tryCatch(() => Promise.reject(new Error('foo'))) // { ok: false, error: Error: foo }
 */
export function tryCatch<T, E = Error>(fn: TypedFn<[], T | Promise<T>>): Promise<Result<T, E>>

/**
 * Wraps a sync function in a try-catch block.
 * @overload
 * @param fn Function to wrap
 * @returns Wrapped function
 * @example
 * tryCatch(() => 42) // { ok: true, value: 42 }
 * tryCatch(() => { throw new Error('foo') }) // { ok: false, error: Error: foo }
 */
export function tryCatch<T, E = Error>(fn: TypedFn<[], T>): Result<T, E>

export function tryCatch<T, E = Error>(
  fn: TypedFn<[], T | Promise<T>>,
): Result<T, E> | Promise<Result<T, E>> /* @__NO_SIDE_EFFECTS__ */ {
  try {
    const result: T | Promise<T> = fn()

    return isInstanceOf(result, Promise)
      ? result.then(createSuccess).catch(createFailure)
      : createSuccess(result)
  }
  catch (error) {
    return createFailure(error as E)
  }
}

/**
 * Returns the value of the result if it is a success, otherwise returns `defaultValue`.
 * @template T Result type
 * @template E Error type
 * @param result Result to get value from
 * @param defaultValue Value to return if result is a failure
 * @returns `result.value` if `result` is a success, otherwise `defaultValue`
 * @example
 * getOrElse(createSuccess(42), 0) // 42
 * getOrElse(createFailure(new Error('foo')), 0) // 0
 */
export function getOrElse<T, E>(
  result: Result<T, E>,
  defaultValue: T,
): T {
  return result.ok
    ? result.value
    : defaultValue
}

/**
 * Chains a function over the value of a success result.
 * @template U Mapped type
 * @template E Error type
 * @template T Result type
 * @param result Result to map
 * @param fn Function to map value with
 * @returns Result with mapped value
 * @example
 * chain(createSuccess(42), value => createSuccess(value + 1)) // { ok: true, value: 43 }
 * chain(createFailure(new Error('foo')), value => createSuccess(value + 1)) // { ok: false, error: Error: foo }
 */
export function chain<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok
    ? fn(result.value)
    : result
}
