type NonOptional<T> = T extends undefined ? never : T

type StrictPropertyCheck<T, K extends keyof T> = T & {
  [P in K]: NonOptional<T[P]>
}

interface PropertyCheckOptions {
  strict: boolean | undefined
}

/**
 * Type guard for checking object property existence and validity.
 * @param obj Target object to check
 * @param key Property key to validate
 * @param options Validation options
 * @returns Type predicate indicating property existence
 * @example
 * const data = { id: 1, name: undefined }
 * if (hasProperty(data, 'name', { strict: true }))
 *   data.name // type is never
 */
/* @__PURE__ */
export function hasProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  options: PropertyCheckOptions = { strict: false },
): obj is StrictPropertyCheck<T, K> {
  const hasValidOwnership: boolean = Object.hasOwn(obj, key)
  const meetsStrictCheck: boolean = !options.strict || obj[key] !== undefined

  return hasValidOwnership && meetsStrictCheck
}

/**
 * Type guard for checking multiple object property existence and validity.
 * @param obj Target object to check
 * @param keys Property keys to validate
 * @param options Validation options
 * @returns Type predicate indicating property existence
 * @example
 * const data = { id: 1, name: undefined }
 * if (hasProperties(data, ['name', 'id'], { strict: true }))
 *   data.name // type is undefined
 */
/* @__PURE__ */
export function hasProperties<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
  options?: PropertyCheckOptions,
): obj is StrictPropertyCheck<T, K> {
  return keys.every(key => hasProperty(obj, key, options))
}

/**
 * Get property value if it exists and is valid.
 * @param obj Target object to check
 * @param key Property key to validate
 * @param options Validation options
 * @returns Property value if it exists and is valid
 * @example
 * const data = { id: 1, name: undefined }
 * getProperty(data, 'name', { strict: true }) // type is undefined
 */
/* @__NO_SIDE_EFFECTS__ */
export function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  options?: PropertyCheckOptions,
): StrictPropertyCheck<T, K>[K] | undefined {
  return hasProperty(obj, key, options)
    ? obj[key]
    : undefined
}
