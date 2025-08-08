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
    fixable: 'code',
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
          *fix(fixer) {
            // Check if there's already a Banner import from @primer/react/experimental
            const program = node.parent
            const existingBannerImport = program.body.find(
              stmt =>
                stmt.type === 'ImportDeclaration' &&
                stmt.source.value === '@primer/react/experimental' &&
                stmt.specifiers.some(spec => spec.imported?.name === 'Banner'),
            )

            // Remove Flash from current import
            const otherSpecifiers = node.specifiers.filter(spec => spec !== flashSpecifier)

            if (otherSpecifiers.length === 0) {
              // If Flash was the only import, replace entire import with Banner
              if (!existingBannerImport) {
                yield fixer.replaceText(node, "import {Banner} from '@primer/react/experimental'")
              } else {
                // Banner import already exists, remove this import entirely including newline
                const nextToken = sourceCode.getTokenAfter(node)
                if (nextToken && sourceCode.getText().substring(node.range[1], nextToken.range[0]).includes('\n')) {
                  // Remove including the newline after
                  yield fixer.removeRange([node.range[0], nextToken.range[0]])
                } else {
                  yield fixer.remove(node)
                }
              }
            } else {
              // Remove Flash specifier and handle commas properly
              const indexOfFlash = node.specifiers.indexOf(flashSpecifier)

              if (indexOfFlash === 0) {
                // Flash is first, remove Flash and the trailing comma
                const tokenAfter = sourceCode.getTokenAfter(flashSpecifier)
                if (tokenAfter && tokenAfter.value === ',') {
                  yield fixer.removeRange([flashSpecifier.range[0], tokenAfter.range[1]])
                } else {
                  yield fixer.remove(flashSpecifier)
                }
              } else {
                // Flash is not first, remove the preceding comma and Flash
                const tokenBefore = sourceCode.getTokenBefore(flashSpecifier)
                if (tokenBefore && tokenBefore.value === ',') {
                  yield fixer.removeRange([tokenBefore.range[0], flashSpecifier.range[1]])
                } else {
                  yield fixer.remove(flashSpecifier)
                }
              }

              // Add Banner import if it doesn't exist
              if (!existingBannerImport) {
                yield fixer.insertTextAfter(node, "\nimport {Banner} from '@primer/react/experimental'")
              }
            }
          },
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
          *fix(fixer) {
            // Replace opening tag
            yield fixer.replaceText(node.openingElement.name, 'Banner')

            // Replace closing tag if it exists
            if (node.closingElement) {
              yield fixer.replaceText(node.closingElement.name, 'Banner')
            }
          },
        })
      },
    }
  },
}
