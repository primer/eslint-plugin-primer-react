# Disallow use of style system props (no-system-colors)

🔧 The `--fix` option on the [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

System props are deprecated in Primer components (excluding utility components).

## Rule details

This rule disallows use of any styled system prop on a Primer component.

\*The two non-deprecated utility components (`Box` and `Text`) are allowed to use system props.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-system-props: "error" */
import {Button} from '@primer/components'

<Button width={200} />
<Button width={200} sx={{height: 300}} />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-system-props: "error" */
import {Box, Button, ProgressBar} from '@primer/components'
import {Avatar} from 'some-other-library'

<Button sx={{width: 200}} />,
<Button someOtherProp="foo" />,

<ProgressBar bg="howdy" />

<Box width={200} />,

<Avatar width={200} />,
```
