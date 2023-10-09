'use strict'

const rule = require('../no-drafts-import')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

ruleTester.run('no-drafts-import', rule, {
  valid: [
    `import {UnderlineNav} from '@primer/react/experimental'`,
    `import {TreeView, UnderlineNav} from '@primer/react/experimental'`
  ],
  invalid: [
    {
      code: `import {UnderlineNav} from '@primer/react/drafts'`,
      output: `import {UnderlineNav} from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'entrypoint-error'
        }
      ]
    },
    {
      code: `import {TreeView, UnderlineNav} from '@primer/react/drafts'`,
      output: `import {TreeView, UnderlineNav} from '@primer/react/experimental'`,
      errors: [
        {
          messageId: 'entrypoint-error'
        }
      ]
    }
  ]
})
