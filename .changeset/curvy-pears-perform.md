---
"eslint-plugin-primer-react": minor
---

Add a `checkAllStrings` option to the `no-deprecated-colors` rule.

If `checkAllStrings` is set to `true`, the `no-deprecated-colors` rule will check for deprecated colors in all strings. This is useful for catching uses of deprecated colors outside system props and the `sx` prop.

  ```js
  /* eslint primer-react/no-deprecated-colors: ["warn", {"checkAllStrings": true}] */
  import {Box} from '@primer/components'

  function ExampleComponent() {
    const styles = {
      // Enabling `checkAllStrings` will find deprecated colors used like this:
      color: 'text.primary'
    }
    return <Box sx={styles}>Hello</Box>
  }
  ```
