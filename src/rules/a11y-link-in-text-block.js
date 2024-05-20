const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

module.exports = {
  meta: {
    type: 'problem',
    schema: [
      {
        properties: {
          skipImportCheck: {
            type: 'boolean',
          },
        },
      },
    ],
    messages: {
      linkInTextBlock: '<Link> that are used within a text block should have the inline prop.',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        const name = getJSXOpeningElementName(node.openingElement)
        if (isPrimerComponent(node.openingElement.name, context.getScope(node)) && name === 'Link') {
          let siblings = node.parent.children
          siblings = siblings.filter(childNode => {
            return !(
              (childNode.type === 'JSXExpressionContainer' &&
                childNode.expression.type === 'Literal' &&
                /^\s+$/.test(childNode.expression.raw)) ||
              (childNode.type === 'Literal' && /^\s+$/.test(childNode.raw))
            )
          })
          if (siblings.length > 0) {
            const index = siblings.findIndex(childNode => {
              return childNode.range === node.range
            })
            const prevSibling = siblings[index - 1]
            const nextSibling = siblings[index + 1]
            if ((prevSibling && prevSibling.type === 'JSXText') || (nextSibling && nextSibling.type === 'JSXText')) {
              const inlineAttribute = getJSXOpeningElementAttribute(node.openingElement, 'inline')
              if (inlineAttribute) {
                if (!inlineAttribute.value) {
                  return
                } else if (inlineAttribute.value.type === 'JSXExpressionContainer') {
                  if (inlineAttribute.value.expression.type === 'Literal') {
                    if (inlineAttribute.value.expression.value === true) {
                      return
                    }
                  }
                }
              }
              context.report({
                node,
                messageId: 'linkInTextBlock',
              })
            }
          }
        }
      },
    }
  },
}
