# No Deprecated Flash

## Rule Details

This rule discourages the use of Flash component and suggests using Banner component from `@primer/react/experimental` instead.

Flash component is deprecated and will be removed from @primer/react. The Banner component provides the same functionality and should be used instead.

👎 Examples of **incorrect** code for this rule

```jsx
import {Flash} from '@primer/react'

function ExampleComponent() {
  return <Flash variant="warning">Warning message</Flash>
}
```

```jsx
import {Flash} from '@primer/react'

function ExampleComponent() {
  return (
    <Flash variant="warning" sx={{fontSize: 0, borderRadius: 0, py: 2, px: 3}} className="custom-class">
      Banner content
    </Flash>
  )
}
```

👍 Examples of **correct** code for this rule:

```jsx
import {Banner} from '@primer/react/experimental'

function ExampleComponent() {
  return <Banner variant="warning">Warning message</Banner>
}
```

```jsx
import {Banner} from '@primer/react/experimental'

function ExampleComponent() {
  return (
    <Banner variant="warning" className="custom-class">
      Banner content
    </Banner>
  )
}
```

## Auto-fix

This rule provides automatic fixes that:

- Replace `Flash` component usage with `Banner`
- Update import statements from `@primer/react` to `@primer/react/experimental`
- Preserve all props, attributes, and children content
- Handle mixed imports appropriately
- Avoid duplicate Banner imports when they already exist
