'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-sx-prop')

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

ruleTester.run('no-sx-prop', rule, {
  valid: [`import {Button} from '@primer/react'`],
  invalid: [
    {
      code: `
        import {SegmentedControl} from '@primer/react';
        function Example() {
          return <SegmentedControl sx={{color: 'red'}} />
        }
      `,
      errors: [
        {
          messageId: 'sxProp',
        },
      ],
    },
  ],
})
