const cssVars = require('../utils/new-color-css-vars-map')

const reportError = (propertyName, valueNode, context) => {
  // performance optimisation: exit early
  if (valueNode.type !== 'Literal' && valueNode.type !== 'TemplateElement') return
  // get property value
  const value = valueNode.type === 'Literal' ? valueNode.value : valueNode.value.cooked
  // return if value is not a string
  if (typeof value !== 'string') return
  // return if value does not include variable
  if (!value.includes('var(')) return

  const varRegex = /var\([^(),)]+\)/g

  const match = value.match(varRegex)
  // return if no matches
  if (!match) return
  const vars = match.flatMap(match =>
    match
      .slice(4, -1)
      .trim()
      .split(/\s*,\s*/g),
  )
  for (const cssVar of vars) {
    // return if no repalcement exists
    if (!cssVars?.includes(cssVar)) return
    // report the error
    context.report({
      node: valueNode,
      message: `Expected a fallback value for CSS variable ${cssVar}. New color variables fallbacks, check primer.style/primitives to find the correct value.`,
    })
  }
}

const reportOnObject = (node, context) => {
  const propertyName = node.key.name
  if (node.value?.type === 'Literal') {
    reportError(propertyName, node.value, context)
  } else if (node.value?.type === 'ConditionalExpression') {
    reportError(propertyName, node.value.consequent, context)
    reportError(propertyName, node.value.alternate, context)
  }
}

const reportOnProperty = (node, context) => {
  const propertyName = node.name.name
  if (node.value?.type === 'Literal') {
    reportError(propertyName, node.value, context)
  } else if (node.value?.type === 'JSXExpressionContainer' && node.value.expression?.type === 'ConditionalExpression') {
    reportError(propertyName, node.value.expression.consequent, context)
    reportError(propertyName, node.value.expression.alternate, context)
  }
}

const reportOnValue = (node, context) => {
  if (node?.type === 'Literal') {
    reportError(undefined, node, context)
  } else if (node?.type === 'JSXExpressionContainer' && node.expression?.type === 'ConditionalExpression') {
    reportError(undefined, node.value.expression.consequent, context)
    reportError(undefined, node.value.expression.alternate, context)
  }
}

const reportOnTemplateElement = (node, context) => {
  reportError(undefined, node, context)
}

module.exports = {
  meta: {
    type: 'suggestion',
  },
  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    return {
      // sx OR style property on elements
      ['JSXAttribute:matches([name.name=sx], [name.name=style]) ObjectExpression Property']: node =>
        reportOnObject(node, context),
      // property on element like stroke or fill
      ['JSXAttribute[name.name!=sx][name.name!=style]']: node => reportOnProperty(node, context),
      // variable that is a value
      [':matches(VariableDeclarator, ReturnStatement) > Literal']: node => reportOnValue(node, context),
      // variable that is a value
      [':matches(VariableDeclarator, ReturnStatement) > TemplateElement']: node =>
        reportOnTemplateElement(node, context),
    }
  },
}
