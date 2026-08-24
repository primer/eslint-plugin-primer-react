# No deprecated Flash

## Rule details

This rule discourages imports of the deprecated `Flash` component from
`@primer/react` and `@primer/react/deprecated`.

👎 Example of **incorrect** code for this rule:

```jsx
import {Flash} from '@primer/react'
```

👍 Example of **correct** code for this rule:

```jsx
import {Banner} from '@primer/react'
```

Follow the
[Flash migration guide](https://primer.style/product/getting-started/react/migration-guides/primer-flash)
when replacing `Flash` with `Banner`.
