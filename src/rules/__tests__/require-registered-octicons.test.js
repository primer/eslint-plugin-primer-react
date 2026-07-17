'use strict'

const {RuleTester} = require('eslint')
const rule = require('../require-registered-octicons')

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

const settings = {
  'primer-react': {
    octiconSymbols: ['CheckSymbol'],
  },
}

ruleTester.run('require-registered-octicons', rule, {
  valid: [
    {
      code: `import {CheckIcon} from '@primer/octicons-react-symbols'; <CheckIcon />`,
      settings,
    },
    {
      code: `import {CheckIcon as StatusIcon} from '@primer/octicons-react-symbols'; <StatusIcon />`,
      settings,
    },
    {
      code: `import {XIcon} from '@primer/octicons-react-symbols'`,
      settings,
    },
    {
      code: `import type {IconProps} from '@primer/octicons-react-symbols'`,
      settings,
    },
    {
      code: `import {XIcon} from '@primer/octicons-react-symbols'; type IconComponent = typeof XIcon`,
      settings,
    },
  ],
  invalid: [
    {
      code: `import {XIcon} from '@primer/octicons-react-symbols'; <XIcon />`,
      settings,
      errors: [
        {
          messageId: 'unregisteredIcon',
          data: {
            iconName: 'XIcon',
            symbolName: 'XSymbol',
          },
        },
      ],
    },
    {
      code: `import {XIcon} from '@primer/octicons-react-symbols'; <Button leadingVisual={XIcon} />`,
      settings,
      errors: [{messageId: 'unregisteredIcon'}],
    },
    {
      code: `import * as Octicons from '@primer/octicons-react-symbols'; <Octicons.CheckIcon />`,
      settings,
      errors: [{messageId: 'namedImportsOnly'}],
    },
    {
      code: `import {CheckIcon} from '@primer/octicons-react-symbols'; <CheckIcon />`,
      errors: [{messageId: 'invalidConfiguration'}],
    },
  ],
})
