module.exports = {
  meta: {},
  create(context) {
    return {
      CallExpression(node) {
        context.report({node, message: 'Hello ESLint'})
      }
    }
  }
}
