# Require Octicon Symbols

## Rule details

This rule requires an app root to render `OcticonSymbols` and every symbol in
the shared Octicon symbol registry.

Apply the rule only to the file that acts as the app root:

```js
{
  settings: {
    'primer-react': {
      octiconSymbols: ['CheckSymbol', 'XSymbol'],
    },
  },
},
{
  files: ['src/Root.tsx'],
  rules: {
    'primer-react/require-octicon-symbols': 'error',
  },
}
```

The root must import and render every configured symbol inside
`OcticonSymbols`:

```jsx
import {OcticonSymbols, CheckSymbol, XSymbol} from '@primer/octicons-react-symbols'

function Root() {
  return (
    <OcticonSymbols>
      <CheckSymbol />
      <XSymbol />
    </OcticonSymbols>
  )
}
```

The ESLint file override defines which file is the app root. ESLint cannot
infer an application's root file while linting individual files.

## Autofixing

Running ESLint with `--fix` adds missing configured symbol imports to an
existing `@primer/octicons-react-symbols` import and inserts missing symbol
components into an existing `OcticonSymbols`.

The rule does not create or wrap an app root, move symbols from elsewhere in
the file, or edit ESLint settings.
