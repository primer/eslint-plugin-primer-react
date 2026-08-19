'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-components')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

const error = {
  messageId: 'deprecatedComponent',
  data: {
    component: 'Flash',
    replacement: 'Banner',
    migrationGuide: 'https://primer.style/product/getting-started/react/migration-guides/primer-flash',
  },
}

ruleTester.run('no-deprecated-components', rule, {
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
