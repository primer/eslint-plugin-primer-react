'use strict'

const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Replace deprecated `Octicon` component with specific icon imports from `@primer/octicons-react`',
      recommended: true,
      url: url(module),
    },
    fixable: 'code',
    schema: [],
    messages: {
      replaceDeprecatedOcticon:
        'Replace deprecated `Octicon` component with the specific icon from `@primer/octicons-react`',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      JSXElement(node) {
        const {openingElement, closingElement} = node
        const elementName = getJSXOpeningElementName(openingElement)

        if (elementName !== 'Octicon') {
          return
        }

        // Get the icon prop
        const iconProp = getJSXOpeningElementAttribute(openingElement, 'icon')
        if (!iconProp) {
          // No icon prop - can't determine what to replace with
          return
        }

        let iconName = null
        let isDynamic = false

        // Analyze the icon prop to determine the icon name
        if (iconProp.value?.type === 'JSXExpressionContainer') {
          const expression = iconProp.value.expression

          if (expression.type === 'Identifier') {
            // Simple case: icon={XIcon}
            iconName = expression.name
          } else if (expression.type === 'ConditionalExpression') {
            // Conditional case: icon={condition ? XIcon : YIcon}
            // For now, we'll skip auto-fixing complex conditionals
            isDynamic = true
          } else if (expression.type === 'MemberExpression') {
            // Dynamic lookup: icon={icons.x}
            isDynamic = true
          }
        }

        if (!iconName && !isDynamic) {
          return
        }

        // For simple cases, we can provide an autofix
        if (iconName && !isDynamic) {
          context.report({
            node: openingElement,
            messageId: 'replaceDeprecatedOcticon',
            *fix(fixer) {
              // Replace opening element name
              yield fixer.replaceText(openingElement.name, iconName)

              // Replace closing element name if it exists
              if (closingElement) {
                yield fixer.replaceText(closingElement.name, iconName)
              }

              // Remove the icon prop with proper whitespace handling
              // Use the JSXAttribute node's properties to determine proper removal boundaries
              const attributes = openingElement.attributes
              const iconIndex = attributes.indexOf(iconProp)

              if (iconIndex === 0 && attributes.length === 1) {
                // Only attribute: remove with leading space
                const beforeIcon = sourceCode.getTokenBefore(iconProp)
                const startPos =
                  beforeIcon && /\s/.test(sourceCode.getText().substring(beforeIcon.range[1], iconProp.range[0]))
                    ? beforeIcon.range[1]
                    : iconProp.range[0]
                yield fixer.removeRange([startPos, iconProp.range[1]])
              } else if (iconIndex === 0) {
                // First attribute: remove including trailing whitespace/comma
                const afterIcon = attributes[1]
                const afterPos = sourceCode.getText().substring(iconProp.range[1], afterIcon.range[0])
                const whitespaceMatch = /^\s*/.exec(afterPos)
                const endPos = whitespaceMatch ? iconProp.range[1] + whitespaceMatch[0].length : iconProp.range[1]
                yield fixer.removeRange([iconProp.range[0], endPos])
              } else {
                // Not first attribute: remove including leading whitespace/comma
                const beforeIcon = attributes[iconIndex - 1]
                const beforePos = sourceCode.getText().substring(beforeIcon.range[1], iconProp.range[0])
                const whitespaceMatch = /\s*$/.exec(beforePos)
                const startPos = whitespaceMatch
                  ? beforeIcon.range[1] + beforePos.length - whitespaceMatch[0].length
                  : iconProp.range[0]
                yield fixer.removeRange([startPos, iconProp.range[1]])
              }
            },
          })
        } else {
          // For complex cases, just report without autofix
          context.report({
            node: openingElement,
            messageId: 'replaceDeprecatedOcticon',
          })
        }
      },
    }
  },
}
