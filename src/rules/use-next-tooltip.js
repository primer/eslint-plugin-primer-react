'use strict'
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'recommends the use of @primer/react/next Tooltip component',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: true,
    schema: [],
    messages: {
      useNextTooltip: 'Please use @primer/react/next Tooltip component that has accessibility improvements',
      useTextProp: 'Please use the text prop instead of aria-label',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@primer/react') {
          return
        }
        const hasTooltip = node.specifiers.some(
          specifier => specifier.imported && specifier.imported.name === 'Tooltip',
        )

        const hasOtherImports = node.specifiers.some(
          specifier => specifier.imported && specifier.imported.name !== 'Tooltip',
        )
        if (!hasTooltip) {
          return
        }
        context.report({
          node,
          messageId: 'useNextTooltip',
          fix(fixer) {
            // If Tooltip is the only import, replace the whole import statement
            if (!hasOtherImports) {
              return fixer.replaceText(node.source, `'@primer/react/next'`)
            } else {
              // Otherwise, remove Tooltip from the import statement and add a new import statement with the correct path
              const tooltipSpecifier = node.specifiers.find(
                specifier => specifier.imported && specifier.imported.name === 'Tooltip',
              )
              return [
                // remove tooltip specifier and the space and comma after it
                fixer.removeRange([tooltipSpecifier.range[0], tooltipSpecifier.range[1] + 2]),
                // fixer.remove(tooltipSpecifier),
                fixer.insertTextAfterRange(
                  [node.range[1], node.range[1]],
                  `\nimport {Tooltip} from '@primer/react/next';`,
                ),
              ]
            }
          },
        })
      },
      JSXAttribute(node) {
        if (node.name.name === 'aria-label') {
          context.report({
            node,
            messageId: 'useTextProp',
            fix(fixer) {
              return fixer.replaceText(node.name, 'text')
            },
          })
        }
      },
    }
  },
}
