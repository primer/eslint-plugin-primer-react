const deprecations = require('@primer/primitives/dist/removed/colors')
const traverse = require('eslint-traverse')
const {isImportedFrom} = require('../utils/is-imported-from')
const {isPrimerComponent} = require('../utils/is-primer-component')

const styledSystemColorProps = ['color', 'bg', 'backgroundColor', 'borderColor', 'textShadow', 'boxShadow']

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
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
  create(context) {
    // If `skipImportCheck` is true, this rule will check for deprecated colors
    // used in any components (not just ones that are imported from `@primer/components`).
    const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false

    const checkAllStrings = context.options[0] ? context.options[0].checkAllStrings : false

    // Track visited string literals to avoid reporting the same string multiple times
    const visitedStrings = new Set()

    return {
      Literal(node) {
        if (checkAllStrings && Object.keys(deprecations).includes(node.value) && !visitedStrings.has(node)) {
          replaceDeprecatedColor(context, node, node.value)
        }
      },
      JSXOpeningElement(node) {
        // Skip if component was not imported from @primer/components
        if (!skipImportCheck && !isPrimerComponent(node.name, context.getScope(node))) {
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
                  visitedStrings.add(prop.value)
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
            visitedStrings.add(attribute.value)
          }
        }
      },
      CallExpression(node) {
        // Skip if not calling the `themeGet` or `get` function
        // `get` is the internal version of `themeGet` that's used in the primer/react repository
        if (
          !isThemeGet(node.callee, context.getScope(node), skipImportCheck) &&
          !isGet(node.callee, context.getScope(node))
        ) {
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

function isThemeGet(identifier, scope, skipImportCheck = false) {
  if (!skipImportCheck) {
    return isImportedFrom(/^@primer\/components/, identifier, scope) && identifier.name === 'themeGet'
  }

  return identifier.name === 'themeGet'
}

// `get` is the internal version of `themeGet` that's used in the primer/react repository.
function isGet(identifier, scope) {
  // This is a flaky way to check for the `get` function and should probably be improved.
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
