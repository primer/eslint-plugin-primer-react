const cssVars = require('../utils/css-variable-map.json')

const reportOutdatedVariables = (node, valueNode, context) => {
  // performance optimisation: exit early
  if (valueNode.type !== 'Literal') return
  // get property value
  const propertyValue = valueNode.value
  // return if value is not a string
  if (typeof propertyValue !== 'string') return
  // return if value does not include variable
  if (!propertyValue.includes('var(')) return
  // get property name
  const propertyName = node.key.name

  const varRegex = /var\([^)]+\)/g

  const match = propertyValue.match(varRegex)
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
          const fixedString = propertyValue.replaceAll(cssVar, `${varObjectForProp.replacement}, var(${cssVar})`)
          return fixer.replaceText(valueNode, valueNode.type === 'Literal' ? `'${fixedString}'` : fixedString)
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
      ['JSXAttribute[name.name=sx] ObjectExpression Property']: function (node) {
        if (node.value.type === 'Literal') {
          reportOutdatedVariables(node, node.value, context)
        } else if (node.value.type === 'ConditionalExpression') {
          reportOutdatedVariables(node, node.value.consequent, context)
          reportOutdatedVariables(node, node.value.alternate, context)
        }
      },
    }
  },
}
