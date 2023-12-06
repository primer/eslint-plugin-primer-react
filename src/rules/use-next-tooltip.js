'use strict'

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'recommends the use of @primer/react/experimental Tooltip component',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: true,
    schema: [],
    messages: {
      useNextTooltip: 'Please use @primer/react/experimental Tooltip component that has accessibility improvements',
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
              return fixer.replaceText(node.source, `'@primer/react/experimental'`)
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
                  `\nimport {Tooltip} from '@primer/react/experimental';`,
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
        if (node.name.name === 'noDelay') {
          context.report({
            node,
            messageId: 'noDelayRemoved',
            fix(fixer) {
              return fixer.remove(node)
            },
          })
        }
        if (node.name.name === 'wrap') {
          context.report({
            node,
            messageId: 'wrapRemoved',
            fix(fixer) {
              return fixer.remove(node)
            },
          })
        }
        if (node.name.name === 'align') {
          context.report({
            node,
            messageId: 'alignRemoved',
            fix(fixer) {
              return fixer.remove(node)
            },
          })
        }
      },
    }
  },
}
