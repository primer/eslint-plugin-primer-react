const cssVars = require('../utils/css-variable-map.json')

module.exports = {
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    fixable: 'code',
    docs: {
      description: 'Upgrade legacy CSS variables to Primitives v8 in sx prop'
    },
    schema: [
      {
        type: 'object',
        properties: {
          skipImportCheck: {
            type: 'boolean'
          },
          checkAllStrings: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
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
      'caretColor'
    ]

    return {
      /** @param {import('eslint').Rule.Node} node */
      JSXAttribute(node) {
        if (node.name.name === 'sx') {
          if (node.value.expression.type === 'ObjectExpression') {
            // example: sx={{ color: 'fg.default' }} or sx={{ ':hover': {color: 'fg.default'} }}
            const rawText = context.sourceCode.getText(node.value)
            checkForVariables(node.value, rawText)
          } else if (node.value.expression.type === 'Identifier') {
            // example: sx={baseStyles}
            const variableScope = context.sourceCode.getScope(node.value.expression)
            const variable = variableScope.set.get(node.value.expression.name)

            // if variable is not defined in scope, give up (could be imported from different file)
            if (!variable) return

            const variableDeclarator = variable.identifiers[0].parent
            const rawText = context.sourceCode.getText(variableDeclarator)
            checkForVariables(variableDeclarator, rawText)
          } else {
            // worth a try!
            const rawText = context.sourceCode.getText(node.value)
            checkForVariables(node.value, rawText)
          }
        } else if (
          styledSystemProps.includes(node.name.name) &&
          node.value &&
          node.value.type === 'Literal' &&
          typeof node.value.value === 'string'
        ) {
          checkForVariables(node.value, node.value.value)
        }
      }
    }

    function checkForVariables(node, rawText) {
      // performance optimisation: exit early
      if (!rawText.includes('var')) return

      for (const cssVar of Object.keys(cssVars)) {
        if (Array.isArray(cssVars[cssVar])) {
          for (const cssVarObject of cssVars[cssVar]) {
            const regex = new RegExp(`var\\(${cssVar}\\)`, 'g')
            if (
              cssVarObject.props.some(prop => rawText.includes(prop)) &&
              regex.test(rawText) &&
              !rawText.includes(cssVarObject.replacement)
            ) {
              const fixedString = rawText.replace(regex, `var(${cssVarObject.replacement}, var(${cssVar}))`)
              if (!rawText.includes(fixedString)) {
                context.report({
                  node,
                  message: `Replace var(${cssVar}) with var(${cssVarObject.replacement}, var(${cssVar}))`,
                  fix(fixer) {
                    return fixer.replaceText(node, node.type === 'Literal' ? `"${fixedString}"` : fixedString)
                  }
                })
              }
            }
          }
        }
      }
    }
  }
}
