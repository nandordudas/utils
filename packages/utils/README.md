# @nandordudas/utils

Opinionated utility functions for TypeScript projects.

## Installation

```bash
npm install @nandordudas/utils
# or
yarn add @nandordudas/utils
# or
pnpm add @nandordudas/utils
```

## Features

- Type-safe utility functions
- Zero dependencies
- Tree-shakeable
- ESM and CJS support
- Fully typed with TypeScript
- Comprehensive error handling with Result type

## Usage

### Type Guards

```typescript
import { isNumber, isObject, isString } from '@nandordudas/utils'

const value: unknown = 'hello'
if (isString(value)) {
  // value is typed as string
  console.log(value.toUpperCase())
}

const num: unknown = 42
if (isNumber(num)) {
  // num is typed as number
  console.log(num.toFixed(2))
}

const obj: unknown = { foo: 'bar' }
if (isObject(obj)) {
  // obj is typed as object
  console.log(Object.keys(obj))
}
```

### Error Handling with Result Type

```typescript
import { isSuccess, matchResult, tryCatch } from '@nandordudas/utils/try-catch'

// Synchronous error handling
const result = tryCatch(() => {
  // Some operation that might throw
  return JSON.parse('{"foo": "bar"}')
})

if (isSuccess(result))
  console.log(result.value) // { foo: 'bar' }

// Pattern matching
const output = matchResult(result, {
  success: value => value,
  failure: error => ({ error: error.message }),
})

// Async error handling
const asyncResult = await tryCatch(async () => {
  const response = await fetch('https://api.example.com')
  return response.json()
})

// Chain operations
const chainedResult = chain(asyncResult, (data) => {
  // Transform data or return failure
  return tryCatch(() => transform(data))
})
```

## API Documentation

### Type Guards

- `isString(value: unknown): value is string`
- `isNumber(value: unknown): value is number`
- `isSymbol(value: unknown): value is symbol`
- `isBoolean(value: unknown): value is boolean`
- `isBigInt(value: unknown): value is bigint`
- `isUndefined(value: unknown): value is undefined`
- `isNull(value: unknown): value is null`
- `isPrimitive(value: unknown): value is Primitive`
- `isObject(value: unknown): value is object`
- `isInstanceOf<T>(value: unknown, constructor: T): value is InstanceType<T>`

### Error Handling

- `tryCatch<T, E = Error>(fn: () => T | Promise<T>): Result<T, E> | Promise<Result<T, E>>`
- `isSuccess<T>(result: Result<T>): result is Success<T>`
- `isFailure<E>(result: Result<unknown, E>): result is Failure<E>`
- `matchResult<T, E, R>(result: Result<T, E>, patterns: ResultPatterns<T, E, R>): R`
- `getOrElse<T, E>(result: Result<T, E>, defaultValue: T): T`
- `chain<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E>`

## License

MIT
