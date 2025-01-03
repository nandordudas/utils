import {
  isBigInt,
  isBoolean,
  isInstanceOf,
  isNull,
  isNumber,
  isObject,
  isPrimitive,
  isPropertyKey,
  isSharedArrayBufferSupported,
  isString,
  isSymbol,
  isUndefined,
  isWorkerScope,
} from '~/is'

const Mock = vi.fn(() => ({
  importScripts: vi.fn(),
}))

describe('is', () => {
  beforeEach(() => {
    vi.stubGlobal('WorkerGlobalScope', Mock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('')).toBe(true)
      expect(isString('hello')).toBe(true)
      expect(isString(String('hello'))).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(42)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString({})).toBe(false)
      expect(isString([])).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(0)).toBe(true)
      expect(isNumber(42)).toBe(true)
      expect(isNumber(-1)).toBe(true)
      expect(isNumber(Number('42'))).toBe(true)
    })

    it('should return false for NaN', () => {
      expect(isNumber(Number.NaN)).toBe(false)
    })

    it('should return false for non-numbers', () => {
      expect(isNumber('42')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
      expect(isNumber({})).toBe(false)
    })
  })

  describe('isSymbol', () => {
    it('should return true for symbols', () => {
      expect(isSymbol(Symbol(''))).toBe(true)
      expect(isSymbol(Symbol('test'))).toBe(true)
    })

    it('should return false for non-symbols', () => {
      expect(isSymbol('symbol')).toBe(false)
      expect(isSymbol(42)).toBe(false)
      expect(isSymbol(null)).toBe(false)
    })
  })

  describe('isPropertyKey', () => {
    it('should return true for valid property keys', () => {
      expect(isPropertyKey('key')).toBe(true)
      expect(isPropertyKey(42)).toBe(true)
      expect(isPropertyKey(Symbol(''))).toBe(true)
    })

    it('should return false for non-property keys', () => {
      expect(isPropertyKey(null)).toBe(false)
      expect(isPropertyKey(undefined)).toBe(false)
      expect(isPropertyKey({})).toBe(false)
    })
  })

  describe('isBigInt', () => {
    it('should return true for bigints', () => {
      expect(isBigInt(BigInt(42))).toBe(true)
      expect(isBigInt(42n)).toBe(true)
    })

    it('should return false for non-bigints', () => {
      expect(isBigInt(42)).toBe(false)
      expect(isBigInt('42')).toBe(false)
      expect(isBigInt(null)).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
      expect(isBoolean(Boolean(1))).toBe(true)
    })

    it('should return false for non-booleans', () => {
      expect(isBoolean(0)).toBe(false)
      expect(isBoolean('')).toBe(false)
      expect(isBoolean(null)).toBe(false)
    })
  })

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true)
      expect(isUndefined(void 0)).toBe(true)
    })

    it('should return false for non-undefined', () => {
      expect(isUndefined(null)).toBe(false)
      expect(isUndefined('')).toBe(false)
      expect(isUndefined(0)).toBe(false)
    })
  })

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true)
    })

    it('should return false for non-null', () => {
      expect(isNull(undefined)).toBe(false)
      expect(isNull('')).toBe(false)
      expect(isNull(0)).toBe(false)
    })
  })

  describe('isPrimitive', () => {
    it('should return true for primitives', () => {
      expect(isPrimitive('string')).toBe(true)
      expect(isPrimitive(42)).toBe(true)
      expect(isPrimitive(true)).toBe(true)
      expect(isPrimitive(Symbol(''))).toBe(true)
      expect(isPrimitive(42n)).toBe(true)
      expect(isPrimitive(undefined)).toBe(true)
      expect(isPrimitive(null)).toBe(true)
    })

    it('should return false for non-primitives', () => {
      expect(isPrimitive({})).toBe(false)
      expect(isPrimitive([])).toBe(false)
      expect(isPrimitive(() => { })).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject([])).toBe(true)
      expect(isObject(new Date())).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(42)).toBe(false)
    })
  })

  describe('isInstanceOf', () => {
    class TestClass { }
    const instance = new TestClass()

    it('should return true for class instances', () => {
      expect(isInstanceOf(instance, TestClass)).toBe(true)
      expect(isInstanceOf(new Date(), Date)).toBe(true)
      expect(isInstanceOf([], Array)).toBe(true)
    })

    it('should return false for non-instances', () => {
      expect(isInstanceOf({}, TestClass)).toBe(false)
      expect(isInstanceOf(null, TestClass)).toBe(false)
      expect(isInstanceOf(undefined, TestClass)).toBe(false)
    })
  })

  describe('isWorkerScope', () => {
    it('should return false for non-worker scope', () => {
      expect(isWorkerScope(globalThis)).toBe(false)
      expect(isWorkerScope({})).toBe(false)
      expect(isWorkerScope(null)).toBe(false)
      expect(isWorkerScope(globalThis)).toBe(false)
    })
  })

  describe('isSharedArrayBufferSupported', () => {
    it('should return a boolean', () => {
      expect(typeof isSharedArrayBufferSupported()).toBe('boolean')
    })
  })
})
