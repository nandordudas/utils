export type Primitive = string | number | boolean | symbol | bigint | undefined | null

export type AbstractConstructor<Return = void> = abstract new (...args: any[]) => Return
export type Constructor<Return = void> = new (...args: any[]) => Return

export type TypedFn<Args extends any[] = any[], Return = void> = (...args: Args) => Return

export type TypePredicate<Output> = (value: unknown) => value is Output
