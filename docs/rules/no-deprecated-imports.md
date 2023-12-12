# No Deprecated Imports

## Rule Details

This rule enforces the usage of non-deprecated imports from `@primer/react`.

👎 Examples of **incorrect** code for this rule

```jsx
// SSRProvider is a deprecated import and should not be used
import {SSRProvider} from '@primer/react'

function ExampleComponent() {
  return <SSRProvider>...</SSRProvider>
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {Button} from '@primer/react'

function ExampleComponent() {
  return <Button>...</Button>
}
```
