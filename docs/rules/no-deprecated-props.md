## Rule Details

Reports known deprecated Primer React props. Supports compound components, import
aliases, and namespace imports without TypeScript type information.

### Incorrect

```jsx
import {Autocomplete, Banner} from '@primer/react'

const input = <Autocomplete.Input openOnFocus />
const banner = <Banner icon={InfoIcon} />
```

### Correct

```jsx
import {Autocomplete, Banner} from '@primer/react'

const input = <Autocomplete.Input />
const banner = <Banner leadingVisual={InfoIcon} />
```

Removing `openOnFocus` changes when suggestions open; it has no replacement prop.

The [prop list](../../src/rules/no-deprecated-props.js) is maintained manually.
The rule checks explicit JSX props, not spreads, nested objects, wrappers,
re-exports, or `React.createElement`.

Only `ActionList.Group.title` has an autofix, for paired tags with string or
expression values. Other migrations require manual changes.
