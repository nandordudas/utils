import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '~': fileURLToPath(new URL('../src', import.meta.url)),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/types.ts', 'src/**/*.spec-d.ts'],
    },
    reporters: ['default', 'verbose'],
    globals: true,
  },
})
