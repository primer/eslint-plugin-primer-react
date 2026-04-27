'use strict'

const js = require('@eslint/js')
const globals = require('globals')
const prettierPlugin = require('eslint-plugin-prettier')
const eslintComments = require('@eslint-community/eslint-plugin-eslint-comments')
const noOnlyTestsPlugin = require('eslint-plugin-no-only-tests')

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
module.exports = [
  {
    ignores: ['node_modules/**', '.git/**'],
  },
  js.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      'eslint-comments': eslintComments,
      'no-only-tests': noOnlyTestsPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.commonjs,
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-disable': 'error',
      'eslint-comments/no-unused-enable': 'error',
      'eslint-comments/no-use': ['error', {allow: ['eslint', 'eslint-disable-next-line', 'eslint-env', 'globals']}],
      'no-only-tests/no-only-tests': [
        'error',
        {block: ['describe', 'it', 'context', 'test', 'tape', 'fixture', 'serial', 'suite']},
      ],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-shadow': 'off',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'no-undef': 'off', // Allow require() in config file
    },
  },
]
