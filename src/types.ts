export type Primitive = null | undefined | PropertyKey | bigint | boolean

export type UnknownRecord = Record<PropertyKey, unknown>
export type UnknownArray = readonly unknown[]

export type Simplify<T extends object> = NonNullable<{
  [Key in keyof T]: T[Key]
}>

export type Nullable<T> = T | null
export type Maybe<T> = T | undefined

export type Arrayable<T> = T | Array<T>
export type ArrayValues<T extends readonly unknown[]> = T[number]
export type ElementOf<T> = T extends (infer E)[] ? E : never

export type Brand<T, B> = T & { readonly __brand: B }

export type ErrorConstructor = new (...args: any[]) => Error

export type DeepReadonly<T> = {
  readonly [P in keyof T]: keyof T[P] extends never ? T[P] : DeepReadonly<T[P]>
}
