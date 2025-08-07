'use strict'

const globals = require('globals')

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
module.exports = [
  {
    ignores: ['node_modules/**', '.git/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.commonjs,
        ...globals.node,
      },
    },
    rules: {
      // Basic rules for the repository
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
        },
      ],
      'no-shadow': 'off',
      'no-undef': 'error',
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