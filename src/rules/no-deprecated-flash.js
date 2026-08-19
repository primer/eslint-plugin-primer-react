'use strict'

const url = require('../url')

const migrationGuide = 'https://primer.style/product/getting-started/react/migration-guides/primer-flash'
const primerReactEntrypoints = new Set(['@primer/react', '@primer/react/deprecated'])

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Discourage the use of the deprecated Flash component',
      recommended: true,
      url: url(module),
    },
    messages: {
      deprecatedFlash: `\`Flash\` is deprecated. Use \`Banner\` from \`@primer/react\` instead. See the migration guide: ${migrationGuide}`,
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

          if (specifier.imported.name !== 'Flash') {
            continue
          }

          context.report({
            node: specifier,
            messageId: 'deprecatedFlash',
          })
        }
      },
    }
  },
}
