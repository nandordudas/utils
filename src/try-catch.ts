import type { Brand, UnknownRecord } from './types'
import { raiseError } from './base'
import { deepFreeze } from './function'
import { isError, isObject, isPromise, isString } from './is'

export type ResultError = Brand<'ResultError', Error>

export interface Success<T> {
  readonly ok: true
  readonly value: T
  readonly error?: never
}

export interface Failure<E> {
  readonly ok: false
  readonly error: E
  readonly value?: never
}

export type Result<T, E extends ResultError = ResultError> =
  | Success<T>
  | Failure<E>

export function ok<T>(value: T): Success<T> {
  return deepFreeze({ ok: true, value }) as Success<T>
}

export function fail<E extends ResultError = ResultError>(error: E): Failure<E> {
  return deepFreeze({ ok: false, error }) as Failure<E>
}

export function isSuccess<T, E extends ResultError>(result: Result<T, E>): result is Success<T> {
  return result.ok === true
}

export function isFailure<T, E extends ResultError>(result: Result<T, E>): result is Failure<E> {
  return result.ok === false
}

function defaultErrorTransformer(error: unknown): ResultError {
  const baseError = isError(error)
    ? error
    : new Error(
      isString(error)
        ? error
        : `Unknown error: ${isObject(error)
          ? JSON.stringify(error as UnknownRecord)
          : String(error)}`,
    )

  return baseError as unknown as ResultError
}

export async function mapAsync<T, R, E extends ResultError = ResultError>(
  result: Result<T, E>,
  fn: (value: T) => Promise<R>,
): Promise<Result<R, E>> {
  return isSuccess(result)
    ? fn(result.value).then(ok)
    : result as Result<R, E>
}

export function map<T, R, E extends ResultError = ResultError>(
  result: Result<T, E>,
  fn: (value: T) => R,
): Result<R, E> {
  return isSuccess(result)
    ? ok(fn(result.value))
    : result as Result<R, E>
}

export async function flatMapAsync<T, R, E extends ResultError = ResultError, F extends ResultError = ResultError>(
  result: Result<T, E>,
  fn: (value: T) => Promise<Result<R, F>>,
): Promise<Result<R, E | F>> {
  return isSuccess(result)
    ? fn(result.value)
    : result as Result<R, E | F>
}

export function flatMap<T, R, E extends ResultError = ResultError, F extends ResultError = ResultError>(
  result: Result<T, E>,
  fn: (value: T) => Result<R, F>,
): Result<R, E | F> {
  return isSuccess(result)
    ? fn(result.value)
    : result as Result<R, E | F>
}

export function match<T, E extends ResultError, R>(
  result: Result<T, E>,
  onSuccess: (value: T) => R,
  onFailure: (error: E) => R,
): R {
  return isSuccess(result)
    ? onSuccess(result.value)
    : onFailure(result.error)
}

export function tap<T, E extends ResultError>(
  result: Result<T, E>,
  fn: (value: T) => void,
): Result<T, E> {
  if (isSuccess(result))
    fn(result.value)

  return result
}

export async function tapAsync<T, E extends ResultError>(
  result: Result<T, E>,
  fn: (value: T) => Promise<void>,
): Promise<Result<T, E>> {
  if (isSuccess(result))
    await fn(result.value)

  return result
}

export function getOrDefault<T, E extends ResultError>(
  result: Result<T, E>,
  defaultValue: T,
): T {
  return isSuccess(result)
    ? result.value
    : defaultValue
}

export function getOrThrow<T, E extends ResultError>(result: Result<T, E>): T {
  return isSuccess(result)
    ? result.value
    : isError(result.error)
      ? raiseError(result.error)
      : raiseError(Error, String(result.error))
}

function tryCatchSync<T, E extends ResultError = ResultError>(
  fn: () => T,
  errorTransformer: (error: unknown) => E = defaultErrorTransformer as (error: unknown) => E,
): Result<T, E> {
  try {
    return ok(fn())
  }
  catch (error) {
    return fail(errorTransformer(error))
  }
}

async function tryCatchAsync<T, E extends ResultError = ResultError>(
  fn: () => Promise<T>,
  errorTransformer: (error: unknown) => E = defaultErrorTransformer as (error: unknown) => E,
): Promise<Result<T, E>> {
  try {
    const value = await fn()

    return ok(value)
  }
  catch (error) {
    return fail(errorTransformer(error))
  }
}

export function tryCatch<T, E extends ResultError = ResultError>(
  fn: () => T,
  errorTransformer?: (error: unknown) => E
): Result<T, E>

export function tryCatch<T, E extends ResultError = ResultError>(
  fn: () => Promise<T>,
  errorTransformer?: (error: unknown) => E
): Promise<Result<T, E>>

export function tryCatch<T, E extends ResultError = ResultError>(
  fn: () => T | Promise<T>,
  errorTransformer: (error: unknown) => E = defaultErrorTransformer as (error: unknown) => E,
): Result<T, E> | Promise<Result<T, E>> {
  try {
    const result = fn()

    return isPromise(result)
      ? tryCatchAsync(() => result, errorTransformer)
      : tryCatchSync(() => result, errorTransformer)
  }
  catch (error) {
    return fail(errorTransformer(error))
  }
}

tryCatch.sync = tryCatchSync
tryCatch.async = tryCatchAsync
