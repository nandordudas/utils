import type { Primitive } from '~/types'
import { hasProperty } from '~/object'

/**
 * Runtime type guard for `string` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `string`
 * @example
 * const value: unknown = 'hello'
 * isString(value) // value is narrowed to string
 */
export function isString(value: unknown): value is string /* @__PURE__ */ {
  return typeof value === 'string'
}

/**
 * Runtime type guard for `number` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `number`
 * @example
 * const value: unknown = 42
 * isNumber(value) // value is narrowed to number
 */
export function isNumber(value: unknown): value is number /* @__PURE__ */ {
  return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * Runtime type guard for `symbol` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `symbol`
 * @example
 * const value: unknown = Symbol('hello')
 * isSymbol(value) // value is narrowed to symbol
 */
export function isSymbol(value: unknown): value is symbol /* @__PURE__ */ {
  return typeof value === 'symbol'
}

/**
 * Runtime type guard for `PropertyKey` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `PropertyKey`
 * @example
 * const value: unknown = 'hello'
 * isPropertyKey(value) // value is narrowed to PropertyKey
 */
export function isPropertyKey(value: unknown): value is PropertyKey /* @__PURE__ */ {
  return (
    isString(value)
    || isNumber(value)
    || isSymbol(value)
  )
}

/**
 * Runtime type guard for `bigint` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `bigint`
 * @example
 * const value: unknown = 42n
 * isBigInt(value) // value is narrowed to bigint
 */
export function isBigInt(value: unknown): value is bigint /* @__PURE__ */ {
  return typeof value === 'bigint'
}

/**
 * Runtime type guard for `boolean` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `boolean`
 * @example
 * const value: unknown = true
 * isBoolean(value) // value is narrowed to boolean
 */
export function isBoolean(value: unknown): value is boolean /* @__PURE__ */ {
  return typeof value === 'boolean'
}

/**
 * Runtime type guard for `undefined` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `undefined`
 * @example
 * const value: unknown = undefined
 * isUndefined(value) // value is narrowed to undefined
 */
export function isUndefined(value: unknown): value is undefined /* @__PURE__ */ {
  return typeof value === 'undefined'
}

/**
 * Runtime type guard for `null` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `null`
 * @example
 * const value: unknown = null
 * isNull(value) // value is narrowed to null
 */
export function isNull(value: unknown): value is null /* @__PURE__ */ {
  return value === null
}

/**
 * Runtime type guard for `Primitive` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `Primitive`
 * @example
 * const value: unknown = 'hello'
 * isPrimitive(value) // value is narrowed to Primitive
 */
export function isPrimitive(value: unknown): value is Primitive /* @__PURE__ */ {
  return (
    isPropertyKey(value)
    || isBoolean(value)
    || isBigInt(value)
    || isUndefined(value)
    || isNull(value)
  )
}

/**
 * Runtime type guard for `object` with compile-time type narrowing.
 * @param value Value to check
 * @returns `value` is a `object`
 * @example
 * const value: unknown = {}
 * isObject(value) // value is narrowed to object
 */
export function isObject(value: unknown): value is object /* @__PURE__ */ {
  return value !== null && typeof value === 'object'
}

/**
 * Type guard for class instance checking with proper generic constraints
 * @template T Constructor type
 * @param value Value to check
 * @param constructor Constructor to check against
 * @returns `value` is an instance of `constructor`
 */
export function isInstanceOf<T extends new (...args: any[]) => any>(
  value: unknown,
  constructor: T,
): value is InstanceType<T> /* @__PURE__ */ {
  return value instanceof constructor
}

/**
 * Runtime type guard for `WorkerGlobalScope` with compile-time type narrowing.
 * @param scope Value to check
 * @returns `scope` is a `WorkerGlobalScope`
 * @example
 * /// <reference lib="WebWorker" />
 * const scope: unknown = globalThis
 * if (isWorkerScope(scope))
 *   scope.postMessage('hello')
 */
export function isWorkerScope(scope: unknown): scope is WorkerGlobalScope & typeof globalThis /* @__PURE__ */ {
  return (
    !isUndefined(WorkerGlobalScope)
    && isInstanceOf(scope, WorkerGlobalScope)
    && hasProperty(scope, 'importScripts')
  )
}

export function isSharedArrayBufferSupported(): boolean /* @__NO_SIDE_EFFECTS__ */ {
  return (
    crossOriginIsolated
    && !isUndefined(SharedArrayBuffer)
  )
}
