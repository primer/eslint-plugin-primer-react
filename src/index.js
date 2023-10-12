module.exports = {
  rules: {
    'direct-slot-children': require('./rules/direct-slot-children'),
    'no-deprecated-colors': require('./rules/no-deprecated-colors'),
    'no-system-props': require('./rules/no-system-props'),
    'a11y-tooltip-interactive-trigger': require('./rules/a11y-tooltip-interactive-trigger'),
    'new-color-css-vars': require('./rules/new-color-css-vars'),
    'a11y-explicit-heading': require('./rules/a11y-explicit-heading'),
  },
  configs: {
    recommended: require('./configs/recommended'),
  },
}
