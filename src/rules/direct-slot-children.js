const {isPrimerComponent} = require('../utils/is-primer-component')
const {last} = require('lodash')

const slotParentToChildMap = {
  PageLayout: ['PageLayout.Header', 'PageLayout.Footer'],
  FormControl: ['FormControl.Label', 'FormControl.Caption', 'FormControl.LeadingVisual', 'FormControl.TrailingVisual'],
  MarkdownEditor: ['MarkdownEditor.Toolbar', 'MarkdownEditor.Actions', 'MarkdownEditor.Label'],
  'ActionList.Item': ['ActionList.LeadingVisual', 'ActionList.TrailingVisual', 'ActionList.Description'],
  'TreeView.Item': ['TreeView.LeadingVisual', 'TreeView.TrailingVisual'],
  RadioGroup: ['RadioGroup.Label', 'RadioGroup.Caption', 'RadioGroup.Validation'],
  CheckboxGroup: ['CheckboxGroup.Label', 'CheckboxGroup.Caption', 'CheckboxGroup.Validation']
}

const slotChildToParentMap = Object.entries(slotParentToChildMap).reduce((acc, [parent, children]) => {
  for (const child of children) {
    acc[child] = parent
  }
  return acc
}, {})

module.exports = {
  meta: {
    type: 'problem',
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
      directSlotChildren: '{{childName}} must be a direct child of {{parentName}}.'
    }
  },
  create(context) {
    const stack = []
    return {
      JSXOpeningElement(jsxNode) {
        const name = getJSXOpeningElementName(jsxNode)

        // If `skipImportCheck` is true, this rule will check for direct slot children
        // in any components (not just ones that are imported from `@primer/react`).
        const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false

        // If component is a Primer component and a slot child,
        // check if it's a direct child of the slot parent
        if (
          (skipImportCheck || isPrimerComponent(jsxNode.name, context.getScope(jsxNode))) &&
          slotChildToParentMap[name]
        ) {
          const expectedParentName = slotChildToParentMap[name]
          const parent = last(stack)
          if (parent !== expectedParentName) {
            context.report({
              node: jsxNode,
              messageId: 'directSlotChildren',
              data: {childName: name, parentName: expectedParentName}
            })
          }
        }

        // If tag is not self-closing, push it onto the stack
        if (!jsxNode.selfClosing) {
          stack.push(name)
        }
      },
      JSXClosingElement() {
        // Pop the current element off the stack
        stack.pop()
      }
    }
  }
}

// Convert JSXOpeningElement name to string
function getJSXOpeningElementName(jsxNode) {
  if (jsxNode.name.type === 'JSXIdentifier') {
    return jsxNode.name.name
  } else if (jsxNode.name.type === 'JSXMemberExpression') {
    return `${jsxNode.name.object.name}.${jsxNode.name.property.name}`
  }
}
