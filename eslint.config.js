import js from '@eslint/js'
import globals from 'globals'
import github from 'eslint-plugin-github'

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  {
    ignores: ['node_modules/**', '.git/**'],
  },
  js.configs.recommended,
  github.getFlatConfigs().recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Override specific rules for the repository
      'import/extensions': ['error', 'ignorePackages', {js: 'always'}],
      'import/no-commonjs': 'off',
      'import/no-unresolved': ['error', {ignore: ['^@typescript-eslint/']}],
      'import/no-dynamic-require': 'off', // Allow dynamic requires in tests
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-shadow': 'off',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
        },
      ],
      'github/filenames-match-regex': 'off', // Allow various file naming patterns
      'i18n-text/no-en': 'off', // Allow English text in this repository
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
]
