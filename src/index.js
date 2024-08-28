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
    'a11y-use-next-tooltip': require('./rules/a11y-use-next-tooltip'),
    'use-deprecated-from-deprecated': require('./rules/use-deprecated-from-deprecated'),
    'primer-react/no-unnecessary-components': require('./rules/no-unnecessary-components'),
    'primer-react/prefer-action-list-item-onselect': require('./rules/prefer-action-list-item-onselect'),
  },
  configs: {
    recommended: require('./configs/recommended'),
  },
}
