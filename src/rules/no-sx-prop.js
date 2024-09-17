'use strict'

const url = require('../url')

const forbidden = new Set([
  // 'ActionList',
  // 'ActionList.Divider',
  // 'ActionList.Group',
  // 'ActionList.Item',
  // 'ActionList.LeadingVisual',
  // 'ActionList.LinkItem',

  // 'ActionMenu.Button',
  // 'ActionMenu.Overlay',

  // 'Avatar',
  // 'AvatarStack',

  // 'BorderBox',
  // 'Box',

  // 'BranchName',

  // 'Breadcrumbs',
  // 'Breadcrumbs.Item',

  'SegmentedControl',
  'SegmentedControl.Button',

  'SplitPageLayout.Pane',

  // 'UnderlineNav',
  // 'UnderlineNav.Item',
])

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'The sx prop is discouraged. Use CSS Modules instead',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
    messages: {
      sxProp:
        'The `sx` prop has been deprecated by @primer/react and will be removed in the next major release. Please migrate to CSS Modules instead.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        let name = null

        if (
          node.name.type === 'JSXMemberExpression' &&
          node.name.object.type === 'JSXIdentifier' &&
          node.name.property.type === 'JSXIdentifier'
        ) {
          name = `${node.name.object.name}.${node.name.property.name}`
        } else if (node.name.type === 'JSXIdentifier') {
          name = node.name.name
        }

        if (!forbidden.has(name)) {
          return
        }

        const hasSxProp = node.attributes.some(attr => {
          if (attr.name.type === 'JSXIdentifier' && attr.name.name === 'sx') {
            return true
          }
          return false
        })

        if (hasSxProp) {
          context.report({
            node,
            messageId: 'sxProp',
          })
        }
      },
    }
  },
}
