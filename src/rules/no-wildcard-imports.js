'use strict'

const url = require('../url')

const wildcardImports = new Map([
  // Components
  [
    '@primer/react/lib-esm/Button/ButtonBase',
    [
      {
        type: 'type',
        name: 'ButtonBaseProps',
        from: '@primer/react',
      },
      {
        name: 'ButtonBase',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/Button/types',
    [
      {
        type: 'type',
        name: 'ButtonBaseProps',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/Dialog/Dialog',
    [
      {
        name: 'Dialog',
        from: '@primer/react/experimental',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/SelectPanel/SelectPanel',
    [
      {
        name: 'SelectPanel',
        from: '@primer/react/experimental',
      },
      {
        type: 'type',
        name: 'SelectPanelProps',
        from: '@primer/react/experimental',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/Label/Label',
    [
      {
        type: 'type',
        name: 'LabelColorOptions',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/_VisuallyHidden',
    [
      {
        name: 'default',
        from: '@primer/react',
        as: 'VisuallyHidden',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/Token/IssueLabelToken',
    [
      {
        type: 'type',
        name: 'IssueLabelTokenProps',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/Token/TokenBase',
    [
      {
        type: 'type',
        name: 'TokenSizeKeys',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/deprecated/ActionList',
    [
      {
        type: 'type',
        name: 'ItemProps',
        from: '@primer/react/deprecated',
        as: 'ActionListItemProps',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/deprecated/ActionList/List',
    [
      {
        type: 'type',
        name: 'GroupedListProps',
        from: '@primer/react/deprecated',
        as: 'ActionListGroupedListProps',
      },
      {
        name: 'ItemInput',
        from: '@primer/react/deprecated',
        as: 'ActionListItemInput',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/deprecated/ActionList/Item',
    [
      {
        type: 'type',
        name: 'ItemProps',
        from: '@primer/react/deprecated',
        as: 'ActionListItemProps',
      },
    ],
  ],

  // Hooks
  [
    '@primer/react/lib-esm/utils/useIsomorphicLayoutEffect',
    [
      {
        name: 'default',
        from: '@primer/react',
        as: 'useIsomorphicLayoutEffect',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/hooks/useResizeObserver',
    [
      {
        name: 'useResizeObserver',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/hooks/useProvidedRefOrCreate',
    [
      {
        name: 'useProvidedRefOrCreate',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/hooks/useResponsiveValue',
    [
      {
        name: 'useResponsiveValue',
        from: '@primer/react',
      },
    ],
  ],

  // Utilities
  [
    '@primer/react/lib-esm/sx',
    [
      {
        type: 'type',
        name: 'BetterSystemStyleObject',
        from: '@primer/react',
      },
      {
        type: 'type',
        name: 'SxProp',
        from: '@primer/react',
      },
      {
        type: 'type',
        name: 'BetterCssProperties',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/FeatureFlags/DefaultFeatureFlags',
    [
      {
        name: 'DefaultFeatureFlags',
        from: '@primer/react/experimental',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/theme',
    [
      {
        name: 'default',
        from: '@primer/react',
        as: 'theme',
      },
    ],
  ],
])

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Wildcard imports are discouraged. Import from a main entrypoint instead',
      recommended: true,
      url: url(module),
    },
    fixable: true,
    schema: [],
    messages: {
      unknownWildcardImport:
        'Wildcard imports from @primer/react are not allowed. Import from @primer/react, @primer/react/experimental, or @primer/react/deprecated instead',
      knownWildcardImport:
        'Wildcard import {{ specifier }} from {{ wildcardEntrypoint }} are not allowed. Import from @primer/react, @primer/react/experimental, or @primer/react/deprecated instead',
      wildcardMigration:
        'Wildcard imports from {{ wildcardEntrypoint }} are not allowed. Import from @primer/react, @primer/react/experimental, or @primer/react/deprecated instead',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (!node.source.value.startsWith('@primer/react/lib-esm')) {
          return
        }

        const wildcardImportMigrations = wildcardImports.get(node.source.value)
        if (!wildcardImportMigrations) {
          context.report({
            node,
            messageId: 'unknownWildcardImport',
          })
          return
        }

        /**
         * Maps entrypoint to array of changes. This tuple contains the new
         * imported name from the entrypoint along with the existing local name
         * @type {Map<string, Array<[string, string]>>}
         */
        const changes = new Map()

        for (const specifier of node.specifiers) {
          const migration = wildcardImportMigrations.find(migration => {
            if (specifier.type === 'ImportDefaultSpecifier') {
              return migration.name === 'default'
            }
            return specifier.imported.name === migration.name
          })

          // If we do not have a migration, we should report an error even if we
          // cannot autofix it
          if (!migration) {
            context.report({
              node,
              messageId: 'unknownWildcardImport',
            })
            return
          }

          if (!changes.has(migration.from)) {
            changes.set(migration.from, [])
          }

          if (migration.as) {
            changes.get(migration.from).push([migration.as, specifier.local.name, migration.type])
          } else {
            changes.get(migration.from).push([migration.name, specifier.local.name, migration.type])
          }
        }

        if (changes.length === 0) {
          return
        }

        context.report({
          node,
          messageId: 'wildcardMigration',
          data: {
            wildcardEntrypoint: node.source.value,
          },
          *fix(fixer) {
            for (const [entrypoint, importSpecifiers] of changes) {
              const typeSpecifiers = importSpecifiers.filter(([, , type]) => {
                return type === 'type'
              })

              // If all imports are type imports, emit emit as `import type {specifier} from '...'`
              if (typeSpecifiers.length === importSpecifiers.length) {
                const namedSpecifiers = typeSpecifiers.filter(([imported]) => {
                  return imported !== 'default'
                })
                const defaultSpecifier = typeSpecifiers.find(([imported]) => {
                  return imported === 'default'
                })

                if (namedSpecifiers.length > 0 && !defaultSpecifier) {
                  const specifiers = namedSpecifiers.map(([imported, local]) => {
                    if (imported !== local) {
                      return `${imported} as ${local}`
                    }
                    return imported
                  })
                  yield fixer.replaceText(node, `import type {${specifiers.join(', ')}} from '${entrypoint}'`)
                } else if (namedSpecifiers.length > 0 && defaultSpecifier) {
                  yield fixer.replaceText(
                    node,
                    `import type ${defaultSpecifier[1]}, ${specifiers.join(', ')} from '${entrypoint}'`,
                  )
                } else if (defaultSpecifier && namedSpecifiers.length === 0) {
                  yield fixer.replaceText(node, `import type ${defaultSpecifier[1]} from '${entrypoint}'`)
                }

                return
              }

              // Otherwise, we have a mix of type and value imports to emit
              const valueSpecifiers = importSpecifiers.filter(([, , type]) => {
                return type !== 'type'
              })

              if (valueSpecifiers.length === 0) {
                return
              }

              const specifiers = valueSpecifiers.map(([imported, local]) => {
                if (imported !== local) {
                  return `${imported} as ${local}`
                }
                return imported
              })
              yield fixer.replaceText(node, `import {${specifiers.join(', ')}} from '${entrypoint}'`)

              if (typeSpecifiers.length > 0) {
                const specifiers = valueSpecifiers.map(([imported, local]) => {
                  if (imported !== local) {
                    return `${imported} as ${local}`
                  }
                  return imported
                })
                yield fixer.insertTextAfter(node, `import type {${specifiers.join(', ')}} from '${entrypoint}'`)
              }
            }
          },
        })
      },
    }
  },
}
