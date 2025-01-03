import { getProperty, hasProperties, hasProperty } from '~/object'

suite('object', () => {
  suite('hasProperty', () => {
    const testObj = { id: 1, name: 'test', optional: undefined }

    it('should return true for existing property', () => {
      expect(hasProperty(testObj, 'id')).toBe(true)
    })

    it('should return true for undefined property in non-strict mode', () => {
      expect(hasProperty(testObj, 'optional')).toBe(true)
    })

    it('should return false for undefined property in strict mode', () => {
      expect(hasProperty(testObj, 'optional', { strict: true })).toBe(false)
    })

    it('should return false for non-existent property', () => {
      expect(hasProperty(testObj, 'nonexistent' as keyof typeof testObj)).toBe(false)
    })
  })

  suite('hasProperties', () => {
    const testObj = { id: 1, name: 'test', optional: undefined }

    it('should return true when all properties exist', () => {
      expect(hasProperties(testObj, ['id', 'name'])).toBe(true)
    })

    it('should return true for undefined properties in non-strict mode', () => {
      expect(hasProperties(testObj, ['id', 'optional'])).toBe(true)
    })

    it('should return false for undefined properties in strict mode', () => {
      expect(hasProperties(testObj, ['id', 'optional'], { strict: true })).toBe(false)
    })

    it('should return false when any property does not exist', () => {
      expect(hasProperties(testObj, ['id', 'nonexistent' as keyof typeof testObj])).toBe(false)
    })
  })

  suite('getProperty', () => {
    const testObj = { id: 1, name: 'test', optional: undefined }

    it('should return value for existing property', () => {
      expect(getProperty(testObj, 'id')).toBe(1)
    })

    it('should return undefined for non-existent property', () => {
      expect(getProperty(testObj, 'nonexistent' as keyof typeof testObj)).toBeUndefined()
    })

    it('should return undefined for undefined property in strict mode', () => {
      expect(getProperty(testObj, 'optional', { strict: true })).toBeUndefined()
    })

    it('should return undefined for undefined property in non-strict mode', () => {
      expect(getProperty(testObj, 'optional')).toBeUndefined()
    })
  })
})
