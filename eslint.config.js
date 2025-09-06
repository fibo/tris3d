import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    ignores: [
      'node_modules/',
      '*/out/',
    ]
  },
  stylistic.configs.customize({
    braceStyle: '1tbs',
    commaDangle: 'only-multiline',
    indent: 2,
    quotes: 'single',
    quoteProps: 'as-needed',
    semi: false,
  }),
]
