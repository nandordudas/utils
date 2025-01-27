// #region Types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = Nullable<Optional<T>>

export type Awaitable<T> = T | Promise<T>

/**
 * Check built-in {@link PropertyKey}.
 */
export type Primitive = null | undefined | PropertyKey | bigint | boolean

export type UnknownRecord = Record<PropertyKey, unknown>

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonArray
export type JsonArray = JsonValue[] | readonly JsonValue[]
export type JsonObject = { [Key in string]: JsonValue }

export type Simplify<out T> = NonNullable<{ [Key in keyof T]: T[Key] }>

export type AnyFunction = (...args: any[]) => any

// export type Brand<Name, Brand extends symbol> = Name & { __brand: Brand }
// #endregion

// #region Functions
export const noop: VoidFunction = () => { }

export function identity<T>(value: T): T {
  return value
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function isDefined<T = unknown>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise
}

export function isError(value: unknown): value is Error {
  return value instanceof Error
}

export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function'
}

export function raiseError(
  message: string,
  ErrorConstructor: typeof Error = Error,
  cause?: unknown, // ES2022
) {
  throw new ErrorConstructor(message, { cause })
}

export function assertIsFunction(
  value: unknown,
  ...args: Parameters<typeof raiseError>
): asserts value is AnyFunction {
  if (!isFunction(value))
    raiseError(...args)
}
// #endregion

// #region Either
export type Either<L, R> = L | R

type BrandedType<T, Brand extends string> = T & {
  readonly _kind: Brand
  // readonly __brand: unique symbol
}

const successBrand = Symbol('success')
const failureBrand = Symbol('failure')

export type Success<T> = BrandedType<{ value: T }, 'success'> & {
  readonly [successBrand]: true
}

export type Failure<E extends Error> = BrandedType<{ error: E }, 'failure'> & {
  readonly [failureBrand]: true
}

export type Result<T, E extends Error = Error> = Either<Success<T>, Failure<E>>

export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return result._kind === 'success'
}

export function assertSuccess<T>(result: Result<T>): asserts result is Success<T> {
  if (!isSuccess(result))
    raiseError('Result is not a success')
}

export function success<T>(value: T): Success<T> {
  return { _kind: 'success', [successBrand]: true, value }
}

export function failure<E extends Error>(error: E): Failure<E> {
  return { _kind: 'failure', [failureBrand]: true, error }
}

export function tryCatch<const T>(fn: () => T): Result<T, Error>
export function tryCatch<const T>(fn: () => Promise<T>): Promise<Result<T, Error>>
export function tryCatch<const T>(fn: () => Awaitable<T>): Awaitable<Result<T, Error>> {
  assertIsFunction(fn, 'fn function must be a function', TypeError)

  try {
    const result = fn()

    return isPromise(result)
      ? result.then(success).catch(error => failure(normalizeError(error)))
      : success(result)
  }
  catch (error) {
    return failure(normalizeError(error))
  }
}

function normalizeError(value: unknown): Error {
  if (isError(value))
    return value

  return new Error(String(value))
}

interface Handlers<T, E extends Error, R> {
  readonly success: (value: T) => R
  readonly failure: (error: E) => void
}

export function match<const T, E extends Error, R>(
  result: Result<T, Error>,
  handlers: Handlers<T, E, R>,
): R | void

export function match<const T, E extends Error, R>(
  result: Promise<Result<T, E>>,
  handlers: Handlers<T, E, R>,
): Promise<R | void>

export async function match<const T, E extends Error, R>(
  result: Awaitable<Result<T, E>>,
  _handlers: Handlers<T, E, R>,
) {
  if (isPromise(result))
    return console.log('isPromise', await result) // eslint-disable-line no-console

  if (isSuccess(result))
    return console.log('isSuccess') // eslint-disable-line no-console

  return console.log('fallback') // eslint-disable-line no-console
}
// #endregion

const _asyncResult = tryCatch(() => Promise.resolve<{ foo: string }>(JSON.parse('{"foo": "bar"}')))
const _result = tryCatch(() => JSON.parse('{"foo": "bar"}') as { foo: string })

const _output = match(_asyncResult, {
  success: identity,
  failure: noop,
})
