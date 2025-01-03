import { noop } from '~/noop'

describe('noop', () => {
  it('should return undefined', () => {
    expect(noop()).toBeUndefined()
  })

  it('should not throw when called', () => {
    expect(() => noop()).not.toThrow()
  })

  it('should be callable without arguments', () => {
    expect(() => noop()).not.toThrow()
  })
})
