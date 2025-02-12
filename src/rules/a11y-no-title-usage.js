const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

module.exports = {
  meta: {
    type: 'error', // TODO: Confirm the type
    docs: {
      description: 'Disallow usage of title attribute on some components',
      recommended: true,
      url: null, // TODO: Add URL
    },
    messages: {
      noTitleOnRelativeTime: 'Avoid using the title attribute on RelativeTime.',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    return {
      JSXOpeningElement(jsxNode) {
        const title = getJSXOpeningElementAttribute(jsxNode, 'noTitle')

        if (title && title.value && title.value.expression && title.value.expression.value !== true) {
          context.report({
            node: title,
            messageId: 'noTitleOnRelativeTime',
            fix(fixer) {
              const start = title.range[0] - 1 // Accounts for whitespace
              const end = title.range[1]
              return fixer.removeRange([start, end])
            },
          })
        }
      },
    }
  },
}
