'use strict'

const {deprecated} = require('./deprecated/imports')
const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid using deprecated imports from @primer/react',
      recommended: true,
      url: url(module),
    },
    schema: [],
  },
  create(context) {
    const entrypoints = Array.from(deprecated.keys())
    return {
      ImportDeclaration(node) {
        const entrypoint = entrypoints.find(entrypoint => {
          return node.source.value === entrypoint
        })
        if (!entrypoint) {
          return
        }

        const deprecatedImports = deprecated.get(entrypoint)
        const imported = node.specifiers
          .map(specifier => {
            const match = deprecatedImports.find(deprecatedImport => {
              return specifier.imported.name === deprecatedImport.name
            })
            return [specifier, match]
          })
          .filter(([_specifier, match]) => {
            return !!match
          })

        for (const [importSpecifier, deprecatedImport] of imported) {
          context.report({
            node: importSpecifier,
            message: deprecatedImport.reason,
          })
        }
      },
    }
  },
}
