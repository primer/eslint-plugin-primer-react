# use-styled-react-import

💼 This rule is _disabled_ in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Enforce importing components that use `sx` prop from `@primer/styled-react` instead of `@primer/react`.

## Rule Details

This rule detects when certain Primer React components are used with the `sx` prop and ensures they are imported from the temporary `@primer/styled-react` package instead of `@primer/react`. It also moves certain types and utilities to the styled-react package.

### Components that should be imported from `@primer/styled-react` when used with `sx`:

- ActionList
- ActionMenu
- Box
- Breadcrumbs
- Button
- Flash
- FormControl
- Heading
- IconButton
- Label
- Link
- LinkButton
- PageLayout
- Text
- TextInput
- Truncate
- Octicon
- Dialog

### Types and utilities that should always be imported from `@primer/styled-react`:

- `BoxProps` (type)
- `SxProp` (type)
- `BetterSystemStyleObject` (type)
- `sx` (utility)

## Examples

### ❌ Incorrect

```jsx
import {Button, Link} from '@primer/react'

const Component = () => <Button sx={{color: 'red'}}>Click me</Button>
```

```jsx
import {Box} from '@primer/react'

const Component = () => <Box sx={{padding: 2}}>Content</Box>
```

```jsx
import {sx} from '@primer/react'
```

### ✅ Correct

```jsx
import {Link} from '@primer/react'
import {Button} from '@primer/styled-react'

const Component = () => <Button sx={{color: 'red'}}>Click me</Button>
```

```jsx
import {Box} from '@primer/styled-react'

const Component = () => <Box sx={{padding: 2}}>Content</Box>
```

```jsx
import {sx} from '@primer/styled-react'
```

```jsx
// Components without sx prop can stay in @primer/react
import {Button} from '@primer/react'

const Component = () => <Button>Click me</Button>
```

## Options

This rule has no options.

## When Not To Use It

This rule is specifically for migrating components that use the `sx` prop to the temporary `@primer/styled-react` package. If you're not using the `sx` prop or not participating in this migration, you can disable this rule.
