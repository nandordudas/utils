import { toString } from '~/to-string'

suite('toString types', () => {
  it('should always return string type', () => {
    expectTypeOf(toString(42)).toBeString()
    expectTypeOf(toString('test')).toBeString()
    expectTypeOf(toString({})).toBeString()
    expectTypeOf(toString([])).toBeString()
    expectTypeOf(toString(new Date())).toBeString()
    expectTypeOf(toString(() => {})).toBeString()
    expectTypeOf(toString(undefined)).toBeString()
    expectTypeOf(toString(null)).toBeString()
  })

  it('should preserve input type parameter', () => {
    const num = 42
    const str = 'test'
    const obj = { test: true }

    expectTypeOf<Parameters<typeof toString>[0]>().toEqualTypeOf<unknown>()
    expectTypeOf(toString(num)).toEqualTypeOf<string>()
    expectTypeOf(toString(str)).toEqualTypeOf<string>()
    expectTypeOf(toString(obj)).toEqualTypeOf<string>()
  })
})
