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
      boxToStackMigration: 'Use <Stack> instead of <Box> to achive grid or flex layout.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      JSXElement(node) {
        const name = getJSXOpeningElementName(node.openingElement)
        const sxAttribute = getJSXOpeningElementAttribute(node.openingElement, 'sx')
        if (isPrimerComponent(node.openingElement.name, sourceCode.getScope(node)) && name === 'Box') {
          if (
            sxAttribute &&
            sxAttribute?.value?.expression &&
            sxAttribute.value.expression.type === 'ObjectExpression' &&
            sxAttribute.value.expression.properties &&
            sxAttribute.value.expression.properties.length > 0
          ) {
            const displayOrGrid = sxAttribute.value.expression.properties.filter(property => {
              return (
                property.key.name === 'display' &&
                property.value.type === 'Literal' &&
                (property.value.value === 'flex' || property.value.value === 'grid')
              )
            })
            if (displayOrGrid.length > 0) {
              context.report({
                node,
                messageId: 'boxToStackMigration',
              })
            }
          }
        }
      },
    }
  },
}
