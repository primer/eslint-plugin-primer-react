const {isPrimerComponent} = require('../utils/is-primer-component')

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
    schema: [],
    messages: {
      directSlotChildren: '{{childName}} must be a direct child of {{parentName}}.'
    }
  },
  create(context) {
    return {
      JSXOpeningElement(jsxNode) {
        const name = getJSXOpeningElementName(jsxNode)

        // If component is a Primer component and a slot child,
        // check if it's a direct child of the slot parent
        if (isPrimerComponent(jsxNode.name, context.getScope(jsxNode)) && slotChildToParentMap[name]) {
          const JSXElement = jsxNode.parent
          const parent = JSXElement.parent

          const expectedParentName = slotChildToParentMap[name]
          if (parent.type !== 'JSXElement' || getJSXOpeningElementName(parent.openingElement) !== expectedParentName) {
            context.report({
              node: jsxNode,
              messageId: 'directSlotChildren',
              data: {childName: name, parentName: expectedParentName}
            })
          }
        }
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
