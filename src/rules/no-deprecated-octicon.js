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
    
    // Track Octicon imports
    const octiconImports = []

    return {
      ImportDeclaration(node) {
        if (node.source.value !== '@primer/react/deprecated') {
          return
        }
        
        const hasOcticon = node.specifiers.some(
          specifier => specifier.imported && specifier.imported.name === 'Octicon',
        )
        
        if (hasOcticon) {
          octiconImports.push(node)
        }
      },
      
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
        let isConditional = false
        let isMemberExpression = false
        let conditionalExpression = null
        let memberExpression = null

        // Analyze the icon prop to determine the icon name and type
        if (iconProp.value?.type === 'JSXExpressionContainer') {
          const expression = iconProp.value.expression

          if (expression.type === 'Identifier') {
            // Simple case: icon={XIcon}
            iconName = expression.name
          } else if (expression.type === 'ConditionalExpression') {
            // Conditional case: icon={condition ? XIcon : YIcon}
            isConditional = true
            conditionalExpression = expression
          } else if (expression.type === 'MemberExpression') {
            // Dynamic lookup: icon={icons.x}
            isMemberExpression = true
            memberExpression = expression
          }
        }

        if (!iconName && !isConditional && !isMemberExpression) {
          return
        }

        // Get all props except the icon prop to preserve them
        const otherProps = openingElement.attributes.filter(attr => attr !== iconProp)
        const propsText = otherProps.map(attr => sourceCode.getText(attr)).join(' ')

        // Helper function to determine if this is the last Octicon in the file that needs fixing
        function isLastOcticonToFix() {
          // Get all JSX elements in the source code that are Octicons with icon props
          const sourceText = sourceCode.getText()
          const lines = sourceText.split('\n')
          
          // Find all potential Octicon lines
          const octiconLines = []
          lines.forEach((line, index) => {
            if (line.includes('<Octicon') && line.includes('icon=')) {
              octiconLines.push(index + 1) // 1-based line numbers
            }
          })
          
          // Get the line number of the current node
          const currentLine = sourceCode.getLocFromIndex(node.range[0]).line
          
          // Check if this is the last one
          const currentIndex = octiconLines.indexOf(currentLine)
          return currentIndex === octiconLines.length - 1
        }

        // Helper function to generate import fixes if this is the last Octicon usage
        function* generateImportFixes(fixer) {
          if (isLastOcticonToFix() && octiconImports.length > 0) {
            const importNode = octiconImports[0]
            const octiconSpecifier = importNode.specifiers.find(
              specifier => specifier.imported && specifier.imported.name === 'Octicon',
            )
            
            if (importNode.specifiers.length === 1) {
              // Octicon is the only import, remove the entire import statement
              // Also remove trailing newline if present
              const nextToken = sourceCode.getTokenAfter(importNode)
              const importEnd = importNode.range[1]
              const nextStart = nextToken ? nextToken.range[0] : sourceCode.getText().length
              const textBetween = sourceCode.getText().substring(importEnd, nextStart)
              const hasTrailingNewline = /^\s*\n/.test(textBetween)
              
              if (hasTrailingNewline) {
                const newlineMatch = textBetween.match(/^\s*\n/)
                const endRange = importEnd + newlineMatch[0].length
                yield fixer.removeRange([importNode.range[0], endRange])
              } else {
                yield fixer.remove(importNode)
              }
            } else {
              // Remove just the Octicon specifier from the import
              const previousToken = sourceCode.getTokenBefore(octiconSpecifier)
              const nextToken = sourceCode.getTokenAfter(octiconSpecifier)
              const hasTrailingComma = nextToken && nextToken.value === ','
              const hasLeadingComma = previousToken && previousToken.value === ','
              
              let rangeToRemove
              if (hasTrailingComma) {
                rangeToRemove = [octiconSpecifier.range[0], nextToken.range[1] + 1]
              } else if (hasLeadingComma) {
                rangeToRemove = [previousToken.range[0], octiconSpecifier.range[1]]
              } else {
                rangeToRemove = [octiconSpecifier.range[0], octiconSpecifier.range[1]]
              }
              yield fixer.removeRange(rangeToRemove)
            }
          }
        }

        // For simple cases, we can provide an autofix
        if (iconName) {
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
              
              // Handle import removal if this is the last Octicon usage
              yield* generateImportFixes(fixer)
            },
          })
        } else if (isConditional) {
          // Handle conditional expressions: icon={condition ? XIcon : YIcon}
          // Transform to: condition ? <XIcon otherProps /> : <YIcon otherProps />
          context.report({
            node: openingElement,
            messageId: 'replaceDeprecatedOcticon',
            *fix(fixer) {
              const test = sourceCode.getText(conditionalExpression.test)
              const consequentName = conditionalExpression.consequent.type === 'Identifier' 
                ? conditionalExpression.consequent.name
                : sourceCode.getText(conditionalExpression.consequent)
              const alternateName = conditionalExpression.alternate.type === 'Identifier'
                ? conditionalExpression.alternate.name 
                : sourceCode.getText(conditionalExpression.alternate)
              
              const propsString = propsText ? ` ${propsText}` : ''
              let replacement = `${test} ? <${consequentName}${propsString} /> : <${alternateName}${propsString} />`
              
              // If it has children, we need to include them in both branches
              if (node.children && node.children.length > 0) {
                const childrenText = node.children.map(child => sourceCode.getText(child)).join('')
                replacement = `${test} ? <${consequentName}${propsString}>${childrenText}</${consequentName}> : <${alternateName}${propsString}>${childrenText}</${alternateName}>`
              }
              
              yield fixer.replaceText(node, replacement)
              
              // Handle import removal if this is the last Octicon usage
              yield* generateImportFixes(fixer)
            },
          })
        } else if (isMemberExpression) {
          // Handle member expressions: icon={icons.x}
          // Transform to: React.createElement(icons.x, otherProps)
          context.report({
            node: openingElement,
            messageId: 'replaceDeprecatedOcticon',
            *fix(fixer) {
              const memberText = sourceCode.getText(memberExpression)
              
              // Build props object
              let propsObject = '{}'
              if (otherProps.length > 0) {
                const propStrings = otherProps.map(attr => {
                  if (attr.type === 'JSXSpreadAttribute') {
                    return `...${sourceCode.getText(attr.argument)}`
                  } else {
                    const name = attr.name.name
                    const value = attr.value
                    if (!value) {
                      return `${name}: true`
                    } else if (value.type === 'Literal') {
                      return `${name}: ${JSON.stringify(value.value)}`
                    } else if (value.type === 'JSXExpressionContainer') {
                      return `${name}: ${sourceCode.getText(value.expression)}`
                    }
                    return `${name}: ${sourceCode.getText(value)}`
                  }
                })
                propsObject = `{${propStrings.join(', ')}}`
              }
              
              let replacement = `React.createElement(${memberText}, ${propsObject})`
              
              // If it has children, include them as additional arguments
              if (node.children && node.children.length > 0) {
                const childrenArgs = node.children.map(child => {
                  if (child.type === 'JSXText') {
                    return JSON.stringify(child.value.trim()).replace(/\n\s*/g, ' ')
                  } else {
                    return sourceCode.getText(child)
                  }
                }).filter(child => child !== '""') // Filter out empty text nodes
                
                if (childrenArgs.length > 0) {
                  replacement = `React.createElement(${memberText}, ${propsObject}, ${childrenArgs.join(', ')})`
                }
              }
              
              yield fixer.replaceText(node, replacement)
              
              // Handle import removal if this is the last Octicon usage
              yield* generateImportFixes(fixer)
            },
          })
        } else {
          // For other complex cases, just report without autofix
          context.report({
            node: openingElement,
            messageId: 'replaceDeprecatedOcticon',
          })
        }
      },
    }
  },
}
