import { defineConfig, type Options } from 'tsup'

const sharedConfig: Options = {
  clean: true,
  dts: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  onSuccess: 'cp package.json LICENSE dist',
}

const productionConfig: Options = {
  ...sharedConfig,
  minify: true,
  // tsconfig: 'tsconfig.prod.json',
  format: ['esm', 'cjs'],
}

const developmentConfig: Options = {
  ...sharedConfig,
  minify: false,
  tsconfig: 'tsconfig.json',
  format: ['esm'],
}

function getEntries() {
  return {
    'index': 'src/index.ts',
    'try-catch/index': 'src/try-catch.ts',
  }
}

export default defineConfig(options => [
  {
    ...(options.env?.NODE_ENV === 'production' ? productionConfig : developmentConfig),
    entry: getEntries(),
  },
])
