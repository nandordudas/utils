# @nandordudas/utils

A collection of opinionated utility functions for TypeScript projects, focusing on type safety
and robust error handling.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Type Guards](#type-guards)
  - [Error Handling](#error-handling)
- [Development](#development)
- [License](#license)

## Features

- 🛡️ **Type-safe**: Fully typed with TypeScript for maximum safety
- 📦 **Zero dependencies**: No external runtime dependencies
- 🌳 **Tree-shakeable**: Import only what you need
- 🔄 **ESM and CJS**: Support for all JavaScript environments
- ⚡ **Lightweight**: Minimal bundle size impact
- 🔒 **Error handling**: Built-in Result type for safe error handling

## Installation

```bash
# pnpm
pnpm add @nandordudas/utils

# npm
npm install @nandordudas/utils

# yarn
yarn add @nandordudas/utils
```

## Usage

### Type Guards

Type-safe runtime type checking utilities:

```typescript
import { isNumber, isObject, isString } from '@nandordudas/utils'

// String type guard
const text: unknown = 'hello'
if (isString(text))
  console.log(text.toUpperCase()) // TypeScript knows text is string

// Number type guard
const num: unknown = 42
if (isNumber(num))
  console.log(num.toFixed(2)) // TypeScript knows num is number

// Object type guard
const data: unknown = { name: 'John', age: 30 }
if (isObject(data))
  console.log(Object.keys(data)) // TypeScript knows data is object
```

### Error Handling

Robust error handling with Result type:

```typescript
import {
  chain,
  isSuccess,
  matchResult,
  tryCatch
} from '@nandordudas/utils/try-catch'

// Synchronous operations
const parseResult = tryCatch(() => JSON.parse('{"name": "John"}'))

if (isSuccess(parseResult))
  console.log(parseResult.value.name) // Type-safe access

// Pattern matching
const output = matchResult(parseResult, {
  success: value => ({ data: value }),
  failure: error => ({ error: error.message }),
})

// Async operations
async function fetchData() {
  const result = await tryCatch(async () => {
    const response = await fetch('https://api.example.com/data')
    return response.json()
  })

  // Chain operations safely
  return chain(result, data =>
    tryCatch(() => processData(data)))
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build package
pnpm build

# Generate documentation
pnpm docs
```

## License

MIT
