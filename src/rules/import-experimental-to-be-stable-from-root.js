'use strict'

const url = require('../url')

const components = [
  {
    identifier: 'Dialog',
    entrypoint: '@primer/react/experimental',
  },
  {
    identifier: 'DialogProps',
    entrypoint: '@primer/react/experimental',
  },
  {
    identifier: 'DialogButtonProps',
    entrypoint: '@primer/react/experimental',
  },
  {
    identifier: 'Stack',
    entrypoint: '@primer/react/experimental',
  },
  {
    identifier: 'StackProps',
    entrypoint: '@primer/react/experimental',
  },
  {
    identifier: 'StackItemProps',
    entrypoint: '@primer/react/experimental',
  },
]

// Maps entrypoints to a set of component
const entrypoints = new Map()

for (const component of components) {
  if (!entrypoints.has(component.entrypoint)) {
    entrypoints.set(component.entrypoint, new Set())
  }
  entrypoints.get(component.entrypoint).add(component.identifier)
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use stable components from the `@primer/react` entrypoint',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
    messages: {
      importToBeStableFromRoot: "Import stable components from '@primer/react' entrypoint",
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      ImportDeclaration(node) {
        if (!entrypoints.has(node.source.value)) {
          return
        }

        const entrypoint = entrypoints.get(node.source.value)

        const stableComponents = node.specifiers.filter(specifier => {
          return entrypoint.has(specifier.imported.name)
        })

        if (stableComponents.length === 0) {
          return
        }

        const stableEntrypoint = node.parent.body.find(node => {
          if (node.type !== 'ImportDeclaration') {
            return false
          }

          return node.source.value === '@primer/react'
        })

        // All imports are from stable
        if (stableComponents.length === node.specifiers.length) {
          context.report({
            node,
            messageId: 'importToBeStableFromRoot',
            *fix(fixer) {
              if (stableEntrypoint) {
                const lastSpecifier = stableEntrypoint.specifiers[stableEntrypoint.specifiers.length - 1]
                yield fixer.remove(node)
                yield fixer.insertTextAfter(
                  lastSpecifier,
                  `, ${node.specifiers.map(specifier => specifier.imported.name).join(', ')}`,
                )
              } else {
                yield fixer.replaceText(node.source, `'@primer/react'`)
              }
            },
          })
        } else {
          // There is a mix of stable and non-stable imports
          context.report({
            node,
            messageId: 'importToBeStableFromRoot',
            *fix(fixer) {
              for (const specifier of stableComponents) {
                yield fixer.remove(specifier)
                const comma = sourceCode.getTokenAfter(specifier)
                if (comma.value === ',') {
                  yield fixer.remove(comma)
                }
              }
              if (stableEntrypoint) {
                const lastSpecifier = stableEntrypoint.specifiers[stableEntrypoint.specifiers.length - 1]
                yield fixer.insertTextAfter(
                  lastSpecifier,
                  `, ${stableComponents.map(specifier => specifier.imported.name).join(', ')}`,
                )
              } else {
                yield fixer.insertTextAfter(
                  node,
                  `\nimport {${stableComponents
                    .map(specifier => specifier.imported.name)
                    .join(', ')}} from '@primer/react'`,
                )
              }
            },
          })
        }
      },
    }
  },
}
