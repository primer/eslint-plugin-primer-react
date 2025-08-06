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
      moveToStyledReact: 'Move {{ importName }} import to "@primer/styled-react"',
    },
  },
  create(context) {
    const componentsWithSx = new Set()
    const primerReactImports = new Map() // Map of component name to import node
    const styledReactImports = new Set() // Set of components already imported from styled-react

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
          // Track what's already imported from styled-react
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportSpecifier') {
              styledReactImports.add(specifier.imported.name)
            }
          }
        }
      },

      JSXOpeningElement(node) {
        const componentName = getJSXOpeningElementName(node)

        // Check if this component has an sx prop
        const hasSxProp = node.attributes.some(
          attr => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'sx',
        )

        if (hasSxProp && styledComponents.has(componentName)) {
          componentsWithSx.add(componentName)
        }
      },

      'Program:exit': function () {
        // Report errors for components used with sx prop that are imported from @primer/react
        for (const componentName of componentsWithSx) {
          const importInfo = primerReactImports.get(componentName)
          if (importInfo && !styledReactImports.has(componentName)) {
            context.report({
              node: importInfo.specifier,
              messageId: 'useStyledReactImport',
              data: {componentName},
              fix(fixer) {
                const {node: importNode, specifier} = importInfo
                const otherSpecifiers = importNode.specifiers.filter(s => s !== specifier)

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
