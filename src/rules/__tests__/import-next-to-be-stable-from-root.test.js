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
    // Single next import
    {
      code: `import {Tooltip} from '@primer/react/next'`,
      output: `import {Tooltip} from '@primer/react'`,
      errors: [{messageId: 'importToBeStableFromRoot', line: 1}],
    },

    // // With existing stable entrypoint
    {
      code: `import {Tooltip} from '@primer/react/next'
import {Button} from '@primer/react'`,
      output: `\nimport {Button, Tooltip} from '@primer/react'`,
      errors: [{messageId: 'importToBeStableFromRoot', line: 1}],
    },
  ],
})
