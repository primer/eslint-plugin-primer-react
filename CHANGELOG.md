# eslint-plugin-primer-react

## 0.7.1

### Patch Changes

- [#22](https://github.com/primer/eslint-plugin-primer-react/pull/22) [`87d0fd6`](https://github.com/primer/eslint-plugin-primer-react/commit/87d0fd6af8a18a2a570c3770571b16fe3b5c3a30) Thanks [@dmarcey](https://github.com/dmarcey)! - Ignore non-literal, non-string arguments to `themeGet` in `no-deprecated-colors` rule

## 0.7.0

### Minor Changes

- [#18](https://github.com/primer/eslint-plugin-primer-react/pull/18) [`f0c7a3d`](https://github.com/primer/eslint-plugin-primer-react/commit/f0c7a3d1ab1d60df2c95b86c80d930d6ef15bde1) Thanks [@jfuchs](https://github.com/jfuchs)! - Introduced an option on no-system-props to include utility components (includeUtilityComponents).

* [#20](https://github.com/primer/eslint-plugin-primer-react/pull/20) [`b0824f6`](https://github.com/primer/eslint-plugin-primer-react/commit/b0824f6c7c69cdf7d70d831626be37f606d70f73) Thanks [@jfuchs](https://github.com/jfuchs)! - Updates no-system-props rule to always exclude the 'variant' prop no matter which component.

## 0.6.1

### Patch Changes

- [#15](https://github.com/primer/eslint-plugin-primer-react/pull/15) [`9b96147`](https://github.com/primer/eslint-plugin-primer-react/commit/9b961478993972a584428d13c5bb792635c2c622) Thanks [@colebemis](https://github.com/colebemis)! - The `no-deprecated-colors` now warns about deprecated _and_ removed color variables

## 0.6.0

### Minor Changes

- [#12](https://github.com/primer/eslint-plugin-primer-react/pull/12) [`df26962`](https://github.com/primer/eslint-plugin-primer-react/commit/df269623f3430066ea6440042da13932e3e35bc4) Thanks [@jfuchs](https://github.com/jfuchs)! - Added a no-system-props rule

## 0.5.0

### Minor Changes

- [#10](https://github.com/primer/eslint-plugin-primer-react/pull/10) [`31d069b`](https://github.com/primer/eslint-plugin-primer-react/commit/31d069b0d210c53862de30757ecdfd2222e098b5) Thanks [@colebemis](https://github.com/colebemis)! - Add a `checkAllStrings` option to the `no-deprecated-colors` rule.

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

## 0.4.2

### Patch Changes

- [#7](https://github.com/primer/eslint-plugin-primer-react/pull/7) [`d9dfb8d`](https://github.com/primer/eslint-plugin-primer-react/commit/d9dfb8de6d6dc42efe606517db7a0dd90d5c5578) Thanks [@colebemis](https://github.com/colebemis)! - Add `skipImportCheck` option. By default, the `no-deprecated-colors` rule will only check for deprecated colors used in functions and components that are imported from `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`. This is useful for linting custom components that pass color-related props down to Primer React components.

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
