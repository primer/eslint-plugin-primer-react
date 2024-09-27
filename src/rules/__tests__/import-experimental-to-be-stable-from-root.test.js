'use strict'

const {RuleTester} = require('eslint')
const rule = require('../import-next-to-be-stable-from-root')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('import-next-to-be-stable-from-root', rule, {
  valid: [],
  invalid: [
    // // Single experimental import
    {
      code: `import {Dialog} from '@primer/react/experimental'`,
      output: `import {Dialog} from '@primer/react'`,
      errors: [{messageId: 'importToBeStableFromRoot', line: 1}],
    },

    // Multiple experimental imports
    {
      code: `import {Dialog, Stack} from '@primer/react/experimental'`,
      output: `import {Dialog, Stack} from '@primer/react'`,
      errors: [{messageId: 'importToBeStableFromRoot', line: 1}],
    },

    // // Mix stable and non-stable imports from experimental entrypoint
    {
      code: `import {SelectPanel, Dialog, Stack} from '@primer/react/experimental'`,
      output: `import {Dialog, Stack} from '@primer/react',
      import {SelectPanel} from '@primer/react/experimental'`,
      errors: [{messageId: 'importToBeStableFromRoot', line: 1}],
    },

    // Mix stable and non-stable imports from experimental entrypoint with existing stable
    {
      code: `import {SelectPanel, Dialog, Stack} from '@primer/react/experimental'
import {Button} from '@primer/react'`,
      output: `import {Button, Dialog, Stack} from '@primer/react'
      import {SelectPanel} from '@primer/react/experimental'`,
      errors: [{messageId: 'importToBeStableFromRoot', line: 1}],
    },
  ],
})
