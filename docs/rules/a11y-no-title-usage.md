## Rule Details

This rule aims to prevent the use of the `title` attribute with some components from `@primer/react`. The `title` attribute is not keyboard accessible, which results in accessibility issues. Instead, we should utilize alternatives that are accessible.

👎 Examples of **incorrect** code for this rule

```jsx
import {RelativeTime} from '@primer/react'

<RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={false} />
```

👍 Examples of **correct** code for this rule:

```jsx
import {RelativeTime} from '@primer/react'

<RelativeTime date={new Date('2020-01-01T00:00:00Z')} />
```

The `noTitle` attribute can be omitted because its default value is `true` internally.