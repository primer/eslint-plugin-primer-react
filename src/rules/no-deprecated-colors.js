const deprecations = require('@primer/primitives/dist/deprecations/colors_v2')

const styledSystemColorProps = ['color', 'bg', 'backgroundColor', 'borderColor', 'textShadow', 'boxShadow']

module.exports = {
  meta: {
    fixable: 'code'
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        // Skip if component was not imported from @primer/components
        if (!isImportedFrom(/^@primer\/components/, node.name, context.getScope(node))) {
          return
        }

        for (const attribute of node.attributes) {
          if (!attribute.name || !attribute.value) {
            continue
          }

          const propName = attribute.name.name
          const propValue = attribute.value.value

          // Check if styled-system color prop is using a deprecated color
          if (styledSystemColorProps.includes(propName) && Object.keys(deprecations).includes(propValue)) {
            const replacement = deprecations[propValue]

            if (replacement === null) {
              // No replacement
              context.report({
                node: attribute.value,
                message: `"${propValue}" is deprecated. Go to https://primer.style/primitives or reach out in the #primer channel on Slack to find a suitable replacement.`
              })
            } else if (Array.isArray(replacement)) {
              // Multiple possible replacements
              context.report({
                node: attribute.value,
                message: `"${propValue}" is deprecated.`,
                suggest: replacement.map(replacementValue => ({
                  desc: `Use "${replacementValue}" instead.`,
                  fix(fixer) {
                    return fixer.replaceText(attribute.value, JSON.stringify(replacementValue))
                  }
                }))
              })
            } else {
              // One replacement
              context.report({
                node: attribute.value,
                message: `"${propValue}" is deprecated. Use "${replacement}" instead.`,
                fix(fixer) {
                  return fixer.replaceText(attribute.value, JSON.stringify(replacement))
                }
              })
            }
          }
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
