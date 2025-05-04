import antfu from '@antfu/eslint-config'

export default antfu(
  { pnpm: true },
)
  .override('antfu/stylistic/rules', {
    rules: {
      'curly': ['error', 'multi-or-nest', 'consistent'],
      'style/brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
      'style/max-len': ['error', { code: 120, ignorePattern: '.*\\n.*', ignoreComments: true, ignoreUrls: true }],
      'unicorn/numeric-separators-style': ['error', { number: { minimumDigits: 4, groupLength: 3 } }],
    },
  })
  .override('antfu/typescript/rules', {
    rules: {
      'complexity': ['error', 5],
      'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
      'ts/max-params': ['error', { max: 3 }],
    },
  })
