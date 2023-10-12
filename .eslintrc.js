'use strict'

/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ['eslint:recommended', 'plugin:github/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    commonjs: true,
    node: true,
  },
  rules: {
    'import/no-commonjs': 'off',
    'no-shadow': 'off',
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
    {
      files: ['.eslintrc.js'],
      rules: {
        'filenames/match-regex': 'off',
      },
    },
  ],
}
