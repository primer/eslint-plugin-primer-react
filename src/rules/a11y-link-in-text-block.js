const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')
const {isHTMLElement} = require('../utils/is-html-element')

module.exports = {
  meta: {
    docs: {
      url: require('../url')(module),
    },
    type: 'problem',
    fixable: 'code',
    schema: [
      {
        properties: {
          skipImportCheck: {
            type: 'boolean',
          },
        },
      },
    ],
    messages: {
      linkInTextBlock:
        'Links should have the inline prop if it appear in a text block and only uses color to distinguish itself from surrounding text.',
      htmlAnchorInTextBlock:
        'HTML anchor elements in text blocks should use the Link component from @primer/react instead.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    // Helper function to check if a node is in a text block
    const isNodeInTextBlock = node => {
      let siblings = node.parent.children
      if (!siblings || siblings.length === 0) return false

      // Filter out whitespace nodes
      siblings = siblings.filter(childNode => {
        return (
          !(childNode.type === 'JSXText' && /^\s+$/.test(childNode.value)) &&
          !(
            childNode.type === 'JSXExpressionContainer' &&
            childNode.expression.type === 'Literal' &&
            /^\s+$/.test(childNode.expression.value)
          ) &&
          !(childNode.type === 'Literal' && /^\s+$/.test(childNode.value))
        )
      })

      const index = siblings.findIndex(childNode => {
        return childNode.range === node.range
      })

      const prevSibling = siblings[index - 1]
      const nextSibling = siblings[index + 1]

      const prevSiblingIsText = prevSibling && prevSibling.type === 'JSXText'
      const nextSiblingIsText = nextSibling && nextSibling.type === 'JSXText'

      // If there's text on either side
      if (prevSiblingIsText || nextSiblingIsText) {
        // Skip if the only text adjacent to the link is a period
        if (!prevSiblingIsText && /^\s*\.+\s*$/.test(nextSibling.value)) {
          return false
        }
        return true
      }

      return false
    }

    return {
      JSXElement(node) {
        const name = getJSXOpeningElementName(node.openingElement)
        const parentName = node.parent.openingElement?.name?.name
        const parentsToSkip = ['Heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

        // Check for HTML anchor elements
        if (isHTMLElement(node.openingElement) && name === 'a' && node.parent.children) {
          // Skip if anchor is nested inside of a heading
          if (parentsToSkip.includes(parentName)) return

          // Skip if anchor has className (might have distinguishing styles)
          const classNameAttribute = getJSXOpeningElementAttribute(node.openingElement, 'className')
          if (classNameAttribute) return

          // Skip if anchor has an ID (might have distinguishing styles)
          const idAttribute = getJSXOpeningElementAttribute(node.openingElement, 'id')
          if (idAttribute) return

          // Check for anchor in text block
          if (isNodeInTextBlock(node)) {
            // Skip if anchor child is a JSX element
            const jsxElementChildren = node.children.filter(child => child.type === 'JSXElement')
            if (jsxElementChildren.length > 0) return

            // Report and autofix
            context.report({
              node,
              messageId: 'htmlAnchorInTextBlock',
              fix(fixer) {
                // Get all attributes from the anchor to transfer to Link
                const attributes = node.openingElement.attributes.map(attr => sourceCode.getText(attr)).join(' ')

                // Create the Link component opening and closing tags
                const openingTag = `<Link ${attributes}>`
                const closingTag = '</Link>'

                // Apply fixes to the opening and closing tags
                const openingFix = fixer.replaceText(node.openingElement, openingTag)
                const closingFix = fixer.replaceText(node.closingElement, closingTag)

                return [openingFix, closingFix]
              },
            })
          }
        }
        // Check for Primer Link component
        else if (
          isPrimerComponent(node.openingElement.name, sourceCode.getScope(node)) &&
          name === 'Link' &&
          node.parent.children
        ) {
          // Skip if Link has className because we cannot deduce what styles are applied.
          const classNameAttribute = getJSXOpeningElementAttribute(node.openingElement, 'className')
          if (classNameAttribute) return

          let siblings = node.parent.children
          const parentName = node.parent.openingElement?.name?.name
          // Skip if Link is nested inside of a heading.
          const parentsToSkip = ['Heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
          if (parentsToSkip.includes(parentName)) return
          if (siblings.length > 0) {
            siblings = siblings.filter(childNode => {
              return (
                !(childNode.type === 'JSXText' && /^\s+$/.test(childNode.value)) &&
                !(
                  childNode.type === 'JSXExpressionContainer' &&
                  childNode.expression.type === 'Literal' &&
                  /^\s+$/.test(childNode.expression.value)
                ) &&
                !(childNode.type === 'Literal' && /^\s+$/.test(childNode.value))
              )
            })
            const index = siblings.findIndex(childNode => {
              return childNode.range === node.range
            })
            const prevSibling = siblings[index - 1]
            const nextSibling = siblings[index + 1]

            const prevSiblingIsText = prevSibling && prevSibling.type === 'JSXText'
            const nextSiblingIsText = nextSibling && nextSibling.type === 'JSXText'
            if (prevSiblingIsText || nextSiblingIsText) {
              // Skip if the only text adjacent to the link is a period, then skip it.
              if (!prevSiblingIsText && /^\s*\.+\s*$/.test(nextSibling.value)) {
                return
              }
              const sxAttribute = getJSXOpeningElementAttribute(node.openingElement, 'sx')
              const inlineAttribute = getJSXOpeningElementAttribute(node.openingElement, 'inline')

              // Skip if Link child is a JSX element.
              const jsxElementChildren = node.children.filter(child => {
                return child.type === 'JSXElement'
              })
              if (jsxElementChildren.length > 0) return

              // Skip if fontWeight or fontFamily is set via the sx prop since these may technically be considered sufficiently distinguishing styles that don't use color.
              if (
                sxAttribute &&
                sxAttribute?.value?.expression &&
                sxAttribute.value.expression.type === 'ObjectExpression' &&
                sxAttribute.value.expression.properties &&
                sxAttribute.value.expression.properties.length > 0
              ) {
                const fontStyleProperty = sxAttribute.value.expression.properties.filter(property => {
                  return property.key.name === 'fontWeight' || property.key.name === 'fontFamily'
                })
                if (fontStyleProperty.length > 0) return
              }
              if (inlineAttribute) {
                if (!inlineAttribute.value) {
                  return
                } else if (inlineAttribute.value.type === 'JSXExpressionContainer') {
                  if (inlineAttribute.value.expression.type === 'Literal') {
                    if (inlineAttribute.value.expression.value === true) {
                      return
                    }
                  }
                }
              }
              context.report({
                node,
                messageId: 'linkInTextBlock',
              })
            }
          }
        }
      },
    }
  },
}
