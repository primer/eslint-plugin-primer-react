'use strict'

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    docs: {
      description: '',
      url: require('../url')(module)
    },
    type: 'suggestion',
    hasSuggestions: true,
    fixable: true,
    schema: [],
    messages: {
      'entrypoint-error': 'The drafts entrypoint is deprecated. Use the experimental entrypoint instead.'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (source !== '@primer/react/drafts') {
          return
        }

        context.report({
          node,
          messageId: 'entrypoint-error',
          fix(fixer) {
            return fixer.replaceText(node.source, `'@primer/react/experimental'`)
          }
        })
      }
    }
  }
}
