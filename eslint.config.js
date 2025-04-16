const eslintJs = require('@eslint/js')
const github = require('eslint-plugin-github')
const globals = require('globals')
const pluginJest = require('eslint-plugin-jest')

module.exports = [
  github.getFlatConfigs().recommended,
  eslintJs.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.commonjs,
        ...globals.node,
      },
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
    ignores: ['**/dist/**', '**/node_modules/**'],
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
      },
    },
    rules: {
      'i18n-text/no-en': 'off',
    },
  },
  {
    files: ['.markdownlint-cli2.cjs'],
    rules: {
      'github/filenames-match-regex': 'off',
    },
  },
]
