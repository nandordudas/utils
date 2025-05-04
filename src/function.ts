import type { Arrayable, DeepReadonly, Nullable } from './types'
import { isArray, isObject, isPrimitive } from './is'

export function invoke<T>(fn: () => T): T {
  return fn()
}

export function invokeAsync<T>(fn: () => Promise<T>): Promise<T> {
  return fn()
}

export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array ??= []

  return isArray(array) ? array : [array]
}

export function identity<T>(value: T): T {
  return value
}

export function noop(): void {}

export function deepFreeze<T>(value: T): DeepReadonly<T> {
  if (isPrimitive(value))
    return value

  Object.freeze(value)

  if (isObject(value))
    Object.keys(value).forEach(key => deepFreeze(value[key as keyof T]))

  return value
}

// [TODO] curry, compose, debounce, throttle
