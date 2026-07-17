# Use Octicons React Symbols

## Rule details

This rule requires Octicon components to be imported from
`@primer/octicons-react-symbols` instead of `@primer/octicons-react`.

👎 Examples of **incorrect** code for this rule:

```jsx
import {CheckIcon} from '@primer/octicons-react'
```

👍 Examples of **correct** code for this rule:

```jsx
import {CheckIcon} from '@primer/octicons-react-symbols'
```

The rule automatically updates imports that contain only icon components. Mixed
imports are split so non-icon imports remain in `@primer/octicons-react`.
