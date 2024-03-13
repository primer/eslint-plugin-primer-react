# eslint-plugin-primer-react

## 4.1.3

### Patch Changes

- [#152](https://github.com/primer/eslint-plugin-primer-react/pull/152) [`7baeb96`](https://github.com/primer/eslint-plugin-primer-react/commit/7baeb9684cc5f84847f004fee282a3362517d7d0) Thanks [@siddharthkp](https://github.com/siddharthkp)! - no-system-props: Add option to ignore specific component names

## 4.1.2

### Patch Changes

- [#148](https://github.com/primer/eslint-plugin-primer-react/pull/148) [`523e169`](https://github.com/primer/eslint-plugin-primer-react/commit/523e169a3c6c801750d451e875c83f52e383c772) Thanks [@siddharthkp](https://github.com/siddharthkp)! - no-system-props: skip html elements

- [#149](https://github.com/primer/eslint-plugin-primer-react/pull/149) [`ca14bb6`](https://github.com/primer/eslint-plugin-primer-react/commit/ca14bb695ad296903bfe7598b4eb81291796245a) Thanks [@siddharthkp](https://github.com/siddharthkp)! - no-system-props: allow maxWidth prop for Truncate

## 4.1.1

### Patch Changes

- [#145](https://github.com/primer/eslint-plugin-primer-react/pull/145) [`0369cb8`](https://github.com/primer/eslint-plugin-primer-react/commit/0369cb857dd49945ac7929444ffacb2ecc02a2ed) Thanks [@siddharthkp](https://github.com/siddharthkp)! - no-system-props: Add `position` as allowed prop for `Dialog`

## 4.1.0

### Minor Changes

- [#129](https://github.com/primer/eslint-plugin-primer-react/pull/129) [`eb04624`](https://github.com/primer/eslint-plugin-primer-react/commit/eb046249daaa9ab72d9ca4bbfba30fd494a79e23) Thanks [@joshblack](https://github.com/joshblack)! - Add no-deprecated-entrypoints rule to lint against deprecated import usage in @primer/react

### Patch Changes

- [#133](https://github.com/primer/eslint-plugin-primer-react/pull/133) [`5cc9630`](https://github.com/primer/eslint-plugin-primer-react/commit/5cc96305bfa884cf9f447d1e033bc2f5c9e110b7) Thanks [@siddharthkp](https://github.com/siddharthkp)! - no-system-props: Add alignContent to allowed props for Button

## 4.0.4

### Patch Changes

- [#122](https://github.com/primer/eslint-plugin-primer-react/pull/122) [`3bc226a`](https://github.com/primer/eslint-plugin-primer-react/commit/3bc226ad0786f9a7a21ce92a63cbba17b8a5b763) Thanks [@lukasoppermann](https://github.com/lukasoppermann)! - New rule: new-color-css-vars-have-fallback: checks that if a new color var is used, it has a fallback value

## 4.0.3

### Patch Changes

- [#81](https://github.com/primer/eslint-plugin-primer-react/pull/81) [`821ef4d`](https://github.com/primer/eslint-plugin-primer-react/commit/821ef4d2a1b87f2418cb9c48bed37b793361b282) Thanks [@langermank](https://github.com/langermank)! - New rule: `new-color-css-vars` to find/replace legacy CSS color vars in sx prop

## 4.0.2

### Patch Changes

- [#76](https://github.com/primer/eslint-plugin-primer-react/pull/76) [`1750256`](https://github.com/primer/eslint-plugin-primer-react/commit/17502566745fcc7ebcebef730c1c7c60be276f06) Thanks [@joshblack](https://github.com/joshblack)! - Update the no-system-props rule to exclude the `border` prop for the `Blankslate` component from `@primer/react`.

## 4.0.1

### Patch Changes

- [#74](https://github.com/primer/eslint-plugin-primer-react/pull/74) [`c07df5c`](https://github.com/primer/eslint-plugin-primer-react/commit/c07df5c067e2a980bcd373d1c992a2123ef70c5c) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Adds support for `MarkdownEditor.Footer` in `direct-slot-children` rule

## 4.0.0

### Major Changes

- [#51](https://github.com/primer/eslint-plugin-primer-react/pull/51) [`a65aa32`](https://github.com/primer/eslint-plugin-primer-react/commit/a65aa32c612c7fe952ec47bb3d926cf8adae9fab) Thanks [@broccolinisoup](https://github.com/broccolinisoup)! - Add `a11y-tooltip-interactive-trigger`

* [#66](https://github.com/primer/eslint-plugin-primer-react/pull/66) [`d1df609`](https://github.com/primer/eslint-plugin-primer-react/commit/d1df609b260505ee9dea1740bc96a3187355d727) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Add `a11y-explicit-heading` rule

### Minor Changes

- [#67](https://github.com/primer/eslint-plugin-primer-react/pull/67) [`4dfdb47`](https://github.com/primer/eslint-plugin-primer-react/commit/4dfdb47b40e7f187573b8203830541b86cc7a953) Thanks [@TylerJDev](https://github.com/TylerJDev)! - \* Updates component mapping, adds `components.js`
  - Bumps `eslint-plugin-github` and `eslint-plugin-jsx-a11y`
  - Fixes bug in `a11y-explicit-heading` when using spread props, or variable for `as`

### Patch Changes

- [#72](https://github.com/primer/eslint-plugin-primer-react/pull/72) [`522b9cc`](https://github.com/primer/eslint-plugin-primer-react/commit/522b9ccbcfb26d18f2ea8b2514a6a7975480aaa7) Thanks [@TylerJDev](https://github.com/TylerJDev)! - Removes `Link`, `Spinner` and `TabNav.Link` from component mapping

* [#73](https://github.com/primer/eslint-plugin-primer-react/pull/73) [`974d9e8`](https://github.com/primer/eslint-plugin-primer-react/commit/974d9e85c7460a05eb0345086b340b650700d24d) Thanks [@TylerJDev](https://github.com/TylerJDev)! - \* Fixes `nonInteractiveLink` rule for links that pass values through JSX rather than a string
  - Adds optional chaining to `getJSXOpeningElementAttribute` to avoid error when no `name` is present

## 3.0.0

### Major Changes

- [#49](https://github.com/primer/eslint-plugin-primer-react/pull/49) [`ad22b85`](https://github.com/primer/eslint-plugin-primer-react/commit/ad22b85367ec3143dfaf73e4057cbe41410b5dcb) Thanks [@colebemis](https://github.com/colebemis)! - `direct-slot-children`: Add checks for `MarkdownEditor` slot children

## 2.0.3

### Patch Changes

- [#47](https://github.com/primer/eslint-plugin-primer-react/pull/47) [`9964e4e`](https://github.com/primer/eslint-plugin-primer-react/commit/9964e4e5415c3bbeab78763b7b4d4e29a0bdbb95) Thanks [@colebemis](https://github.com/colebemis)! - - Update the no-system-props rule to properly check subcomponents for system props
  - Adds valid sucomponent props to the allowlist

## 2.0.2

### Patch Changes

- [#45](https://github.com/primer/eslint-plugin-primer-react/pull/45) [`a39e34d`](https://github.com/primer/eslint-plugin-primer-react/commit/a39e34d26e72cc4b64a35627a6c4f700fae93fe2) Thanks [@colebemis](https://github.com/colebemis)! - More `direct-slot-children` fixes:
  - Fix bug related self-closing JSX tags
  - Allow slot children to accept multiple parents (ex: `ActionList.Item` or `ActionList.LinkItem`)
  - Add `SplitPageLayout` and `NavList` to the slot map
  - Ignore `MarkdownEditor` because it's still a draft

## 2.0.1

### Patch Changes

- [#43](https://github.com/primer/eslint-plugin-primer-react/pull/43) [`943e49a`](https://github.com/primer/eslint-plugin-primer-react/commit/943e49a62ada544b73320791858398705ed8208e) Thanks [@colebemis](https://github.com/colebemis)! - `direct-slot-children` fixes

## 2.0.0

### Major Changes

- [#39](https://github.com/primer/eslint-plugin-primer-react/pull/39) [`96a675d`](https://github.com/primer/eslint-plugin-primer-react/commit/96a675d8865450d3be556135947a29181a56551c) Thanks [@colebemis](https://github.com/colebemis)! - Add `direct-slot-children` rule

### Minor Changes

- [#21](https://github.com/primer/eslint-plugin-primer-react/pull/21) [`5f68eb7`](https://github.com/primer/eslint-plugin-primer-react/commit/5f68eb7e222e2a41c527b5036b1308ff293e7a0d) Thanks [@SferaDev](https://github.com/SferaDev)! - `no-system-props`: Add `skipImportCheck` option

## 1.0.1

### Patch Changes

- [#36](https://github.com/primer/eslint-plugin-primer-react/pull/36) [`f03cd7d`](https://github.com/primer/eslint-plugin-primer-react/commit/f03cd7defd45e1587dbbfac55a0290172c3b5af3) Thanks [@khiga8](https://github.com/khiga8)! - Define some component mappings for jsx-a11y

## 1.0.0

### Major Changes

- [#34](https://github.com/primer/eslint-plugin-primer-react/pull/34) [`efd4f67`](https://github.com/primer/eslint-plugin-primer-react/commit/efd4f675d8c24b74e7fd0bcfb4524b42ed3378ea) Thanks [@khiga8](https://github.com/khiga8)! - Provide component mapping for `github/react` preset and add dependencies to `eslint-plugin-github` and `eslint-plugin-jsx-a11y`.

  `eslint` peer dependency is now `^8.0.1`.

## 0.7.4

### Patch Changes

- [#31](https://github.com/primer/eslint-plugin-primer-react/pull/31) [`a64413a`](https://github.com/primer/eslint-plugin-primer-react/commit/a64413aef359e8f16ca088f1975c5e2411c5ffb3) Thanks [@colebemis](https://github.com/colebemis)! - `no-system-props`: Always ignore `size` prop

## 0.7.3

### Patch Changes

- [#27](https://github.com/primer/eslint-plugin-primer-react/pull/27) [`19cbc53`](https://github.com/primer/eslint-plugin-primer-react/commit/19cbc530471f11c4c053ce830e23cb72f36b2c16) Thanks [@colebemis](https://github.com/colebemis)! - `no-system-props`: Ignore `bg` prop on `PointerBox` component

## 0.7.2

### Patch Changes

- [#24](https://github.com/primer/eslint-plugin-primer-react/pull/24) [`e5565ae`](https://github.com/primer/eslint-plugin-primer-react/commit/e5565ae890f55927c0b1dd96d8943efc1e0bbbfa) Thanks [@colebemis](https://github.com/colebemis)! - Replace references to `@primer/components` with `@primer/react`

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
      color: 'text.primary',
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
