const {jsxA11yMapping, githubMapping} = require('../components')
const github = require('eslint-plugin-github')
const primerReact = require('eslint-plugin-primer-react')

module.exports = [
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {github, 'primer-react': primerReact},
    rules: {
      'primer-react/direct-slot-children': 'error',
      'primer-react/no-system-props': 'warn',
      'primer-react/a11y-tooltip-interactive-trigger': 'error',
      'primer-react/new-color-css-vars': 'error',
      'primer-react/a11y-explicit-heading': 'error',
      'primer-react/no-deprecated-props': 'warn',
      'primer-react/a11y-remove-disable-tooltip': 'error',
      'primer-react/a11y-use-accessible-tooltip': 'error',
      'primer-react/no-unnecessary-components': 'error',
      'primer-react/prefer-action-list-item-onselect': 'error',
      'primer-react/enforce-css-module-identifier-casing': 'error',
      'primer-react/enforce-css-module-default-import': ['error', {enforceName: '(^classes$|Classes$)'}],
    },
    settings: {
      github: {
        components: githubMapping,
      },
      'jsx-a11y': {
        components: jsxA11yMapping,
      },
    },
  },
]
