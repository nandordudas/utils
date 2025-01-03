import { toString } from '~/to-string'

suite('toString', () => {
  it('should handle primitive types', () => {
    expect(toString(42)).toBe('[object Number]')
    expect(toString('test')).toBe('[object String]')
    expect(toString(true)).toBe('[object Boolean]')
    expect(toString(undefined)).toBe('[object Undefined]')
    expect(toString(null)).toBe('[object Null]')
    expect(toString(Symbol('test'))).toBe('[object Symbol]')
    expect(toString(123n)).toBe('[object BigInt]')
  })

  it('should handle objects', () => {
    expect(toString({})).toBe('[object Object]')
    expect(toString([])).toBe('[object Array]')
    expect(toString(new Date())).toBe('[object Date]')
    expect(toString(/test/)).toBe('[object RegExp]')
    expect(toString(new Map())).toBe('[object Map]')
    expect(toString(new Set())).toBe('[object Set]')
  })

  it('should handle functions', () => {
    expect(toString(() => {})).toBe('[object Function]')
    expect(toString(() => {})).toBe('[object Function]')
    expect(toString(async () => {})).toBe('[object AsyncFunction]')
    expect(toString(function* () {})).toBe('[object GeneratorFunction]')
  })

  it('should handle errors', () => {
    expect(toString(new Error('test'))).toBe('[object Error]')
    expect(toString(new TypeError('test'))).toBe('[object Error]')
  })
})
