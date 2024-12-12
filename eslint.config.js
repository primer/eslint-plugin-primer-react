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
      'importPlugin/no-commonjs': 'off',
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
  },
  {
    files: ['.eslint.config.js', '.markdownlint-cli2.cjs'],
    rules: {
      'filenames/match-regex': 'off',
      'github/filenames-match-regex': 'off',
    },
  },
  {
    files: ['src/url.js', 'src/rules/new-color-css-vars.js'],
    rules: {
      'importPlugin/extensions': 'off',
    },
  },
]
