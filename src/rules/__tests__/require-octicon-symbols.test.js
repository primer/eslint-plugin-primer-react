'use strict'

const {RuleTester} = require('eslint')
const rule = require('../require-octicon-symbols')

const ruleTester = new RuleTester({
  languageOptions: {
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
    octiconSymbols: ['CheckSymbol', 'XSymbol'],
  },
}

ruleTester.run('require-octicon-symbols', rule, {
  valid: [
    {
      code: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
function Root() {
  return (
    <OcticonSymbols>
      <CheckSymbol />
      <>
        <XSymbol />
      </>
    </OcticonSymbols>
  )
}`,
      settings,
    },
    {
      code: `import {
  OcticonSymbols as Symbols,
  CheckSymbol as Check,
  XSymbol as X,
} from '@primer/octicons-react-symbols'
const Root = () => <Symbols><Check /><X /></Symbols>`,
      settings,
    },
  ],
  invalid: [
    {
      code: `export const Root = () => <App />`,
      settings,
      errors: [{messageId: 'missingOcticonSymbolsImport'}],
    },
    {
      code: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <App />`,
      settings,
      errors: [{messageId: 'missingOcticonSymbols'}],
    },
    {
      code: `import {OcticonSymbols, CheckSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <OcticonSymbols><CheckSymbol /></OcticonSymbols>`,
      output: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <OcticonSymbols><CheckSymbol /></OcticonSymbols>`,
      settings,
      errors: [
        {
          messageId: 'missingSymbolImport',
          data: {
            symbolNames: 'XSymbol',
          },
        },
      ],
    },
    {
      code: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <OcticonSymbols><CheckSymbol /></OcticonSymbols>`,
      output: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <OcticonSymbols><CheckSymbol />
  <XSymbol />
</OcticonSymbols>`,
      settings,
      errors: [
        {
          messageId: 'missingSymbol',
          data: {
            symbolNames: 'XSymbol',
          },
        },
      ],
    },
    {
      code: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <OcticonSymbols />`,
      output: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <OcticonSymbols>
  <CheckSymbol />
  <XSymbol />
</OcticonSymbols>`,
      settings,
      errors: [
        {
          messageId: 'missingSymbol',
          data: {
            symbolNames: 'CheckSymbol, XSymbol',
          },
        },
      ],
    },
    {
      code: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
export const Root = () => <><OcticonSymbols><CheckSymbol /></OcticonSymbols><XSymbol /></>`,
      output: null,
      settings,
      errors: [
        {
          messageId: 'missingSymbol',
          data: {
            symbolNames: 'XSymbol',
          },
        },
      ],
    },
    {
      code: `import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'
function NestedRoot(XSymbol) {
  return <OcticonSymbols><CheckSymbol /><XSymbol /></OcticonSymbols>
}`,
      output: null,
      settings,
      errors: [
        {
          messageId: 'missingSymbol',
          data: {
            symbolNames: 'XSymbol',
          },
        },
      ],
    },
    {
      code: `import {OcticonSymbols, CheckSymbol, XSymbol, AlertSymbol} from '@primer/octicons-react-symbols'
export const Root = () => (
  <OcticonSymbols>
    <CheckSymbol />
    <XSymbol />
    <AlertSymbol />
  </OcticonSymbols>
)`,
      settings,
      errors: [
        {
          messageId: 'unconfiguredSymbol',
          data: {
            symbolName: 'AlertSymbol',
          },
        },
      ],
    },
    {
      code: `import {OcticonSymbols} from '@primer/octicons-react-symbols'
export const Root = () => <OcticonSymbols />`,
      errors: [{messageId: 'invalidConfiguration'}],
    },
  ],
})
