'use strict'

const url = require('../url')

const forbidden = new Set([
  'SegmentedControl',
  // 'ActionList',
  // 'ActionList.Divider',
  // 'ActionList.Group',
  // 'ActionList.Item',
  // 'ActionList.LeadingVisual',
  // 'ActionList.LinkItem',

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
        if (!forbidden.has(node.name.name)) {
          return
        }

        context.report({
          node,
          messageId: 'sxProp',
        })
      },
    }
  },
}
