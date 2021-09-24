# eslint-plugin-primer-react

## 0.5.0

### Minor Changes

- [#10](https://github.com/primer/eslint-plugin-primer-react/pull/10) [`31d069b`](https://github.com/primer/eslint-plugin-primer-react/commit/31d069b0d210c53862de30757ecdfd2222e098b5) Thanks [@colebemis](https://github.com/colebemis)! - Add a `checkAllStrings` option to the `no-deprecated-colors` rule.

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

## 0.4.2

### Patch Changes

- [#7](https://github.com/primer/eslint-plugin-primer-react/pull/7) [`d9dfb8d`](https://github.com/primer/eslint-plugin-primer-react/commit/d9dfb8de6d6dc42efe606517db7a0dd90d5c5578) Thanks [@colebemis](https://github.com/colebemis)! - Add `skipImportCheck` option. By default, the `no-deprecated-colors` rule will only check for deprecated colors used in functions and components that are imported from `@primer/components`. You can disable this behavior by setting `skipImportCheck` to `true`. This is useful for linting custom components that pass color-related props down to Primer React components.

* [#6](https://github.com/primer/eslint-plugin-primer-react/pull/6) [`dd14594`](https://github.com/primer/eslint-plugin-primer-react/commit/dd14594b05e4d800baa76771f5b911d77352a983) Thanks [@colebemis](https://github.com/colebemis)! - The `no-deprecated-colors` rule can now find deprecated colors in the following cases:

  - Nested `sx` properties:

    ```jsx
    <Box sx={{'&:hover': {bg: 'bg.primary'}}}>
    ```

  - Functions in `sx` prop:

    ```jsx
    <Box sx={{boxShadow: theme => `0 1px 2px ${theme.colors.text.primary}`}}>
    ```

## 0.4.1

### Patch Changes

- [#3](https://github.com/primer/eslint-plugin-primer-react/pull/3) [`8e9144f`](https://github.com/primer/eslint-plugin-primer-react/commit/8e9144fd7a9ff1bb99878dca61621351026ddc82) Thanks [@colebemis](https://github.com/colebemis)! - Add type metadata to no-deprecated-colors rule
