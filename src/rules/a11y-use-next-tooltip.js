'use strict'
const url = require('../url')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'recommends the use of @primer/react/next Tooltip component',
      category: 'Best Practices',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
    messages: {
      useNextTooltip: 'Please use @primer/react/next Tooltip component that has accessibility improvements',
      useTextProp: 'Please use the text prop instead of aria-label',
      noDelayRemoved: 'noDelay prop is removed. Tooltip now has no delay by default',
      wrapRemoved: 'wrap prop is removed. Tooltip now wraps by default',
      alignRemoved: 'align prop is removed. Please use the direction prop instead.',
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

        const hasOtherImports = node.specifiers.length > 1
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

              const tokensToRemove = [' ', ',']
              const tooltipIsFirstImport = tooltipSpecifier === node.specifiers[0]
              const tooltipIsLastImport = tooltipSpecifier === node.specifiers[node.specifiers.length - 1]
              const tooltipIsNotFirstOrLastImport = !tooltipIsFirstImport && !tooltipIsLastImport

              const sourceCode = context.getSourceCode()
              const canRemoveBefore = tooltipIsNotFirstOrLastImport
                ? false
                : tokensToRemove.includes(sourceCode.getTokenBefore(tooltipSpecifier).value)
              const canRemoveAfter = tokensToRemove.includes(sourceCode.getTokenAfter(tooltipSpecifier).value)
              const start = canRemoveBefore
                ? sourceCode.getTokenBefore(tooltipSpecifier).range[0]
                : tooltipSpecifier.range[0]
              const end = canRemoveAfter
                ? sourceCode.getTokenAfter(tooltipSpecifier).range[1] + 1
                : tooltipSpecifier.range[1]
              return [
                // remove tooltip specifier and the space and comma after it
                fixer.removeRange([start, end]),
                fixer.insertTextAfterRange(
                  [node.range[1], node.range[1]],
                  `\nimport {Tooltip} from '@primer/react/next';`,
                ),
              ]
            }
          },
        })
      },
      JSXOpeningElement(node) {
        const openingElName = getJSXOpeningElementName(node)
        if (openingElName !== 'Tooltip') {
          return
        }
        const ariaLabel = getJSXOpeningElementAttribute(node, 'aria-label')
        if (ariaLabel !== undefined) {
          context.report({
            node,
            messageId: 'useTextProp',
            fix(fixer) {
              return fixer.replaceText(ariaLabel.name, 'text')
            },
          })
        }
        const noDelay = getJSXOpeningElementAttribute(node, 'noDelay')
        if (noDelay !== undefined) {
          context.report({
            node,
            messageId: 'noDelayRemoved',
            fix(fixer) {
              return fixer.remove(noDelay)
            },
          })
        }
        const wrap = getJSXOpeningElementAttribute(node, 'wrap')
        if (wrap !== undefined) {
          context.report({
            node,
            messageId: 'wrapRemoved',
            fix(fixer) {
              return fixer.remove(wrap)
            },
          })
        }
        const align = getJSXOpeningElementAttribute(node, 'align')
        if (align !== undefined) {
          context.report({
            node,
            messageId: 'alignRemoved',
            fix(fixer) {
              return fixer.remove(align)
            },
          })
        }
      },
    }
  },
}
