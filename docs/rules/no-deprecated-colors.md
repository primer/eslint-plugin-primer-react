# Disallow references to deprecated color variables (no-deprecated-colors)

🔧 The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

[Theming](https://primer.style/react/theming) in Primer React is made possible by a theme object that defines your application's colors, spacing, fonts, and more. The color variables in Primer React's [default theme object](https://primer.style/react/theme-reference) are pulled from [Primer Primitives](https://github.com/primer/primitives). When a color variable is deprecated in Primer Primitives, it's important to remove references to that color variable before the variable removed from the library.   

## Rule details

This rule disallows references to color variables that are deprecated in [Primer Primitives](https://github.com/primer/primitives).


👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-colors: "error" */
import {Box, themeGet} from '@primer/components'
import styled from 'styled-components'

const Example() = () => <Box color="some.deprecated.color">Incorrect</Box>

const StyledExample = styled.div`
  color: ${themeGet('some.deprecated.color')};
`
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-colors: "error" */
import {Box, themeGet} from '@primer/components'
import styled from 'styled-components'

const Example() = () => <Box color="some.color">Correct</Box>

const StyledExample = styled.div`
  color: ${themeGet('some.color')};
`
```
