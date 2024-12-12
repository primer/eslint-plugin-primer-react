const eslintPlugin = require('eslint-plugin-eslint-plugin')
const github = require('eslint-plugin-github')

module.exports = [
  github.getFlatConfigs().recommended,
  eslintPlugin.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
      },
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
]
