const deprecatedVars = require('@primer/primitives/dist/deprecated/colors')
const removedVars = require('@primer/primitives/dist/removed/colors')
const traverse = require('eslint-traverse')
const {isImportedFrom} = require('../utils/is-imported-from')
const {isPrimerComponent} = require('../utils/is-primer-component')

module.exports = {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    fixable: 'code',
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
        // console.log(node)

        if (typeof node.value === 'string' && node.value.startsWith('var(--color-')) {
          const match = node.value.match(/^var\(--color-(.+)\)$/)
          if (!match) return
          const colorName = match[1]
          context.report({
            node,
            message: `Oops`,
            fix(fixer) {
              return fixer.replaceText(node, `"${colorName}"`)
            }
          })
        }
      }
    }
  }
}
