import type { TypedFn } from '~/types'

/**
 * Invokes a function with given arguments.
 * @template Args Arguments to invoke the function with
 * @template Return Return value of the function
 * @param fn Function to invoke
 * @param args Arguments to invoke the function with
 * @returns The return value of the function
 * @example
 * const fn = (a: number, b: number): number => a + b
 * invoke(fn, 1, 2) // 3
 * invoke(fn, ...[1, 2]) // 3
 */
export function invoke<Args extends Parameters<TypedFn>, Return>(
  fn: TypedFn<Args, Return>,
  ...args: Args
): Return /* @__PURE__ */ {
  return fn(...args)
}

/**
 * Waits for a given amount of time.
 * @param ms Milliseconds to wait. Should be greater than `0`
 * or `0` will be used.
 * @returns A promise that resolves after the given amount of time
 * @example
 * await wait(1_000) // waits for 1 second
 * wait(1_000).then(() => console.log('waited for 1 second'))
 */
export function wait(ms: number = 0): Promise<void> /* @__NO_SIDE_EFFECTS__ */ {
  const { promise, resolve } = Promise.withResolvers<void>()

  if (ms <= 0)
    ms = 0

  setTimeout(resolve, ms)

  return promise
}

/**
 * Returns the same value.
 * @template T Type of value to return
 * @param value Value to return
 * @returns The same value
 * @example
 * Array.from([1, 2, 3]).map(identity) // [1, 2, 3]
 */
export function identity<T>(value: T): T /* @__NO_SIDE_EFFECTS__ */ {
  return value
}
