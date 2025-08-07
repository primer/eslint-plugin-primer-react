'use strict'

const url = require('../url')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')

// Components that should be imported from @primer/styled-react when used with sx prop
const styledComponents = new Set([
  'ActionList',
  'ActionMenu',
  'Box',
  'Breadcrumbs',
  'Button',
  'Flash',
  'FormControl',
  'Heading',
  'IconButton',
  'Label',
  'Link',
  'LinkButton',
  'PageLayout',
  'Text',
  'TextInput',
  'Truncate',
  'Octicon',
  'Dialog',
])

// Types that should be imported from @primer/styled-react
const styledTypes = new Set(['BoxProps', 'SxProp', 'BetterSystemStyleObject'])

// Utilities that should be imported from @primer/styled-react
const styledUtilities = new Set(['sx'])

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce importing components that use sx prop from @primer/styled-react',
      recommended: false,
      url: url(module),
    },
    fixable: 'code',
    schema: [],
    messages: {
      useStyledReactImport: 'Import {{ componentName }} from "@primer/styled-react" when using with sx prop',
      useStyledReactImportWithAlias:
        'Import {{ componentName }} as {{ aliasName }} from "@primer/styled-react" when using with sx prop (conflicts with non-sx usage)',
      useAliasedComponent: 'Use {{ aliasName }} instead of {{ componentName }} when using sx prop',
      moveToStyledReact: 'Move {{ importName }} import to "@primer/styled-react"',
      usePrimerReactImport: 'Import {{ componentName }} from "@primer/react" when not using sx prop',
    },
  },
  create(context) {
    const componentsWithSx = new Set()
    const componentsWithoutSx = new Set() // Track components used without sx
    const allUsedComponents = new Set() // Track all used components
    const primerReactImports = new Map() // Map of component name to import node
    const styledReactImports = new Map() // Map of components imported from styled-react to import node
    const jsxElementsWithSx = [] // Track JSX elements that use sx prop

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value

        if (importSource === '@primer/react') {
          // Track imports from @primer/react
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              const importedName = specifier.imported.name
              if (
                styledComponents.has(importedName) ||
                styledTypes.has(importedName) ||
                styledUtilities.has(importedName)
              ) {
                primerReactImports.set(importedName, {node, specifier})
              }
            }
          }
        } else if (importSource === '@primer/styled-react') {
          // Track what's imported from styled-react
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              const importedName = specifier.imported.name
              styledReactImports.set(importedName, {node, specifier})
            }
          }
        }
      },

      JSXElement(node) {
        const openingElement = node.openingElement
        const componentName = getJSXOpeningElementName(openingElement)

        // Track all used components that are in our styled components list
        if (styledComponents.has(componentName)) {
          allUsedComponents.add(componentName)

          // Check if this component has an sx prop
          const hasSxProp = openingElement.attributes.some(
            attr => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'sx',
          )

          if (hasSxProp) {
            componentsWithSx.add(componentName)
            jsxElementsWithSx.push({node, componentName, openingElement})
          } else {
            componentsWithoutSx.add(componentName)
          }
        }
      },

      'Program:exit': function () {
        // Report errors for components used with sx prop that are imported from @primer/react
        for (const componentName of componentsWithSx) {
          const importInfo = primerReactImports.get(componentName)
          if (importInfo && !styledReactImports.has(componentName)) {
            // Check if this component is also used without sx prop (conflict scenario)
            const hasConflict = componentsWithoutSx.has(componentName)

            context.report({
              node: importInfo.specifier,
              messageId: hasConflict ? 'useStyledReactImportWithAlias' : 'useStyledReactImport',
              data: hasConflict ? {componentName, aliasName: `Styled${componentName}`} : {componentName},
              fix(fixer) {
                const {node: importNode, specifier} = importInfo
                const otherSpecifiers = importNode.specifiers.filter(s => s !== specifier)

                if (hasConflict) {
                  // Use alias when there's a conflict - keep original import and add aliased import
                  const aliasName = `Styled${componentName}`
                  return fixer.insertTextAfter(
                    importNode,
                    `\nimport { ${componentName} as ${aliasName} } from '@primer/styled-react'`,
                  )
                } else {
                  // No conflict - use the original logic
                  // If this is the only import, replace the whole import
                  if (otherSpecifiers.length === 0) {
                    return fixer.replaceText(importNode, `import { ${componentName} } from '@primer/styled-react'`)
                  }

                  // Otherwise, remove from current import and add new import
                  const fixes = []

                  // Remove the specifier from current import
                  if (importNode.specifiers.length === 1) {
                    fixes.push(fixer.remove(importNode))
                  } else {
                    const isFirst = importNode.specifiers[0] === specifier
                    const isLast = importNode.specifiers[importNode.specifiers.length - 1] === specifier

                    if (isFirst) {
                      const nextSpecifier = importNode.specifiers[1]
                      fixes.push(fixer.removeRange([specifier.range[0], nextSpecifier.range[0]]))
                    } else if (isLast) {
                      const prevSpecifier = importNode.specifiers[importNode.specifiers.length - 2]
                      fixes.push(fixer.removeRange([prevSpecifier.range[1], specifier.range[1]]))
                    } else {
                      const nextSpecifier = importNode.specifiers[importNode.specifiers.indexOf(specifier) + 1]
                      fixes.push(fixer.removeRange([specifier.range[0], nextSpecifier.range[0]]))
                    }
                  }

                  // Add new import
                  fixes.push(
                    fixer.insertTextAfter(importNode, `\nimport { ${componentName} } from '@primer/styled-react'`),
                  )

                  return fixes
                }
              },
            })
          }
        }

        // Report on JSX elements that should use aliased components
        for (const {node: jsxNode, componentName, openingElement} of jsxElementsWithSx) {
          const hasConflict = componentsWithoutSx.has(componentName)
          const isImportedFromPrimerReact = primerReactImports.has(componentName)

          if (hasConflict && isImportedFromPrimerReact && !styledReactImports.has(componentName)) {
            const aliasName = `Styled${componentName}`
            context.report({
              node: openingElement,
              messageId: 'useAliasedComponent',
              data: {componentName, aliasName},
              fix(fixer) {
                const fixes = []

                // Replace the component name in the JSX opening tag
                fixes.push(fixer.replaceText(openingElement.name, aliasName))

                // Replace the component name in the JSX closing tag if it exists
                if (jsxNode.closingElement) {
                  fixes.push(fixer.replaceText(jsxNode.closingElement.name, aliasName))
                }

                return fixes
              },
            })
          }
        }

        // Report errors for components used WITHOUT sx prop that are imported from @primer/styled-react
        for (const componentName of allUsedComponents) {
          // If component is used but NOT with sx prop, and it's imported from styled-react
          if (!componentsWithSx.has(componentName) && styledReactImports.has(componentName)) {
            const importInfo = styledReactImports.get(componentName)
            context.report({
              node: importInfo.specifier,
              messageId: 'usePrimerReactImport',
              data: {componentName},
              fix(fixer) {
                const {node: importNode, specifier} = importInfo
                const otherSpecifiers = importNode.specifiers.filter(s => s !== specifier)

                // If this is the only import, replace the whole import
                if (otherSpecifiers.length === 0) {
                  return fixer.replaceText(importNode, `import { ${componentName} } from '@primer/react'`)
                }

                // Otherwise, remove from current import and add new import
                const fixes = []

                // Remove the specifier from current import
                if (importNode.specifiers.length === 1) {
                  fixes.push(fixer.remove(importNode))
                } else {
                  const isFirst = importNode.specifiers[0] === specifier
                  const isLast = importNode.specifiers[importNode.specifiers.length - 1] === specifier

                  if (isFirst) {
                    const nextSpecifier = importNode.specifiers[1]
                    fixes.push(fixer.removeRange([specifier.range[0], nextSpecifier.range[0]]))
                  } else if (isLast) {
                    const prevSpecifier = importNode.specifiers[importNode.specifiers.length - 2]
                    fixes.push(fixer.removeRange([prevSpecifier.range[1], specifier.range[1]]))
                  } else {
                    const nextSpecifier = importNode.specifiers[importNode.specifiers.indexOf(specifier) + 1]
                    fixes.push(fixer.removeRange([specifier.range[0], nextSpecifier.range[0]]))
                  }
                }

                // Add new import
                fixes.push(fixer.insertTextAfter(importNode, `\nimport { ${componentName} } from '@primer/react'`))

                return fixes
              },
            })
          }
        }

        // Also report for types and utilities that should always be from styled-react
        for (const [importName, importInfo] of primerReactImports) {
          if ((styledTypes.has(importName) || styledUtilities.has(importName)) && !styledReactImports.has(importName)) {
            context.report({
              node: importInfo.specifier,
              messageId: 'moveToStyledReact',
              data: {importName},
              fix(fixer) {
                const {node: importNode, specifier} = importInfo
                const otherSpecifiers = importNode.specifiers.filter(s => s !== specifier)

                // If this is the only import, replace the whole import
                if (otherSpecifiers.length === 0) {
                  const prefix = styledTypes.has(importName) ? 'type ' : ''
                  return fixer.replaceText(importNode, `import { ${prefix}${importName} } from '@primer/styled-react'`)
                }

                // Otherwise, remove from current import and add new import
                const fixes = []

                // Remove the specifier from current import
                if (importNode.specifiers.length === 1) {
                  fixes.push(fixer.remove(importNode))
                } else {
                  const isFirst = importNode.specifiers[0] === specifier
                  const isLast = importNode.specifiers[importNode.specifiers.length - 1] === specifier

                  if (isFirst) {
                    const nextSpecifier = importNode.specifiers[1]
                    fixes.push(fixer.removeRange([specifier.range[0], nextSpecifier.range[0]]))
                  } else if (isLast) {
                    const prevSpecifier = importNode.specifiers[importNode.specifiers.length - 2]
                    fixes.push(fixer.removeRange([prevSpecifier.range[1], specifier.range[1]]))
                  } else {
                    const nextSpecifier = importNode.specifiers[importNode.specifiers.indexOf(specifier) + 1]
                    fixes.push(fixer.removeRange([specifier.range[0], nextSpecifier.range[0]]))
                  }
                }

                // Add new import
                const prefix = styledTypes.has(importName) ? 'type ' : ''
                fixes.push(
                  fixer.insertTextAfter(importNode, `\nimport { ${prefix}${importName} } from '@primer/styled-react'`),
                )

                return fixes
              },
            })
          }
        }
      },
    }
  },
}
