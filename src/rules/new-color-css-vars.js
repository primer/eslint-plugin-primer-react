const cssVars = require('../utils/css-variable-map.json')

const reportError = (propertyName, valueNode, context) => {
  // performance optimisation: exit early
  if (valueNode.type !== 'Literal') return
  // get property value
  const value = valueNode.value
  // return if value is not a string
  if (typeof value !== 'string') return
  // return if value does not include variable
  if (!value.includes('var(')) return

  const varRegex = /var\([^)]+\)/g

  const match = value.match(varRegex)
  if (!match) return
  const vars = match.flatMap(match =>
    match
      .slice(4, -1)
      .trim()
      .split(/\s*,\s*/g),
  )

  for (const cssVar of vars) {
    const cssVarObject = cssVars[cssVar]
    const varObjectForProp = cssVarObject?.find(prop => prop.props.includes(propertyName))
    if (varObjectForProp?.replacement) {
      context.report({
        node: valueNode,
        message: `Replace var(${cssVar}) with var(${varObjectForProp.replacement}, var(${cssVar}))`,
        fix(fixer) {
          const fixedString = value.replaceAll(cssVar, `${varObjectForProp.replacement}, var(${cssVar})`)
          return fixer.replaceText(valueNode, valueNode.type === 'Literal' ? `"${fixedString}"` : fixedString)
        },
      })
    }
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    fixable: 'code',
    docs: {
      description: 'Upgrade legacy CSS variables to Primitives v8 in sx prop',
    },
    schema: [
      {
        type: 'object',
        properties: {
          skipImportCheck: {
            type: 'boolean',
          },
          checkAllStrings: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    return {
      ['JSXAttribute[name.name=sx] ObjectExpression Property, JSXAttribute[name.name=style] ObjectExpression Property']:
        function (node) {
          const propertyName = node.key.name
          if (node.value?.type === 'Literal') {
            reportError(propertyName, node.value, context)
          } else if (node.value?.type === 'ConditionalExpression') {
            reportError(propertyName, node.value.consequent, context)
            reportError(propertyName, node.value.alternate, context)
          }
        },
      ['JSXAttribute[name.name!=sx][name.name!=style]']: function (node) {
        const propertyName = node.name.name
        if (node.value?.type === 'Literal') {
          reportError(propertyName, node.value, context)
        } else if (node.value?.type === 'JSXExpressionContainer') {
          reportError(propertyName, node.value.expression.consequent, context)
          reportError(propertyName, node.value.expression.alternate, context)
        }
      },
    }
  },
}
