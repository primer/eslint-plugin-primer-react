'use strict'

const url = require('../url')

const components = [
  {
    identifier: 'SelectPanel',
    entrypoint: '@primer/react/experimental',
  },
]

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
      description: 'Use deprecated components from the `@primer/react/deprecated` entrypoint',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (!entrypoints.has(node.source.value)) {
          return
        }

        const entrypoint = entrypoints.get(node.source.value)

        const experimental = node.specifiers.filter(specifier => {
          return entrypoint.has(specifier.imported.name)
        })

        if (experimental.length === 0) {
          return
        }

        // All imports are deprecated
        if (experimental.length > 0) {
          context.report({
            node,
            message: 'SelectPanelV2 is deprecated. Please import SelectPanelV1 from `@primer/react`',
          })
        }
      },
    }
  },
}
