import type { Constructor, TypePredicate } from '~/types'
import { raiseError } from '~/error'

/**
 * Runtime assertion with compile-time type narrowing.
 * @overload
 * @param condition Assertion condition
 * @throws {Error} When assertion fails.
 * @example
 * const value: unknown = 42
 * assert(typeof value === 'number')
 * value.toFixed() // value is narrowed to number
 */
export function assert(condition: unknown): asserts condition

/**
 * Runtime assertion with compile-time type narrowing and custom error message.
 * @overload
 * @param condition Assertion condition
 * @param message Error message
 * @throws {Error} When assertion fails.
 * @example
 * const value: unknown = 42
 * assert(typeof value === 'number', 'Value is not a number')
 * value.toFixed() // value is narrowed to number
 */
export function assert(
  condition: unknown,
  message: string,
): asserts condition

/**
 * Runtime assertion with compile-time type narrowing and custom error with
 * custom error message.
 * @overload
 * @param condition Assertion condition
 * @param message Error message
 * @param ErrorConstructor Error constructor
 * @throws {Error} When assertion fails.
 * @example
 * const value: unknown = 42
 * assert(typeof value === 'number', 'Value is not a number', TypeError)
 * value.toFixed() // value is narrowed to number
 */
export function assert(
  condition: unknown,
  message: string,
  ErrorConstructor: Constructor<Error>,
  // [INFO] cause parameter could be added in the future, ESLint rule need to be updated
): asserts condition

/* @__NO_SIDE_EFFECTS__ */
export function assert(
  condition: unknown,
  message: string = 'Assertion failed',
  ErrorConstructor: Constructor<Error> = Error,
): asserts condition {
  if (!condition)
    raiseError(message, ErrorConstructor)
}

/**
 * Runtime assertion with compile-time type narrowing.
 * @remark Use {@link recoverType} instead if possible.
 * @template T Type to narrow
 * @param value Value to assert
 * @param guard Assertion condition
 * @throws {TypeError} When assertion fails.
 * @example
 * const value: unknown = 42
 * assertType(value, typeof value === 'number')
 * value.toFixed() // value is narrowed to number
 */
export function assertType<T>(
  value: unknown,
  guard: TypePredicate<T>,
): asserts value is T

/**
 * Runtime assertion with custom error message.
 * @remark Use {@link recoverType} instead if possible.
 * @template T Type to narrow
 * @param value Value to assert
 * @param guard Assertion condition
 * @param ErrorConstructor Error constructor
 * @throws {TypeError} When assertion fails.
 * @example
 * const value: unknown = 42
 * assertType(value, typeof value === 'number', TypeError)
 * value.toFixed() // value is narrowed to number
 */
export function assertType<T>(
  value: unknown,
  guard: TypePredicate<T>,
  ErrorConstructor: Constructor<TypeError>,
): asserts value is T

/* @__NO_SIDE_EFFECTS__ */
export function assertType<T>(
  value: unknown,
  guard: TypePredicate<T>,
  ErrorConstructor: Constructor<TypeError> = TypeError,
): asserts value is T {
  assert(
    guard(value),
    `Expected value to satisfy type predicate, but got ${typeof value}`,
    ErrorConstructor,
  )
}

/**
 * Runtime assertion with compile-time type narrowing.
 * @template T Type to narrow and used with
 * @template F Fallback type
 * @param value Value to assert
 * @param guard Assertion condition
 * @param fallback Fallback value
 * @returns `value` is a `T` or `F`
 * @example
 * const value: unknown = 42
 * recoverType(value, typeof value === 'number', 0)
 * value.toFixed() // value is narrowed to number
 */
/* @__PURE__ */
export function recoverType<T, F>(
  value: unknown,
  guard: TypePredicate<T>,
  fallback: F extends T ? F : never,
): T | F {
  try {
    assertType(value, guard)

    return value
  }
  catch {
    return fallback
  }
}
