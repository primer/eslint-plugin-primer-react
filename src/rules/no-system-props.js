const {isPrimerComponent} = require('../utils/isPrimerComponent')
const {pick} = require('@styled-system/props')

// Components for which we allow all styled system props
const excludedComponents = new Set(['Box', 'Text'])

// Components for which we allow a set of prop names
const excludedComponentProps = new Map([['ProgressBar', new Set(['bg'])]])

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages: {
      noSystemProps: 'Styled-system props are deprecated ({{ propNames }})'
    }
  },
  create(context) {
    return {
      JSXOpeningElement(jsxNode) {
        if (!isPrimerComponent(jsxNode.name, context.getScope(jsxNode))) return
        if (excludedComponents.has(jsxNode.name.name)) return

        const propsByNameMap = jsxNode.attributes.reduce((prev, cur) => {
          prev[cur.name.name] = cur
          return prev
        }, {})

        let badProps = Object.values(pick(propsByNameMap))

        badProps = badProps.filter(prop => {
          const excludedProps = excludedComponentProps.get(jsxNode.name.name)
          if (!excludedProps) {
            return true
          }
          return !excludedProps.has(prop.name.name)
        })

        if (badProps.length !== 0) {
          context.report({
            node: jsxNode,
            messageId: 'noSystemProps',
            data: {
              propNames: badProps.map(a => a.name.name).join(', ')
            },
            fix(fixer) {
              const existingSxProp = jsxNode.attributes.find(attribute => attribute.name.name === 'sx')
              const badPropStylesMap = stylesMapFromPropNodes(badProps, context)
              if (existingSxProp && existingSxProp.value.expression.type !== 'ObjectExpression') {
                return
              }
              return [
                ...badProps.map(node => fixer.remove(node)),
                existingSxProp
                  ? fixer.replaceText(
                      existingSxProp,
                      sxPropTextFromStylesMap(new Map([...badPropStylesMap, ...stylesMapfromSxProp(existingSxProp)]))
                    )
                  : fixer.insertTextAfter(
                      jsxNode.attributes[jsxNode.attributes.length - 1],
                      sxPropTextFromStylesMap(badPropStylesMap)
                    )
              ]
            }
          })
        }
      }
    }
  }
}

const sxPropTextFromStylesMap = styles => {
  return `sx={{${[...styles].map(([name, value]) => `${name}: ${value}`).join(', ')}}}`
}

const stylesMapfromSxProp = sxProp => {
  return new Map(sxProp.value.expression.properties.map(prop => [prop.key.name, prop.value.raw]))
}

const stylesMapFromPropNodes = (badProps, context) => {
  return new Map(badProps.map(a => [a.name.name, a.value.raw || context.getSourceCode().getText(a.value.expression)]))
}
