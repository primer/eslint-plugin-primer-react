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
      errors: ['SelectPanelV2 is deprecated. Please import SelectPanelV1 from `@primer/react`'],
    },
    // Multiple experimental import
    {
      code: `import {SelectPanel, DataTable, ActionBar} from '@primer/react/experimental'`,
      errors: ['SelectPanelV2 is deprecated. Please import SelectPanelV1 from `@primer/react`'],
    },
  ],
})
