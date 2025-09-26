'use strict'

const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {isPrimerComponent} = require('../utils/is-primer-component')
const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Flash component is deprecated. Use Banner from @primer/react/experimental instead.',
      recommended: true,
      url: url(module),
    },
    schema: [],
    messages: {
      flashDeprecated: 'Flash component is deprecated. Use Banner from @primer/react/experimental instead.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode()

    return {
      ImportDeclaration(node) {
        // Check if importing Flash from @primer/react
        if (node.source.value !== '@primer/react') {
          return
        }

        const flashSpecifier = node.specifiers.find(
          specifier => specifier.type === 'ImportSpecifier' && specifier.imported?.name === 'Flash',
        )

        if (!flashSpecifier) {
          return
        }

        context.report({
          node: flashSpecifier,
          messageId: 'flashDeprecated',
        })
      },

      JSXElement(node) {
        const elementName = getJSXOpeningElementName(node.openingElement)

        if (elementName !== 'Flash') {
          return
        }

        // Check if Flash is imported from @primer/react using isPrimerComponent
        const scope = sourceCode.getScope ? sourceCode.getScope(node.openingElement) : context.getScope()
        if (!isPrimerComponent(node.openingElement.name, scope)) {
          return
        }

        context.report({
          node: node.openingElement.name,
          messageId: 'flashDeprecated',
        })
      },
    }
  },
}
