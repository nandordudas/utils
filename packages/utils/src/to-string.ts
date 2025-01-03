const objectToString = Object.prototype.toString

/* @__NO_SIDE_EFFECTS__ */
export function toString<T>(value: T): string {
  return objectToString.call(value)
}
