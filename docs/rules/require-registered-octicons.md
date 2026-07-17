# Require Registered Octicons

## Rule details

This rule requires every used `*Icon` import from
`@primer/octicons-react-symbols` to have its matching `*Symbol` component in the
shared Octicon symbol registry.

Configure the registry in ESLint settings:

```js
{
  settings: {
    'primer-react': {
      octiconSymbols: ['CheckSymbol', 'XSymbol'],
    },
  },
  rules: {
    'primer-react/require-registered-octicons': 'error',
  },
}
```

With this configuration, `CheckIcon` and `XIcon` are allowed. Using
`AlertIcon` reports an error until `AlertSymbol` is added to the setting and the
app's `OcticonSymbols` component.

Use named imports so the rule can map each icon to its symbol.

This rule does not autofix unregistered icons because ESLint fixers cannot
safely update both the shared settings and a separate app-root file. The error
identifies the exact `*Symbol` component that must be registered.
