'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-wildcard-imports')

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('no-wildcard-imports', rule, {
  valid: [`import {Button} from '@primer/react'`],
  invalid: [
    // Test unknown path from wildcard import
    {
      code: `import type {UnknownImport} from '@primer/react/lib-esm/unknown-path'`,
      errors: [
        {
          message: 'Wildcard imports from @primer/react are not allowed. Import from an entrypoint instead',
        },
      ],
    },

    // Test type import
    {
      code: `import type {SxProp} from '@primer/react/lib-esm/sx'`,
      output: `import type {SxProp} from '@primer/react'`,
      errors: [
        {
          message: 'Wildcard imports from @primer/react/lib-esm/sx are not allowed. Import from an entrypoint instead',
        },
      ],
    },

    // Test multiple type imports
    {
      code: `import type {BetterSystemStyleObject, SxProp, BetterCssProperties} from '@primer/react/lib-esm/sx'`,
      output: `import type {BetterSystemStyleObject, SxProp, BetterCssProperties} from '@primer/react'`,
      errors: [
        {
          message: 'Wildcard imports from @primer/react/lib-esm/sx are not allowed. Import from an entrypoint instead',
        },
      ],
    },

    // Test import alias
    {
      code: `import type {SxProp as RenamedSxProp} from '@primer/react/lib-esm/sx'`,
      output: `import type {SxProp as RenamedSxProp} from '@primer/react'`,
      errors: [
        {
          message: 'Wildcard imports from @primer/react/lib-esm/sx are not allowed. Import from an entrypoint instead',
        },
      ],
    },

    // Test default import
    {
      code: `import useIsomorphicLayoutEffect from '@primer/react/lib-esm/useIsomorphicLayoutEffect'`,
      output: `import {useIsomorphicLayoutEffect} from '@primer/react'`,
      errors: [
        {
          message:
            'Wildcard imports from @primer/react/lib-esm/useIsomorphicLayoutEffect are not allowed. Import from an entrypoint instead',
        },
      ],
    },

    // Test multiple wildcard imports into single entrypoint
    {
      code: `import useResizeObserver from '@primer/react/lib-esm/hooks/useResizeObserver'
import useIsomorphicLayoutEffect from '@primer/react/lib-esm/useIsomorphicLayoutEffect'`,
      output: `import {useResizeObserver} from '@primer/react'
import {useIsomorphicLayoutEffect} from '@primer/react'`,
      errors: [
        {
          message:
            'Wildcard imports from @primer/react/lib-esm/hooks/useResizeObserver are not allowed. Import from an entrypoint instead',
        },
        {
          message:
            'Wildcard imports from @primer/react/lib-esm/useIsomorphicLayoutEffect are not allowed. Import from an entrypoint instead',
        },
      ],
    },
  ],
})
