import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

const { pathname: rootDir } = new URL('./', import.meta.url)

export default defineConfig({
  test: {
    alias: {
      '~/': join(rootDir, 'src/'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/types.ts'],
    },
    reporters: ['default', 'verbose'],
    globals: true,
  },
})
