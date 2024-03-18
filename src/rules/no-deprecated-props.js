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
      description: 'Avoid using deprecated props from @primer/react',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
    messages: {
      titlePropDeprecated: 'The `title` prop is deprecated. Please use `ActionList.GroupHeading` instead.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const openingElName = getJSXOpeningElementName(node)
        if (openingElName !== 'ActionList.Group') {
          return
        }
        const title = getJSXOpeningElementAttribute(node, 'title')

        if (title !== undefined) {
          context.report({
            node,
            messageId: 'titlePropDeprecated',
            fix(fixer) {
              const groupTitle = title.value.value
              const start = title.range[0]
              const end = title.range[1]
              return [
                fixer.removeRange([start - 1, end]), // remove the space before the title as well
                fixer.insertTextAfterRange(
                  [node.range[1], node.range[1]],
                  `<ActionList.GroupHeading>${groupTitle}</ActionList.GroupHeading>`,
                ),
              ]
            },
          })
        }
      },
    }
  },
}
