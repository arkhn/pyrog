/**
 * New Stratumn Typescript eslint-config
 */

module.exports = {
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    mocha: true,
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['src/generated'],
  rules: {
    'no-underscore-dangle': 0,
    'no-debugger': 1,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'object-shorthand': 1,
    'class-methods-use-this': 1,
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],

    /**
     * Newly added
     */
    '@typescript-eslint/no-unused-vars': 2,
    'import/no-named-as-default-member': 0,
    'import/no-named-default': 0,
    'no-self-compare': 0,
    'no-new': 0,
    'no-shadow': 0,
    'no-case-declarations': 0,
    camelcase: 0,
  },
  overrides: [
    {
      files: '*.test.ts',
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
}
