import type { Maybe, Nullable, Primitive, UnknownRecord } from './types'

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

const primitiveTypes = new Set(['string', 'number', 'boolean', 'bigint', 'symbol', 'undefined'])

export function isPrimitive(value: unknown): value is Primitive {
  return value === null || primitiveTypes.has(typeof value)
}

export function isNullish(value: unknown): value is null | undefined {
  return value == null
}

export function isNotNull<T>(value: Nullable<T>): value is Exclude<T, null> {
  return value !== null
}

export function isNotUndefined<T>(value: Maybe<T>): value is Exclude<T, undefined> {
  return value !== undefined
}

export function isNotNullish<T>(value: Maybe<Nullable<T>>): value is Exclude<T, null | undefined> {
  return value !== null && value !== undefined
}

export function isFunction<T extends Function = Function>(value: unknown): value is T { // eslint-disable-line ts/no-unsafe-function-type
  return typeof value === 'function'
}

export function hasProperty<T = unknown>(
  value: T,
  property: PropertyKey,
  ownOnly = false,
): value is T & UnknownRecord {
  if (!isObject(value))
    return false

  return ownOnly ? Object.hasOwn(value, property) : property in value
}

export function hasProperties<K extends PropertyKey>(
  value: unknown,
  properties: readonly K[],
  ownOnly = false,
): value is Record<K, unknown> {
  if (!isObject(value))
    return false

  return properties.every(property => hasProperty(value, property, ownOnly))
}

function createTypeGuard<T extends object, K extends keyof T = keyof T>(keys: readonly K[]) {
  return (value: unknown): value is Pick<T, K> => {
    if (!isObject(value))
      return false

    return keys.every(key => hasProperty(value, key))
  }
}

export function isError(value: unknown): value is Error {
  return value instanceof Error || createTypeGuard<Error>(['stack', 'message'] as const)(value)
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (isObject(value) && 'then' in value && isFunction(value.then))
}

export function isArray<T = unknown>(value: unknown): value is Array<T> {
  return Array.isArray(value)
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return isObject(value) && Object.getPrototypeOf(value) === Object.prototype
}

export function isFiniteNumber(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value)
}
