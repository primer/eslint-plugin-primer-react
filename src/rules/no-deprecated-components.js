'use strict'

const url = require('../url')

const migrationGuide = 'https://primer.style/product/getting-started/react/migration-guides/primer-flash'

const deprecatedComponents = new Map([
  [
    'Flash',
    {
      replacement: 'Banner',
      migrationGuide,
    },
  ],
])

const primerReactEntrypoints = new Set(['@primer/react', '@primer/react/deprecated'])

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Discourage the use of deprecated Primer React components',
      recommended: true,
      url: url(module),
    },
    messages: {
      deprecatedComponent:
        '`{{component}}` is deprecated. Use `{{replacement}}` from `@primer/react` instead. See the migration guide: {{migrationGuide}}',
    },
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (!primerReactEntrypoints.has(node.source.value)) {
          return
        }

        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportSpecifier') {
            continue
          }

          const component = deprecatedComponents.get(specifier.imported.name)
          if (!component) {
            continue
          }

          context.report({
            node: specifier,
            messageId: 'deprecatedComponent',
            data: {
              component: specifier.imported.name,
              replacement: component.replacement,
              migrationGuide: component.migrationGuide,
            },
          })
        }
      },
    }
  },
}
