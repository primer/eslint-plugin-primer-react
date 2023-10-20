'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'recommends the use of @primer/react/next Tooltip component',
      category: 'Best Practices',
      recommended: true
    },
    fixable: null,
    schema: [],
    messages: {
      useNextTooltip: 'Please use @primer/react/next Tooltip component that has accessibility improvements'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@primer/react') {
          return
        }
        const hasTooltip = node.specifiers.some(
          specifier => specifier.imported && specifier.imported.name === 'Tooltip'
        )
        if (!hasTooltip) {
          return
        }
        context.report({
          node,
          messageId: 'useNextTooltip'
        })
      }
    }
  }
}
