# EXPERIMENTAL: Require `inline` prop on `<Link>` in text block and convert HTML anchors to Link components

This is an experimental rule. If you suspect any false positives reported by this rule, please file an issue so we can make this rule better.

## Rule Details

The `Link` component should have the `inline` prop when it is used within a text block and has no styles (aside from color) to distinguish itself from surrounding plain text.

Additionally, HTML anchor elements (`<a>`) in text blocks should be converted to use the `Link` component from `@primer/react` to maintain consistent styling and accessibility.

Related: [WCAG 1.4.1 Use of Color issues](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)

The lint rule will flag:
- Any `<Link>` without the `inline` property (equal to `true`) detected with string nodes on either side.
- Any HTML `<a>` elements detected within a text block, with an autofix to convert them to `Link` components.

There are certain edge cases that the linter skips to avoid false positives including:

- `<Link className="...">` or `<a className="...">` because there may be distinguishing styles applied.
- `<Link sx={{fontWeight:...}}>` or `<Link sx={{fontFamily:...}}>` because these technically may provide sufficient distinguishing styling.
- `<Link>` or `<a>` where the only adjacent text is a period, since that can't really be considered a text block.
- `<Link>` or `<a>` where the children is a JSX component, rather than a string literal, because then it might be an icon link rather than a text link.
- `<Link>` or `<a>` that are nested inside of headings as these have often been breadcrumbs.

This rule will not catch all instances of link in text block due to the limitations of static analysis, so be sure to also have in-browser checks in place such as the [link-in-text-block Axe rule](https://dequeuniversity.com/rules/axe/4.9/link-in-text-block) for additional coverage.

👎 Examples of **incorrect** code for this rule

```jsx
import {Link} from '@primer/react'

function ExampleComponent() {
  return (
    <SomeComponent>
      <Link>Say hello</Link> or not.
    </SomeComponent>
  )
}
```

```jsx
import {Link} from '@primer/react'

function ExampleComponent() {
  return (
    <SomeComponent>
      Say hello or <Link>sign-up</Link>.
    </SomeComponent>
  )
}
```

```jsx
function ExampleComponent() {
  return (
    <SomeComponent>
      Please <a href="https://github.com">visit our site</a> for more information.
    </SomeComponent>
  )
}
```

```jsx
function ExampleComponent() {
  return (
    <p>
      Learn more about <a href="https://github.com/pricing">GitHub plans</a> and pricing options.
    </p>
  )
}
```

👍 Examples of **correct** code for this rule:

```jsx
function ExampleComponent() {
  return (
    <SomeComponent>
      <Link inline>Say hello</Link> or not.
    </SomeComponent>
  )
}
```

```jsx
function ExampleComponent() {
  return (
    <SomeComponent>
      <Link inline={true}>Say hello</Link> or not.
    </SomeComponent>
  )
}
```

```jsx
import {Link} from '@primer/react'

function ExampleComponent() {
  return (
    <SomeComponent>
      Please <Link href="https://github.com">visit our site</Link> for more information.
    </SomeComponent>
  )
}
```

```jsx
import {Link} from '@primer/react'

function ExampleComponent() {
  return (
    <p>
      Learn more about <Link href="https://github.com/pricing" inline>GitHub plans</Link> and pricing options.
    </p>
  )
}
```

This rule will skip `Link`s containing JSX elements to minimize potential false positives because it is possible the JSX element sufficiently distinguishes the link from surrounding text.

```jsx
function ExampleComponent() {
  return (
    <SomeComponent>
      <Link>
        <SomeAvatar />
        @monalisa
      </Link>{' '}
      commented on your account.
    </SomeComponent>
  )
}
```

This rule will skip `Link`s nested inside of a `Heading`.

```jsx
function ExampleComponent() {
  return (
    <Heading>
      <Link>Previous location</Link>/ Current location
    </Heading>
  )
}
```

This rule will skip `Link`s with a `className`.

```jsx
function ExampleComponent() {
  return (
   Learn more at <Link className={styles.someDistinguishingStyle}>GitHub</Link>
  )
}
```

## Options

- `skipImportCheck` (default: `false`)

By default, the `a11y-link-in-text-block` rule will only check for `<Link>` components imported directly from `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`.
