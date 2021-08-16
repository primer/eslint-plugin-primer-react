const deprecations = require('@primer/primitives/dist/deprecations/colors_v2')

const styledSystemColorProps = ['color', 'bg', 'backgroundColor', 'borderColor', 'textShadow', 'boxShadow']

module.exports = {
  meta: {
    fixable: 'code'
  },
  create(context) {
    return {
      // TODO: check get() and themeGet()
      JSXOpeningElement(node) {
        // TODO: check if jsx element was imported from @primer/components

        for (const attribute of node.attributes) {
          const propName = attribute.name.name
          const propValue = attribute.value.value

          if (styledSystemColorProps.includes(propName) && Object.keys(deprecations).includes(propValue)) {
            const replacement = deprecations[propValue]

            if (replacement === null) {
              // No replacement
              context.report({
                node: attribute.value,
                message: `"${propValue}" is deprecated. See https://primer.style/primitives or reach out in the #primer Slack channel to find a suitable replacement.`
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
