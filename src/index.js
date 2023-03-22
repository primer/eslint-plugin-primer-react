module.exports = {
  rules: {
    'direct-slot-children': require('./rules/direct-slot-children'),
    'no-deprecated-colors': require('./rules/no-deprecated-colors'),
    'no-system-props': require('./rules/no-system-props')
  },
  configs: {
    recommended: require('./configs/recommended')
  }
}
