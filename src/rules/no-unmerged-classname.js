module.exports = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      noUnmergedClassName:
        'className may not be merged correctly with spread props. Consider using clsx(className, "...") to merge className from spread props.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const attributes = node.attributes

        // Check if there's a spread attribute
        const hasSpreadAttribute = attributes.some(attr => attr.type === 'JSXSpreadAttribute')
        if (!hasSpreadAttribute) {
          return
        }

        // Check if there's a className attribute
        const classNameAttr = attributes.find(
          attr => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'className',
        )
        if (!classNameAttr) {
          return
        }

        // Check if className comes after a spread attribute
        const spreadIndex = attributes.findIndex(attr => attr.type === 'JSXSpreadAttribute')
        const classNameIndex = attributes.findIndex(attr => attr === classNameAttr)

        if (spreadIndex < classNameIndex) {
          // className comes after spread, so it would override - this is OK
          // But we need to check if the className value is merging with the spread props
          if (classNameAttr.value && classNameAttr.value.type === 'JSXExpressionContainer') {
            const expression = classNameAttr.value.expression

            // Check if it's a call to clsx or similar merging function
            if (expression.type === 'CallExpression') {
              const callee = expression.callee
              // If it's calling clsx, classNames, or similar, assume it's merging correctly
              if (
                callee.type === 'Identifier' &&
                (callee.name === 'clsx' || callee.name === 'classNames' || callee.name === 'cn')
              ) {
                return // This is likely merging correctly
              }
            }
          }

          // Check if className is a simple string literal (not merging)
          if (
            classNameAttr.value &&
            (classNameAttr.value.type === 'Literal' ||
              (classNameAttr.value.type === 'JSXExpressionContainer' &&
                classNameAttr.value.expression.type !== 'CallExpression'))
          ) {
            context.report({
              node: classNameAttr,
              messageId: 'noUnmergedClassName',
            })
          }
        }
      },
    }
  },
}
