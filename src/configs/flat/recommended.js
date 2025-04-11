const pluginPrimerReact = require('../..')
const {jsxA11yMapping, githubMapping} = require('../components')
const github = require('eslint-plugin-github')

const githubReact = github.getFlatConfigs().react

module.exports = {
  ...githubReact,
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    ...githubReact.plugins,
    'primer-react': pluginPrimerReact,
  },
  rules: {
    ...githubReact.rules,
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
    ...githubReact.settings,
    github: {
      components: githubMapping,
    },
    'jsx-a11y': {
      components: jsxA11yMapping,
    },
  },
}
