const objectToString = Object.prototype.toString

export function toString<T>(value: T): string /* @__PURE__ */ {
  return objectToString.call(value)
}
