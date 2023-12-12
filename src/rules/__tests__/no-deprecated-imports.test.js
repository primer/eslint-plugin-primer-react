'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-imports')
const {getDeprecatedMessage} = require('../deprecated/imports')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('no-deprecated-imports', rule, {
  valid: [`import {Button} from '@primer/react'`, `import {ActionMenu, Button} from '@primer/react'`],
  invalid: [
    {
      code: `import {SSRProvider} from '@primer/react';`,
      errors: [
        {
          message: getDeprecatedMessage('@primer/react', 'SSRProvider'),
        },
      ],
    },
    {
      code: `import {useSSRSafeId} from '@primer/react';`,
      errors: [
        {
          message: getDeprecatedMessage('@primer/react', 'useSSRSafeId'),
        },
      ],
    },
  ],
})
