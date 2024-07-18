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

## Icon buttons and tooltips

Even though the below code is perfectly valid, since icon buttons now come with tooltips by default, it is not required to explicitly use the Tooltip component on icon buttons.

```tsx
import {IconButton} from '@primer/react'
import {Tooltip} from '@primer/react/next'
<Tooltip text="Search" direction="e">
  <IconButton icon={SearchIcon} aria-label="Search" />
</Tooltip>
```
