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
          const rawText = context.getSourceCode().getText(node.value)
          checkForVariables(node.value, rawText)
        } else if (
          styledSystemProps.includes(node.name.name) &&
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string'
        ) {
          checkForVariables(node.value, node.value.value)
        }
      }
    }

    function checkForVariables(node, rawText) {
      // performance optimisation: exit early
      if (!rawText.includes('var')) return

      Object.keys(cssVars).forEach(cssVar => {
        if (rawText.includes(`var(${cssVar}`)) {
          const fixedString = rawText.replace(`var(${cssVar})`, cssVars[cssVar])

          context.report({
            node,
            message: `Replace var(${cssVar}) with ${cssVars[cssVar]}`,
            fix: function(fixer) {
              return fixer.replaceText(node, node.type === 'Literal' ? `"${fixedString}"` : fixedString)
            }
          })
        }
      })
    }
  }
}
