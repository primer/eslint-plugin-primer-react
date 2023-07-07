module.exports = {
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['primer-react', 'github'],
  extends: ['plugin:github/react'],
  rules: {
    'primer-react/direct-slot-children': 'error',
    'primer-react/no-deprecated-colors': 'warn',
    'primer-react/no-system-props': 'warn',
    'primer-react/a11y-tooltip-interactive-trigger': 'error'
  },
  settings: {
    'jsx-a11y': {
      components: {
        Button: 'button',
        IconButton: 'button'
      }
    }
  }
}
