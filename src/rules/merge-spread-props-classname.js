module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      mergeClassName:
        'When using spread props, className should be merged with clsx to avoid unintentional overrides. Use: className={{clsx({{spreadPropName}}.className, {{currentValue}})}}',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const attributes = node.attributes

        // Find spread props and className
        const spreadProps = []
        let classNameAttr = null

        for (const attr of attributes) {
          if (attr.type === 'JSXSpreadAttribute') {
            spreadProps.push(attr)
          } else if (attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'className') {
            classNameAttr = attr
          }
        }

        // Only report if we have both spread props and className
        if (spreadProps.length === 0 || !classNameAttr) {
          return
        }

        // Check if className comes after spread props
        const classNameIndex = attributes.indexOf(classNameAttr)
        const hasSpreadBeforeClassName = spreadProps.some(spread => {
          return attributes.indexOf(spread) < classNameIndex
        })

        if (!hasSpreadBeforeClassName) {
          return
        }

        // Check if className value is already using clsx or similar merging
        const classNameValue = classNameAttr.value
        if (classNameValue && classNameValue.type === 'JSXExpressionContainer') {
          const expression = classNameValue.expression
          // Check if it's a call expression with clsx, classnames, or similar
          if (
            expression.type === 'CallExpression' &&
            expression.callee.type === 'Identifier' &&
            (expression.callee.name === 'clsx' ||
              expression.callee.name === 'classnames' ||
              expression.callee.name === 'classNames' ||
              expression.callee.name === 'cn')
          ) {
            // Already using a class merging utility, don't report
            return
          }
        }

        const sourceCode = context.sourceCode

        // Get the name of the spread prop (e.g., "rest", "props", etc.)
        const firstSpreadBeforeClassName = spreadProps
          .filter(spread => attributes.indexOf(spread) < classNameIndex)
          .sort((a, b) => attributes.indexOf(a) - attributes.indexOf(b))[0]

        const spreadArgument = firstSpreadBeforeClassName.argument
        const spreadPropName = spreadArgument.name || sourceCode.getText(spreadArgument)

        // Get current className value as string
        let currentValue = sourceCode.getText(classNameAttr.value)
        if (classNameValue && classNameValue.type === 'JSXExpressionContainer') {
          currentValue = sourceCode.getText(classNameValue.expression)
        } else if (classNameValue && classNameValue.type === 'Literal') {
          currentValue = `"${classNameValue.value}"`
        }

        // Don't provide a fix if currentValue is empty
        if (!currentValue) {
          context.report({
            node: classNameAttr,
            messageId: 'mergeClassName',
            data: {
              spreadPropName,
              currentValue: 'value',
            },
          })
          return
        }

        context.report({
          node: classNameAttr,
          messageId: 'mergeClassName',
          data: {
            spreadPropName,
            currentValue,
          },
          fix(fixer) {
            // Create the merged className expression
            const mergedClassName = `{clsx(${spreadPropName}.className, ${currentValue})}`
            return fixer.replaceText(classNameAttr.value, mergedClassName)
          },
        })
      },
    }
  },
}
