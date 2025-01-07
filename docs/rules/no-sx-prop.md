# No Wildcard Imports

## Rule Details

This rule enforces that no sx props are used with `@primer/react`.

👎 Examples of **incorrect** code for this rule

```jsx
import {Button} from '@primer/react'

function ExampleComponent() {
  return (
    <Button
      sx={
        {
          /* ... */
        }
      }
    />
  )
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {Button} from '@primer/react'

function ExampleComponent() {
  return <Button className="..." />
}
```
