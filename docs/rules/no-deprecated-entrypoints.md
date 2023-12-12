# No Deprecated Entrypoints

## Rule Details

This rule enforces the usage of non-deprecated entrypoints from `@primer/react`.

👎 Examples of **incorrect** code for this rule

```jsx
import {ExampleComponent} from '@primer/react/drafts'

function ExampleComponent() {
  return <SSRProvider>...</SSRProvider>
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {ExampleComponent} from '@primer/react/experimental'

function ExampleComponent() {
  return <Button>...</Button>
}
```
