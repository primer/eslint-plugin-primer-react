const {jsxA11yMapping, gihubMapping} = require('./components')

module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['primer-react', 'github'],
  extends: ['plugin:github/react'],
  rules: {
    'primer-react/direct-slot-children': 'error',
    'primer-react/no-system-props': 'warn',
    'primer-react/a11y-tooltip-interactive-trigger': 'error',
    'primer-react/new-color-css-vars': 'error',
    'primer-react/a11y-explicit-heading': 'error',
    'primer-react/no-deprecated-props': 'warn',
  },
  settings: {
    github: {
      gihubMapping,
    },
    'jsx-a11y': {
      jsxA11yMapping,
    },
  },
}
