'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-experimental-components')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('no-deprecated-experimental-components', rule, {
  valid: [
    {
      code: `import {SelectPanel} from '@primer/react'`,
    },
    {
      code: `import {DataTable} from '@primer/react/experimental'`,
    },
    {
      code: `import {DataTable, ActionBar} from '@primer/react/experimental'`,
    },
  ],
  invalid: [
    // Single experimental import
    {
      code: `import {SelectPanel} from '@primer/react/experimental'`,
      errors: [
        'SelectPanel is deprecated. Please import them from the stable entrypoint (@primer/react) if available, or check https://primer.style/product/components/ for alternative components.',
      ],
    },
    // Multiple experimental import
    {
      code: `import {SelectPanel, DataTable, ActionBar} from '@primer/react/experimental'`,
      errors: [
        'SelectPanel is deprecated. Please import them from the stable entrypoint (@primer/react) if available, or check https://primer.style/product/components/ for alternative components.',
      ],
    },
  ],
})
