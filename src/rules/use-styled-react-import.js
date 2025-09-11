'use strict'

const url = require('../url')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')

// Default components that should be imported from @primer/styled-react when used with sx prop
const defaultStyledComponents = [
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
]

// Default types that should be imported from @primer/styled-react
const defaultStyledTypes = ['BoxProps', 'SxProp', 'BetterSystemStyleObject']

// Default utilities that should be imported from @primer/styled-react
const defaultStyledUtilities = ['sx']

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
    schema: [
      {
        type: 'object',
        properties: {
          styledComponents: {
            type: 'array',
            items: {type: 'string'},
            description: 'Components that should be imported from @primer/styled-react when used with sx prop',
          },
          styledTypes: {
            type: 'array',
            items: {type: 'string'},
            description: 'Types that should be imported from @primer/styled-react',
          },
          styledUtilities: {
            type: 'array',
            items: {type: 'string'},
            description: 'Utilities that should be imported from @primer/styled-react',
          },
        },
        additionalProperties: false,
      },
    ],
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
    // Get configuration options or use defaults
    const options = context.options[0] || {}
    const styledComponents = new Set(options.styledComponents || defaultStyledComponents)
    const styledTypes = new Set(options.styledTypes || defaultStyledTypes)
    const styledUtilities = new Set(options.styledUtilities || defaultStyledUtilities)
    const componentsWithSx = new Set()
    const componentsWithoutSx = new Set() // Track components used without sx
    const allUsedComponents = new Set() // Track all used components
    const primerReactImports = new Map() // Map of component name to import node
    const styledReactImports = new Map() // Map of components imported from styled-react to import node
    const aliasMapping = new Map() // Map local name to original component name for aliased imports
    const jsxElementsWithSx = [] // Track JSX elements that use sx prop
    const jsxElementsWithoutSx = [] // Track JSX elements that don't use sx prop

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
              const localName = specifier.local.name
              styledReactImports.set(importedName, {node, specifier})

              // Track alias mapping for styled-react imports
              if (localName !== importedName) {
                aliasMapping.set(localName, importedName)
              }
            }
          }
        }
      },

      JSXElement(node) {
        const openingElement = node.openingElement
        const componentName = getJSXOpeningElementName(openingElement)

        // Check if this is an aliased component from styled-react
        const originalComponentName = aliasMapping.get(componentName) || componentName

        // For compound components like "ActionList.Item", we need to check the parent component
        const parentComponentName = originalComponentName.includes('.')
          ? originalComponentName.split('.')[0]
          : originalComponentName

        // Track all used components that are in our styled components list
        if (styledComponents.has(parentComponentName)) {
          allUsedComponents.add(parentComponentName)

          // Check if this component has an sx prop
          const hasSxProp = openingElement.attributes.some(
            attr => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'sx',
          )

          if (hasSxProp) {
            componentsWithSx.add(parentComponentName)
            jsxElementsWithSx.push({node, componentName: originalComponentName, openingElement})
          } else {
            componentsWithoutSx.add(parentComponentName)

            // If this is an aliased component without sx, we need to track it for renaming
            if (aliasMapping.has(componentName)) {
              jsxElementsWithoutSx.push({
                node,
                localName: componentName,
                originalName: parentComponentName,
                openingElement,
              })
            }
          }
        }
      },

      'Program:exit': function () {
        // Group components by import node to handle multiple changes to same import
        const importNodeChanges = new Map()

        // Collect all changes needed for components used with sx prop
        for (const componentName of componentsWithSx) {
          const importInfo = primerReactImports.get(componentName)
          if (importInfo && !styledReactImports.has(componentName)) {
            const hasConflict = componentsWithoutSx.has(componentName)
            const {node: importNode} = importInfo

            if (!importNodeChanges.has(importNode)) {
              importNodeChanges.set(importNode, {
                toMove: [],
                toAlias: [],
                originalSpecifiers: [...importNode.specifiers],
              })
            }

            const changes = importNodeChanges.get(importNode)
            if (hasConflict) {
              changes.toAlias.push(componentName)
            } else {
              changes.toMove.push(componentName)
            }
          }
        }

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
                const changes = importNodeChanges.get(importNode)

                if (!changes) {
                  return null
                }

                // Only apply the fix once per import node (for the first component processed)
                const isFirstComponent =
                  changes.originalSpecifiers[0] === specifier ||
                  (changes.toMove.length > 0 && changes.toMove[0] === componentName) ||
                  (changes.toAlias.length > 0 && changes.toAlias[0] === componentName)

                if (!isFirstComponent) {
                  return null
                }

                const fixes = []
                const componentsToMove = new Set(changes.toMove)

                // Find specifiers that remain in original import
                const remainingSpecifiers = changes.originalSpecifiers.filter(spec => {
                  const name = spec.imported.name
                  // Keep components that are not being moved (only aliased components stay for non-sx usage)
                  return !componentsToMove.has(name)
                })

                // If no components remain, replace with new imports directly
                if (remainingSpecifiers.length === 0) {
                  // Build the new imports to replace the original
                  const newImports = []

                  // Add imports for moved components
                  for (const componentName of changes.toMove) {
                    newImports.push(`import { ${componentName} } from '@primer/styled-react'`)
                  }

                  // Add aliased imports for conflicted components
                  for (const componentName of changes.toAlias) {
                    const aliasName = `Styled${componentName}`
                    newImports.push(`import { ${componentName} as ${aliasName} } from '@primer/styled-react'`)
                  }

                  fixes.push(fixer.replaceText(importNode, newImports.join('\n')))
                } else {
                  // Otherwise, update the import to only include remaining components
                  const remainingNames = remainingSpecifiers.map(spec => spec.imported.name)
                  fixes.push(
                    fixer.replaceText(importNode, `import { ${remainingNames.join(', ')} } from '@primer/react'`),
                  )

                  // Combine all styled-react imports into a single import statement
                  const styledReactImports = []

                  // Add aliased components first
                  for (const componentName of changes.toAlias) {
                    const aliasName = `Styled${componentName}`
                    styledReactImports.push(`${componentName} as ${aliasName}`)
                  }

                  // Add moved components second
                  for (const componentName of changes.toMove) {
                    styledReactImports.push(componentName)
                  }

                  if (styledReactImports.length > 0) {
                    fixes.push(
                      fixer.insertTextAfter(
                        importNode,
                        `\nimport { ${styledReactImports.join(', ')} } from '@primer/styled-react'`,
                      ),
                    )
                  }
                }

                return fixes
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
                const sourceCode = context.getSourceCode()
                const jsxText = sourceCode.getText(jsxNode)

                // Replace all instances of the component name (both main component and compound components)
                const componentPattern = new RegExp(`\\b${componentName}(?=\\.|\\s|>)`, 'g')
                const aliasedText = jsxText.replace(componentPattern, aliasName)

                return fixer.replaceText(jsxNode, aliasedText)
              },
            })
          }
        }

        // Group styled-react imports that need to be moved to primer-react
        const styledReactImportNodeChanges = new Map()

        // Collect components that need to be moved from styled-react to primer-react
        for (const componentName of allUsedComponents) {
          if (!componentsWithSx.has(componentName) && styledReactImports.has(componentName)) {
            const importInfo = styledReactImports.get(componentName)
            const {node: importNode} = importInfo

            if (!styledReactImportNodeChanges.has(importNode)) {
              styledReactImportNodeChanges.set(importNode, {
                toMove: [],
                originalSpecifiers: [...importNode.specifiers],
              })
            }

            styledReactImportNodeChanges.get(importNode).toMove.push(componentName)
          }
        }

        // Find existing primer-react import nodes to merge with
        const primerReactImportNodes = new Set()
        for (const [, {node}] of primerReactImports) {
          primerReactImportNodes.add(node)
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
                const {node: importNode} = importInfo
                const changes = styledReactImportNodeChanges.get(importNode)

                if (!changes) {
                  return null
                }

                // Only apply the fix once per import node (for the first component processed)
                const isFirstComponent = changes.toMove[0] === componentName

                if (!isFirstComponent) {
                  return null
                }

                const fixes = []
                const componentsToMove = new Set(changes.toMove)

                // Find specifiers that remain in styled-react import
                const remainingSpecifiers = changes.originalSpecifiers.filter(spec => {
                  const name = spec.imported.name
                  return !componentsToMove.has(name)
                })

                // Check if there's an existing primer-react import to merge with
                const existingPrimerReactImport = Array.from(primerReactImportNodes)[0]

                if (existingPrimerReactImport && remainingSpecifiers.length === 0) {
                  // Case: No remaining styled-react imports, merge with existing primer-react import
                  const existingSpecifiers = existingPrimerReactImport.specifiers.map(spec => spec.imported.name)
                  const newSpecifiers = [...existingSpecifiers, ...changes.toMove].filter(
                    (name, index, arr) => arr.indexOf(name) === index,
                  )

                  fixes.push(
                    fixer.replaceText(
                      existingPrimerReactImport,
                      `import { ${newSpecifiers.join(', ')} } from '@primer/react'`,
                    ),
                  )
                  fixes.push(fixer.remove(importNode))
                } else if (existingPrimerReactImport && remainingSpecifiers.length > 0) {
                  // Case: Some styled-react imports remain, merge moved components with existing primer-react
                  const existingSpecifiers = existingPrimerReactImport.specifiers.map(spec => spec.imported.name)
                  const newSpecifiers = [...existingSpecifiers, ...changes.toMove].filter(
                    (name, index, arr) => arr.indexOf(name) === index,
                  )

                  fixes.push(
                    fixer.replaceText(
                      existingPrimerReactImport,
                      `import { ${newSpecifiers.join(', ')} } from '@primer/react'`,
                    ),
                  )

                  const remainingNames = remainingSpecifiers.map(spec => spec.imported.name)
                  fixes.push(
                    fixer.replaceText(
                      importNode,
                      `import { ${remainingNames.join(', ')} } from '@primer/styled-react'`,
                    ),
                  )
                } else if (remainingSpecifiers.length === 0) {
                  // Case: No existing primer-react import, no remaining styled-react imports
                  const movedComponents = changes.toMove.join(', ')
                  fixes.push(fixer.replaceText(importNode, `import { ${movedComponents} } from '@primer/react'`))
                } else {
                  // Case: No existing primer-react import, some styled-react imports remain
                  const remainingNames = remainingSpecifiers.map(spec => spec.imported.name)
                  fixes.push(
                    fixer.replaceText(
                      importNode,
                      `import { ${remainingNames.join(', ')} } from '@primer/styled-react'`,
                    ),
                  )

                  const movedComponents = changes.toMove.join(', ')
                  fixes.push(fixer.insertTextAfter(importNode, `\nimport { ${movedComponents} } from '@primer/react'`))
                }

                return fixes
              },
            })
          }
        }

        // Report and fix JSX elements that use aliased components without sx prop
        for (const {node: jsxNode, originalName, openingElement} of jsxElementsWithoutSx) {
          if (!componentsWithSx.has(originalName) && styledReactImports.has(originalName)) {
            context.report({
              node: openingElement,
              messageId: 'usePrimerReactImport',
              data: {componentName: originalName},
              fix(fixer) {
                const fixes = []

                // Replace the aliased component name with the original component name in JSX opening tag
                fixes.push(fixer.replaceText(openingElement.name, originalName))

                // Replace the aliased component name in JSX closing tag if it exists
                if (jsxNode.closingElement) {
                  fixes.push(fixer.replaceText(jsxNode.closingElement.name, originalName))
                }

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
