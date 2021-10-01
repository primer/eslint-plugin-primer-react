module.exports = {
  rules: {
    'no-deprecated-colors': require('./rules/no-deprecated-colors'),
    'no-system-props': require('./rules/no-system-props')
  },
  configs: {
    recommended: require('./configs/recommended')
  }
}
