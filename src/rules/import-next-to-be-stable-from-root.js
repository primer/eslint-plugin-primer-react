'use strict'

const url = require('../url')

const components = [
  {
    identifier: 'Tooltip',
    entrypoint: '@primer/react/next',
  },
  {
    identifier: 'TooltipProps',
    entrypoint: '@primer/react/next',
  },
  {
    identifier: 'TooltipDirection',
    entrypoint: '@primer/react/next',
  },
  {
    identifier: 'TriggerPropsType',
    entrypoint: '@primer/react/next',
  },
  {
    identifier: 'TooltipContext',
    entrypoint: '@primer/react/next',
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

        const entrypointMapValue = entrypoints.get(node.source.value)

        const componentsToPromote = node.specifiers.filter(specifier => {
          return entrypointMapValue.has(specifier.imported.name)
        })

        if (componentsToPromote.length === 0) {
          return
        }

        const stableEntrypoint = node.parent.body.find(node => {
          if (node.type !== 'ImportDeclaration') {
            return false
          }

          return node.source.value === '@primer/react'
        })

        // All imports are from stable
        if (componentsToPromote.length === node.specifiers.length) {
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
          // There is a mix of deprecated and non-deprecated imports
          // context.report({
          //   node,
          //   message: 'Import deprecated components from @primer/react/deprecated',
          //   *fix(fixer) {
          //     for (const specifier of deprecated) {
          //       yield fixer.remove(specifier)
          //       const comma = sourceCode.getTokenAfter(specifier)
          //       if (comma.value === ',') {
          //         yield fixer.remove(comma)
          //       }
          //     }
          //     if (deprecatedEntrypoint) {
          //       const lastSpecifier = deprecatedEntrypoint.specifiers[deprecatedEntrypoint.specifiers.length - 1]
          //       yield fixer.insertTextAfter(
          //         lastSpecifier,
          //         `, ${deprecated.map(specifier => specifier.imported.name).join(', ')}`,
          //       )
          //     } else {
          //       yield fixer.insertTextAfter(
          //         node,
          //         `\nimport {${deprecated
          //           .map(specifier => specifier.imported.name)
          //           .join(', ')}} from '@primer/react/deprecated'`,
          //       )
          //     }
          //   },
          // })
        }
      },
    }
  },
}
