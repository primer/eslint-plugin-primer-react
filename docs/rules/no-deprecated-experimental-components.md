# No experimental SelectPanel

## Rule Details

This rule enforces the usage of specific imports from `@primer/react/experimental`.

👎 Examples of **incorrect** code for this rule

```jsx
import {SelectPanel} from '@primer/react/experimental'

function ExampleComponent() {
  return <SelectPanel />
}
```

👍 Examples of **correct** code for this rule:

You can satisfy the rule by either converting to the non-experimental version:

```jsx
import {SelectPane} from '@primer/react'

function ExampleComponent() {
  return <SelectPanel />
}
```

Or by removing usage of the component.