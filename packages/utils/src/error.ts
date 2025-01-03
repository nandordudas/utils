import type { Constructor } from '~/types'

/**
 * Runtime assertion with compile-time type narrowing and custom error message.
 * @overload
 * @param message Error message
 * @throws {Error} When assertion fails.
 * @example
 * raiseError('Invalid value')
 */
export function raiseError(message: string): never

/**
 * Runtime assertion with compile-time type narrowing and custom error with
 * custom error message.
 * @overload
 * @param message Error message
 * @param ErrorConstructor Error constructor
 * @throws {Error} When assertion fails.
 * @example
 * raiseError('Invalid value', TypeError)
 */
export function raiseError(
  message: string,
  ErrorConstructor: Constructor<Error>,
): never

/**
 * Runtime assertion with compile-time type narrowing and custom error with
 * custom error message and cause.
 * @overload
 * @param message Error message
 * @param ErrorConstructor Error constructor
 * @param cause Error cause
 * @throws {Error} When assertion fails.
 * @example
 * raiseError('Invalid value', TypeError, { code: 'ERR_INVALID_VALUE' })
 */
export function raiseError(
  message: string,
  ErrorConstructor: Constructor<Error>,
  cause: unknown,
): never

/* @__NO_SIDE_EFFECTS__ */
export function raiseError(
  message: string,
  ErrorConstructor: Constructor<Error> = Error,
  cause?: unknown,
): never {
  if (typeof message !== 'string')
    throw new TypeError('Message must be a string')

  throw new ErrorConstructor(message, { cause })
}
