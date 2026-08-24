'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-flash')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

const error = {messageId: 'deprecatedFlash'}

ruleTester.run('no-deprecated-flash', rule, {
  valid: [
    {
      code: `import {Banner} from '@primer/react'`,
    },
    {
      code: `import {Flash} from '@example/react'`,
    },
    {
      code: `import PrimerReact from '@primer/react'`,
    },
    {
      code: `import * as PrimerReact from '@primer/react'`,
    },
  ],
  invalid: [
    {
      code: `import {Flash} from '@primer/react'`,
      errors: [error],
    },
    {
      code: `import {Flash} from '@primer/react/deprecated'`,
      errors: [error],
    },
    {
      code: `import {Flash as LegacyFlash} from '@primer/react'`,
      errors: [error],
    },
    {
      code: `import {Button, Flash, Link} from '@primer/react'`,
      errors: [error],
    },
  ],
})
