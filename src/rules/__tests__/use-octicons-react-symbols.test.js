'use strict'

const {RuleTester} = require('eslint')
const rule = require('../use-octicons-react-symbols')

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require(require.resolve('@typescript-eslint/parser', {paths: [require.resolve('eslint-plugin-github')]})),
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('use-octicons-react-symbols', rule, {
  valid: [
    `import {CheckIcon} from '@primer/octicons-react-symbols'`,
    `import type {IconProps} from '@primer/octicons-react'`,
    `import {Octicon} from '@primer/octicons-react'`,
  ],
  invalid: [
    {
      code: `import {CheckIcon} from '@primer/octicons-react'`,
      output: `import {CheckIcon} from '@primer/octicons-react-symbols'`,
      errors: [{messageId: 'useOcticonsReactSymbols'}],
    },
    {
      code: `import {CheckIcon as StatusIcon} from '@primer/octicons-react'`,
      output: `import {CheckIcon as StatusIcon} from '@primer/octicons-react-symbols'`,
      errors: [{messageId: 'useOcticonsReactSymbols'}],
    },
    {
      code: `import {CheckIcon, type IconProps} from '@primer/octicons-react'`,
      output: `import {type IconProps} from '@primer/octicons-react'
import {CheckIcon} from '@primer/octicons-react-symbols'`,
      errors: [{messageId: 'useOcticonsReactSymbols'}],
    },
    {
      code: `import * as Octicons from '@primer/octicons-react'`,
      output: `import * as Octicons from '@primer/octicons-react-symbols'`,
      errors: [{messageId: 'useOcticonsReactSymbols'}],
    },
  ],
})
