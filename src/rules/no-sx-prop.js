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
        if (node.name.type === 'JSXMemberExpression') {
          if (node.name.object.type === 'JSXIdentifier' && node.name.property.type === 'JSXIdentifier') {
            const name = `${node.name.object.name}.${node.name.property.name}`
            if (forbidden.has(name)) {
              context.report({
                node,
                messageId: 'sxProp',
              })
            }
          }
        } else if (node.name.type === 'JSXIdentifier') {
          if (forbidden.has(node.name.name)) {
            context.report({
              node,
              messageId: 'sxProp',
            })
          }
        }
      },
    }
  },
}
