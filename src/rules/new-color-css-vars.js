const cssVars = require('../utils/css-variable-map.json')

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
    const styledSystemProps = [
      'bg',
      'backgroundColor',
      'color',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'border',
      'boxShadow',
      'caretColor',
    ]

    function checkForVariables(node, valueNode) {
      // performance optimisation: exit early
      if (valueNode.type !== 'Literal') return
      const rawText = valueNode.value
      if (!rawText.includes('var(')) return

      const propertyName = node.key.name

      const varRegex = /var\([^\)]+\)/g

      const match = rawText.match(varRegex)
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
              const fixedString = rawText.replaceAll(cssVar, `${varObjectForProp.replacement}, var(${cssVar})`)
              return fixer.replaceText(valueNode, valueNode.type === 'Literal' ? `'${fixedString}'` : fixedString)
            },
          })
        }
      }
    }

    return {
      ['JSXAttribute[name.name=sx] ObjectExpression Property']: function (node) {
        if (node.value.type === 'Literal') {
          checkForVariables(node, node.value)
        } else if (node.value.type === 'ConditionalExpression') {
          checkForVariables(node, node.value.consequent)
          checkForVariables(node, node.value.alternate)
        }
      },
    }
  },
}
