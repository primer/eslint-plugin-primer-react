const {isPrimerComponent} = require('../utils/isPrimerComponent')
const {pick} = require('@styled-system/props')
const {some, last} = require('lodash')

// Components for which we allow all styled system props
const excludedComponents = new Set(['Box', 'Text'])

// Components for which we allow a set of prop names
const excludedComponentProps = new Map([
  ['Avatar', new Set(['size'])],
  ['Label', new Set(['variant'])],
  ['ProgressBar', new Set(['bg'])],
  ['Spinner', new Set(['size'])]
])

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    messages: {
      noSystemProps: 'Styled-system props are deprecated ({{componentName}} called with props: {{ propNames }})'
    }
  },
  create(context) {
    return {
      JSXOpeningElement(jsxNode) {
        if (!isPrimerComponent(jsxNode.name, context.getScope(jsxNode))) return
        if (excludedComponents.has(jsxNode.name.name)) return

        // Create an object mapping from prop name to the AST node for that attribute
        const propsByNameObject = jsxNode.attributes.reduce((object, cur) => {
          // We don't do anything about spreads for now — only named attributes:
          if (cur.type === 'JSXAttribute') {
            object[cur.name.name] = cur
          }

          return object
        }, {})

        // Create an array of bad prop attribute nodes
        let badProps = Object.values(pick(propsByNameObject))

        // Filter out our exceptional props
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
              componentName: jsxNode.name.name,
              propNames: badProps.map(a => a.name.name).join(', ')
            },
            fix(fixer) {
              const existingSxProp = jsxNode.attributes.find(
                attribute => attribute.type === 'JSXAttribute' && attribute.name.name === 'sx'
              )
              const badPropStylesMap = stylesMapFromPropNodes(badProps, context)
              if (existingSxProp && existingSxProp.value.expression.type !== 'ObjectExpression') {
                return
              }

              const stylesToAdd = existingSxProp
                ? excludeSxEntriesFromStyleMap(badPropStylesMap, existingSxProp)
                : badPropStylesMap

              return [
                // Remove the bad props:
                ...badProps.map(node => fixer.remove(node)),
                ...(stylesToAdd.size > 0
                  ? [
                      existingSxProp
                        ? // Update an existing sx prop:
                          fixer.insertTextAfter(
                            last(existingSxProp.value.expression.properties),
                            `, ${objectEntriesStringFromStylesMap(stylesToAdd)}`
                          )
                        : // Insert new sx prop
                          fixer.insertTextAfter(last(jsxNode.attributes), sxPropTextFromStylesMap(badPropStylesMap))
                    ]
                  : [])
              ]
            }
          })
        }
      }
    }
  }
}

const sxPropTextFromStylesMap = styles => {
  return `sx={{${objectEntriesStringFromStylesMap(styles)}}}`
}

const objectEntriesStringFromStylesMap = styles => {
  return [...styles].map(([name, value]) => `${name}: ${value}`).join(', ')
}

// Given an array of styled prop attributes, return a mapping from attribute to expression
const stylesMapFromPropNodes = (badProps, context) => {
  return new Map(
    badProps.map(a => [
      a.name.name,
      a.value === null ? 'true' : a.value.raw || context.getSourceCode().getText(a.value.expression)
    ])
  )
}

// Given a style map and an existing sx prop, return a style map containing
// only the entries that aren't already overridden by an sx object entry
const excludeSxEntriesFromStyleMap = (stylesMap, sxProp) => {
  if (
    !sxProp.value ||
    sxProp.value.type !== 'JSXExpressionContainer' ||
    sxProp.value.expression.type != 'ObjectExpression'
  ) {
    return stylesMap
  }
  return new Map(
    [...stylesMap].filter(([key, _value]) => {
      return !some(sxProp.value.expression.properties, p => p.type === 'Property' && p.key.name === key)
    })
  )
}
