# Recommends to use the `next` tooltip instead of the current stable one.

## Rule details

This rule recommends using the tooltip that is imported from `@primer/react/next` instead of the main entrypoint. The components that are exported from `@primer/react/next` are recommended over the main entrypoint ones because `next` components are reviewed and remediated for accessibility issues.
👎 Examples of **incorrect** code for this rule:

```tsx
import {Tooltip} from '@primer/react'
```

👍 Examples of **correct** code for this rule:

```tsx
import {Tooltip} from '@primer/react/next'
```
