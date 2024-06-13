module.exports = {
  rules: {
    'direct-slot-children': require('./rules/direct-slot-children'),
    'no-deprecated-entrypoints': require('./rules/no-deprecated-entrypoints'),
    'no-system-props': require('./rules/no-system-props'),
    'a11y-tooltip-interactive-trigger': require('./rules/a11y-tooltip-interactive-trigger'),
    'new-color-css-vars': require('./rules/new-color-css-vars'),
    'a11y-explicit-heading': require('./rules/a11y-explicit-heading'),
    'no-deprecated-props': require('./rules/no-deprecated-props'),
    'a11y-link-in-text-block': require('./rules/a11y-link-in-text-block'),
    'a11y-remove-disable-tooltip': require('./rules/a11y-remove-disable-tooltip'),
  },
  configs: {
    recommended: require('./configs/recommended'),
  },
}
