const cssVars = require('../temp-fix.json')

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
    return {
      Literal(node) {
        const stringValue = node.value

        if (typeof stringValue !== 'string') {
          return
        }

        Object.keys(cssVars).forEach(cssVar => {
          if (stringValue.includes(`var(${cssVar}`)) {
            const fixedString = stringValue.replace(`var(${cssVar})`, cssVars[cssVar])

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
}
