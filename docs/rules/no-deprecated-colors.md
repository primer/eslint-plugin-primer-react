# Disallow references to deprecated color variables (no-deprecated-colors)

🔧 The `--fix` option on the [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

[Theming](https://primer.style/react/theming) in Primer React is made possible by a theme object that defines your application's colors, spacing, fonts, and more. The color variables in Primer React's [default theme object](https://primer.style/react/theme-reference) are pulled from [Primer Primitives](https://github.com/primer/primitives). When a color variable is deprecated in Primer Primitives, it's important to remove references to that color variable in your application before it's removed from the library.

## Rule details

This rule disallows references to color variables that are deprecated in [Primer Primitives](https://github.com/primer/primitives).

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-colors: "error" */
import {Box, themeGet} from '@primer/react'
import styled from 'styled-components'

const SystemPropExample() = () => <Box color="some.deprecated.color">Incorrect</Box>

const SxPropExample() = () => <Box sx={{color: 'some.deprecated.color'}}>Incorrect</Box>

const SxPropExample2() = () => <Box sx={{boxShadow: theme => `0 1px 2px ${theme.colors.some.deprecated.color}`}}>Incorrect</Box>

const ThemeGetExample = styled.div`
  color: ${themeGet('colors.some.deprecated.color')};
`
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-colors: "error" */
import {Box, themeGet} from '@primer/react'
import styled from 'styled-components'

const SystemPropExample() = () => <Box color="some.color">Correct</Box>

const SxPropExample() = () => <Box sx={{color: 'some.color'}}>Correct</Box>

const SxPropExample2() = () => <Box sx={{boxShadow: theme => `0 1px 2px ${theme.colors.some.color}`}}>Correct</Box>

const ThemeGetExample = styled.div`
  color: ${themeGet('colors.some.color')};
`
```

## Options

- `skipImportCheck` (default: `false`)

  By default, the `no-deprecated-colors` rule will only check for deprecated colors used in functions and components that are imported from `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`. This is useful for linting custom components that pass color-related props down to Primer React components.

  ```js
  /* eslint primer-react/no-deprecated-colors: ["warn", {"skipImportCheck": true}] */
  import {Box} from '@primer/react'

  function MyBox({color, children}) {
    return <Box color={color}>{children}</Box>
  }

  function App() {
    // Enabling `skipImportCheck` will find deprecated colors used like this:
    return <MyBox color="text.primary">Hello</MyBox>
  }
  ```

- `checkAllStrings` (default: `false`)

  If `checkAllStrings` is set to `true`, the `no-deprecated-colors` rule will check for deprecated colors in all strings. This is useful for catching uses of deprecated colors outside system props and the `sx` prop.

  ```js
  /* eslint primer-react/no-deprecated-colors: ["warn", {"checkAllStrings": true}] */
  import {Box} from '@primer/react'

  function ExampleComponent() {
    const styles = {
      // Enabling `checkAllStrings` will find deprecated colors used like this:
      color: 'text.primary'
    }
    return <Box sx={styles}>Hello</Box>
  }
  ```
