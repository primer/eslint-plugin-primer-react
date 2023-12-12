module.exports = {
  rules: {
    'a11y-explicit-heading': require('./rules/a11y-explicit-heading'),
    'a11y-tooltip-interactive-trigger': require('./rules/a11y-tooltip-interactive-trigger'),
    'direct-slot-children': require('./rules/direct-slot-children'),
    'no-deprecated-colors': require('./rules/no-deprecated-colors'),
    'no-deprecated-imports': require('./rules/no-deprecated-imports'),
    'no-system-props': require('./rules/no-system-props'),
    'new-color-css-vars': require('./rules/new-color-css-vars'),
    'new-color-css-vars-have-fallback': require('./rules/new-color-css-vars-have-fallback'),
  },
  configs: {
    recommended: require('./configs/recommended'),
  },
}
