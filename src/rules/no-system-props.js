const {isPrimerComponent} = require('../utils/is-primer-component')
const {pick} = require('@styled-system/props')
const {some, last} = require('lodash')

// Components for which we allow all styled system props
const alwaysExcludedComponents = new Set([
  'BaseStyles' // BaseStyles will be deprecated eventually
])

// Excluded by default, but optionally included:
const utilityComponents = new Set(['Box', 'Text'])

// Components for which we allow a set of prop names
const excludedComponentProps = new Map([
  ['AnchoredOverlay', new Set(['width', 'height'])],
  ['Avatar', new Set(['size'])],
  ['Dialog', new Set(['width', 'height'])],
  ['ProgressBar', new Set(['bg'])],
  ['Spinner', new Set(['size'])],
  ['StyledOcticon', new Set(['size'])]
])

const alwaysExcludedProps = new Set(['variant'])

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        properties: {
          includeUtilityComponents: {
            type: 'boolean'
          }
        }
      }
    ],
    messages: {
      noSystemProps: 'Styled-system props are deprecated ({{ componentName }} called with props: {{ propNames }})'
    }
  },
  create(context) {
    const includeUtilityComponents = context.options[0] ? context.options[0].includeUtilityComponents : false

    const excludedComponents = new Set([
      ...alwaysExcludedComponents,
      ...(includeUtilityComponents ? [] : utilityComponents)
    ])

    return {
      JSXOpeningElement(jsxNode) {
        if (!isPrimerComponent(jsxNode.name, context.getScope(jsxNode))) return
        if (excludedComponents.has(jsxNode.name.name)) return

        // Create an object mapping from prop name to the AST node for that attribute
        const propsByNameObject = jsxNode.attributes.reduce((object, attribute) => {
          // We don't do anything about spreads for now — only named attributes
          if (attribute.type === 'JSXAttribute') {
            object[attribute.name.name] = attribute
          }

          return object
        }, {})

        // Create an array of system prop attribute nodes
        let systemProps = Object.values(pick(propsByNameObject))

        let excludedProps = excludedComponentProps.has(jsxNode.name.name)
          ? new Set([...alwaysExcludedProps, ...excludedComponentProps.get(jsxNode.name.name)])
          : alwaysExcludedProps

        // Filter out our exceptional props
        systemProps = systemProps.filter(prop => {
          return !excludedProps.has(prop.name.name)
        })

        if (systemProps.length !== 0) {
          context.report({
            node: jsxNode,
            messageId: 'noSystemProps',
            data: {
              componentName: jsxNode.name.name,
              propNames: systemProps.map(a => a.name.name).join(', ')
            },
            fix(fixer) {
              const existingSxProp = jsxNode.attributes.find(
                attribute => attribute.type === 'JSXAttribute' && attribute.name.name === 'sx'
              )
              const systemPropstylesMap = stylesMapFromPropNodes(systemProps, context)
              if (existingSxProp && existingSxProp.value.expression.type !== 'ObjectExpression') {
                return
              }

              const stylesToAdd = existingSxProp
                ? excludeSxEntriesFromStyleMap(systemPropstylesMap, existingSxProp)
                : systemPropstylesMap

              return [
                // Remove the bad props
                ...systemProps.map(node => fixer.remove(node)),
                ...(stylesToAdd.size > 0
                  ? [
                      existingSxProp
                        ? // Update an existing sx prop
                          fixer.insertTextAfter(
                            last(existingSxProp.value.expression.properties),
                            `, ${objectEntriesStringFromStylesMap(stylesToAdd)}`
                          )
                        : // Insert new sx prop
                          fixer.insertTextAfter(last(jsxNode.attributes), sxPropTextFromStylesMap(systemPropstylesMap))
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
  return ` sx={{${objectEntriesStringFromStylesMap(styles)}}}`
}

const objectEntriesStringFromStylesMap = styles => {
  return [...styles].map(([name, value]) => `${name}: ${value}`).join(', ')
}

// Given an array of styled prop attributes, return a mapping from attribute to expression
const stylesMapFromPropNodes = (systemProps, context) => {
  return new Map(
    systemProps.map(a => [
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
