import type { ErrorConstructor } from './types'
import { isFunction } from './is'

export function raiseError<TError extends ErrorConstructor>(
  errorOrConstructor: TError | InstanceType<TError>,
  ...args: ConstructorParameters<TError>
): never {
  if (errorOrConstructor instanceof Error)
    throw errorOrConstructor

  throw new errorOrConstructor(...args) // eslint-disable-line new-cap
}

abstract class BaseError extends Error {
  constructor(message: string) {
    super(message)

    this.name = this.constructor.name
  }
}

export class AssertionError extends BaseError {}

export function assert<TError extends ErrorConstructor>(
  condition: boolean | (() => boolean),
  ErrorOrConstructor: TError,
  ...args: ConstructorParameters<TError>
): asserts condition {
  const result = isFunction(condition) ? condition() : condition

  if (!result)
    raiseError(ErrorOrConstructor, ...args)
}

export class NotImplementedError extends Error {
  constructor() {
    super('Not implemented')
  }
}

export function notImplemented(): never {
  throw new NotImplementedError()
}
