const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

isInteractive = child => {
  const childName = getJSXOpeningElementName(child.openingElement)
  return ['button', 'summary', 'select', 'textarea', 'a', 'input', 'iconbutton'].includes(childName.toLowerCase())
}

isInteractiveAnchor = child => {
  const hasHref = getJSXOpeningElementAttribute(child.openingElement, 'href')
  if (!hasHref) return false
  const href = getJSXOpeningElementAttribute(child.openingElement, 'href').value.value
  const isAnchorInteractive = typeof href === 'string' && href !== ''
  return isAnchorInteractive
}

isInteractiveInput = child => {
  const hasHiddenType =
    getJSXOpeningElementAttribute(child.openingElement, 'type') &&
    getJSXOpeningElementAttribute(child.openingElement, 'type').value.value === 'hidden'
  return !hasHiddenType
}

const checkTriggerElement = jsxNode => {
  let messageId = ''
  const child = jsxNode.children
  const childName = getJSXOpeningElementName(child.openingElement)

  // First check specific requirements for anchor
  if (childName === 'a' && !isInteractiveAnchor(child)) {
    messageId = 'anchorTagWithoutHref'
    return {messageId, node: jsxNode}
  }
  // Then check specific requirements input
  if (childName === 'input' && !isInteractiveInput(child)) {
    messageId = 'hiddenInput'
    return {messageId, node: jsxNode}
  }
  // Then check if the child is interactive
  if (!isInteractive(child)) {
    // If child is not interactive, check if there are any grandchildren that is interactive
    const hasJsxGrands =
      child.children.length > 0 && child.children.filter(gChild => gChild.type === 'JSXElement').length > 0 //.some(gChild => isInteractive(gChild))

    if (!hasJsxGrands) {
      messageId = 'nonInteractiveTrigger'
    } else {
      const hasInteractiveGrands = child.children // is there any way I can access all child nodes? :/
        .filter(gChild => gChild.type === 'JSXElement')
        .some(gChild => {
          const gChildName = getJSXOpeningElementName(gChild.openingElement)
          // TODO: How can I check all child nodes?
          return checkTriggerElement(gChild).messageId === ''
        })
      if (!hasInteractiveGrands) messageId = 'nonInteractiveTrigger'
    }

    return {messageId, node: jsxNode}
  }

  // All good the element is interactive
  return {messageId, node: jsxNode}
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url:
        'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-noninteractive-element-interactions.md',
      description: 'Non-interactive elements should not be assigned mouse or keyboard event listeners.'
    },
    schema: [
      {
        properties: {
          skipImportCheck: {
            type: 'boolean'
          }
        }
      }
    ],
    messages: {
      nonInteractiveTrigger:
        'The `Tooltip` component expects a single React element that contains interactive content. Consider using a `<button>` or equivalent interactive element instead.',
      anchorTagWithoutHref:
        'Anchor tags without an href attribute are not be considered interactive, therefore can not be used as a trigger for a tooltip.',
      hiddenInput:
        'Hidden inputs are not be considered interactive, therefore can not be used as a trigger for a tooltip.',
      singleChild: 'The `Tooltip` component expects a single React element as a child.'
    }
  },
  create(context) {
    const stack = []
    const {options} = context
    return {
      JSXElement(jsxNode) {
        // If `skipImportCheck` is true, this rule will check for direct slot children
        // in any components (not just ones that are imported from `@primer/react`).
        const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false

        const name = getJSXOpeningElementName(jsxNode.openingElement)

        if (name === 'Tooltip' && jsxNode.children) {
          // Check if there is a single child
          if (jsxNode.children.length > 1) {
            context.report({
              node: jsxNode,
              messageId: 'singleChild'
            })
          } else {
            // Check if the child is interactive
            const {node, messageId} = checkTriggerElement(jsxNode)

            if (messageId !== '') {
              context.report({
                node,
                messageId
              })
            }
          }
        }
      }
    }
  }
}
