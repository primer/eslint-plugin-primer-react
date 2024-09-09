'use strict'

const url = require('../url')

const wildcardImports = new Map([
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
    '@primer/react/lib-esm/useIsomorphicLayoutEffect',
    [
      {
        name: 'default',
        from: '@primer/react',
        as: 'useIsomorphicLayoutEffect',
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
    '@primer/react/lib-esm/deprecated/ActionList',
    [
      {
        type: 'type',
        name: 'ItemProps',
        from: '@primer/react/deprecated',
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
      },
      {
        name: 'ItemInput',
        from: '@primer/react/deprecated',
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
    '@primer/react/lib-esm/hooks/useResizeObserver',
    [
      {
        name: 'default',
        from: '@primer/react',
        as: 'useResizeObserver',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/hooks/useProvidedRefOrCreate',
    [
      {
        name: 'default',
        from: '@primer/react',
        as: 'useProvidedRefOrCreate',
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
      {
        name: 'ButtonBase',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/utils/polymorphic',
    [
      {
        type: 'type',
        name: 'ForwardRefComponent',
        from: '@primer/react',
      },
    ],
  ],
  [
    '@primer/react/lib-esm/hooks/useResponsiveValue',
    [
      {
        type: 'type',
        name: 'useResponsiveValue',
        from: '@primer/react',
        as: 'useResponsiveValue',
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
            message: 'Wildcard imports from @primer/react are not allowed. Import from an entrypoint instead',
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
              message: `Wildcard import ${specifier.imported.name} from ${node.source.value} is not allowed. Import from an entrypoint instead`,
            })
            break
          }

          if (!changes.has(migration.from)) {
            changes.set(migration.from, [])
          }

          if (migration.as) {
            changes.get(migration.from).push([migration.as, migration.as, migration.type])
          } else {
            changes.get(migration.from).push([migration.name, specifier.local.name, migration.type])
          }
        }

        if (changes.length !== 0) {
          context.report({
            node,
            message: `Wildcard imports from ${node.source.value} are not allowed. Import from an entrypoint instead`,
            *fix(fixer) {
              for (const [entrypoint, importSpecifiers] of changes) {
                const allTypeImports = importSpecifiers.every(([, , type]) => type === 'type')
                const importStatement = allTypeImports ? 'import type' : 'import'
                const specifiers = importSpecifiers
                  .map(([imported, local, type]) => {
                    const prefix = allTypeImports ? '' : type === 'type' ? 'type ' : ''
                    if (imported === local) {
                      return `${prefix}${imported}`
                    }

                    return `${prefix}${imported} as ${local}`
                  })
                  .join(', ')
                yield fixer.replaceText(node, `${importStatement} {${specifiers}} from '${entrypoint}'`)
              }
            },
          })
        }
      },
    }
  },
}
