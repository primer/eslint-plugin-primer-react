const deprecations = require('@primer/primitives/dist/deprecations/colors')
const traverse = require('eslint-traverse')

const styledSystemColorProps = ['color', 'bg', 'backgroundColor', 'borderColor', 'textShadow', 'boxShadow']

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code'
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        // Skip if component was not imported from @primer/components
        if (!isPrimerComponent(node.name, context.getScope(node))) {
          return
        }

        for (const attribute of node.attributes) {
          if (!attribute.name || !attribute.value) {
            continue
          }

          const propName = attribute.name.name
          const propValue = attribute.value.value

          // Check for the sx prop
          if (propName === 'sx' && attribute.value.expression.type === 'ObjectExpression') {
            // Search all properties of the sx object (even nested properties)
            traverse(context, attribute.value, path => {
              if (path.node.type === 'Property' && path.node.value.type === 'Literal') {
                const prop = path.node
                const propName = prop.key.name
                const propValue = prop.value.value

                if (styledSystemColorProps.includes(propName) && Object.keys(deprecations).includes(propValue)) {
                  replaceDeprecatedColor(context, prop.value, propValue)
                }
              }

              // Check functions passed to sx object properties
              // (e.g. boxShadow: theme => `0 1px 2px ${theme.colors.text.primary}` )
              if (path.node.type === 'Property' && path.node.value.type === 'ArrowFunctionExpression') {
                traverse(context, path.node.value.body, path => {
                  if (path.node.type === 'MemberExpression') {
                    // Convert MemberExpression AST to string
                    const code = context.getSourceCode().getText(path.node)

                    const [param, key, ...rest] = code.split('.')
                    const name = rest.join('.')

                    if (['colors', 'shadows'].includes(key) && Object.keys(deprecations).includes(name)) {
                      replaceDeprecatedColor(
                        context,
                        path.node,
                        name,
                        str => [param, key, str].join('.'),
                        str => str
                      )
                    }

                    // Don't traverse any nested member expressions.
                    // The root-level member expression gives us all the data we need.
                    return traverse.SKIP
                  }
                })
              }
            })
          }

          // Check if styled-system color prop is using a deprecated color
          if (styledSystemColorProps.includes(propName) && Object.keys(deprecations).includes(propValue)) {
            replaceDeprecatedColor(context, attribute.value, propValue)
          }
        }
      },
      CallExpression(node) {
        // Skip if not calling the `themeGet` or `get` function
        // `get` is the internal version of `themeGet` that's used in the primer/react repository
        if (!isThemeGet(node.callee, context.getScope(node)) && !isGet(node.callee, context.getScope(node))) {
          return
        }

        const [key, ...path] = node.arguments[0].value.split('.')
        const name = path.join('.')

        if (['colors', 'shadows'].includes(key) && Object.keys(deprecations).includes(name)) {
          replaceDeprecatedColor(context, node.arguments[0], name, str => [key, str].join('.'))
        }
      }
    }
  }
}

/**
 * Get the variable declaration for the given identifier
 */
function getVariableDeclaration(scope, identifier) {
  if (scope === null) {
    return null
  }

  for (const variable of scope.variables) {
    if (variable.name === identifier.name) {
      return variable.defs[0]
    }
  }

  return getVariableDeclaration(scope.upper, identifier)
}

/**
 * Check if the given identifier is imported from the given module
 */
function isImportedFrom(moduleRegex, identifier, scope) {
  const definition = getVariableDeclaration(scope, identifier)

  // Return true if the variable was imported from the given module
  return definition && definition.type == 'ImportBinding' && moduleRegex.test(definition.parent.source.value)
}

function isPrimerComponent(identifier, scope) {
  return isImportedFrom(/^@primer\/components/, identifier, scope)
}

function isThemeGet(identifier, scope) {
  return isImportedFrom(/^@primer\/components/, identifier, scope) && identifier.name === 'themeGet'
}

function isGet(identifier, scope) {
  return isImportedFrom(/^\.\.?\/constants$/, identifier, scope) && identifier.name === 'get'
}

function replaceDeprecatedColor(
  context,
  node,
  deprecatedName,
  transformName = str => str,
  transformReplacementValue = str => JSON.stringify(str)
) {
  const replacement = deprecations[deprecatedName]

  if (replacement === null) {
    // No replacement
    context.report({
      node,
      message: `"${transformName(
        deprecatedName
      )}" is deprecated. Go to https://primer.style/primitives or reach out in the #primer channel on Slack to find a suitable replacement.`
    })
  } else if (Array.isArray(replacement)) {
    // Multiple possible replacements
    context.report({
      node,
      message: `"${transformName(deprecatedName)}" is deprecated.`,
      suggest: replacement.map(replacementValue => ({
        desc: `Use "${transformName(replacementValue)}" instead.`,
        fix(fixer) {
          return fixer.replaceText(node, transformReplacementValue(transformName(replacementValue)))
        }
      }))
    })
  } else {
    // One replacement
    context.report({
      node,
      message: `"${transformName(deprecatedName)}" is deprecated. Use "${transformName(replacement)}" instead.`,
      fix(fixer) {
        return fixer.replaceText(node, transformReplacementValue(transformName(replacement)))
      }
    })
  }
}
