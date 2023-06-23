const cssVars = require('../utils/css-var-map.json')

module.exports = {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    fixable: 'code',
    docs: {
      description: 'Disallow the use of CSS color variables in React'
    },
    schema: [
      {
        type: 'object',
        properties: {
          skipImportCheck: {
            type: 'boolean'
          },
          checkAllStrings: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const styledSystemProps = [
      'bg',
      'backgroundColor',
      'color',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'border',
      'boxShadow',
      'caretColor'
    ]

    return {
      JSXAttribute(node) {
        if (node.name.name === 'sx') {
          node.value.expression.properties.forEach(property => {
            if (property.value.type === 'Literal' && typeof property.value.value === 'string') {
              checkStringLiteral(property.value, context)
            }
          })
        } else if (
          styledSystemProps.includes(node.name.name) &&
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string'
        ) {
          checkStringLiteral(node.value, context)
        }
      }
    }

    function checkStringLiteral(node, context) {
      Object.keys(cssVars).forEach(cssVar => {
        if (node.value.includes(`var(${cssVar}`)) {
          const fixedString = node.value.replace(`var(${cssVar})`, cssVars[cssVar])

          context.report({
            node,
            message: `Replace var(${cssVar}) with ${cssVars[cssVar]}`,
            fix: function(fixer) {
              return fixer.replaceText(node, `'${fixedString}'`)
            }
          })
        }
      })
    }
  }
}
