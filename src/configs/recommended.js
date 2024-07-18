const {jsxA11yMapping, githubMapping} = require('./components')

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
    'primer-react/a11y-remove-disable-tooltip': 'error',
    'primer-react/a11y-use-next-tooltip': 'error',
  },
  settings: {
    github: {
      components: githubMapping,
    },
    'jsx-a11y': {
      components: jsxA11yMapping,
    },
  },
}
