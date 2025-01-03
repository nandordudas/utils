import type {
  AbstractConstructor,
  Constructor,
  Primitive,
  TypedFn,
  TypePredicate,
} from '~/types'

// Primitive type tests
const _str: Primitive = 'string'
const _num: Primitive = 123
const _bool: Primitive = true
const _sym: Primitive = Symbol('test')
const _bigInt: Primitive = BigInt(123)
const _undef: Primitive = undefined
const _nil: Primitive = null

expectTypeOf<Primitive>().toEqualTypeOf<
  string | number | boolean | symbol | bigint | undefined | null
>()

// Constructor type tests
abstract class AbstractBase {
  abstract method(): void
}
class Concrete extends AbstractBase {
  method(): void {
    //
  }
}

expectTypeOf<AbstractConstructor<AbstractBase>>().toMatchTypeOf<
  typeof AbstractBase
>()
expectTypeOf<Constructor<Concrete>>().toMatchTypeOf<typeof Concrete>()

// TypedFn tests
const noArgsVoid: TypedFn = () => {}
const withArgsString: TypedFn<[string, number], string> = (str, num) =>
  `${str}${num}`

expectTypeOf(noArgsVoid).returns.toBeVoid()
expectTypeOf(withArgsString).parameter(0).toBeString()
expectTypeOf(withArgsString).parameter(1).toBeNumber()
expectTypeOf(withArgsString).returns.toBeString()

// TypePredicate tests
const isString: TypePredicate<string> = (value): value is string =>
  typeof value === 'string'

declare const unknown: unknown
if (isString(unknown))
  expectTypeOf(unknown).toBeString()
