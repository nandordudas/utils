import { getProperty, hasProperties, hasProperty } from '~/object'

suite('object types', () => {
  suite('hasProperty', () => {
    it('should narrow type in strict mode', () => {
      const obj = { id: 1, name: undefined } as const
      if (hasProperty(obj, 'name', { strict: true }))
        assertType<never>(obj.name)
    })

    it('should preserve type in non-strict mode', () => {
      const obj = { id: 1, name: undefined } as const
      if (hasProperty(obj, 'name'))
        assertType<undefined>(obj.name)
    })
  })

  suite('hasProperties', () => {
    it('should narrow types in strict mode', () => {
      const obj = { id: 1, name: undefined } as const
      if (hasProperties(obj, ['id', 'name'], { strict: true })) {
        assertType<1>(obj.id)
        assertType<undefined>(obj.name)
      }
    })

    it('should preserve types in non-strict mode', () => {
      const obj = { id: 1, name: undefined } as const
      if (hasProperties(obj, ['id', 'name'])) {
        assertType<1>(obj.id)
        assertType<undefined>(obj.name)
      }
    })
  })

  suite('getProperty', () => {
    it('should return correct type for existing property', () => {
      const obj = { id: 1, name: 'test' } as const
      expectTypeOf(getProperty(obj, 'id')).toEqualTypeOf<1 | undefined>()
      expectTypeOf(getProperty(obj, 'name')).toEqualTypeOf<'test' | undefined>()
    })

    it('should handle undefined properties', () => {
      const obj = { id: 1, optional: undefined } as const
      expectTypeOf(getProperty(obj, 'optional')).toEqualTypeOf<undefined>()
      expectTypeOf(getProperty(obj, 'optional', { strict: true })).toEqualTypeOf<undefined>()
    })
  })
})
