## Require `inline` prop on `<Link>` component inside a text block

The `Link` component should have the `inline` prop when it is used inside of a text block.

## Rule Details

This rule enforces setting `inline` on the `<Link>` component when a `<Link>` is detected inside of a text block without distiguishable styling.

The lint rule will essentially flag any `<Link>` without the `inline` property (equal to `true`) detected with string nodes on either side.

This rule will not catch all instances of link in text block due to the limitations of static analysis, so be sure to also have in-browser checks in place such as the [link-in-text-block Axe rule](https://dequeuniversity.com/rules/axe/4.9/link-in-text-block) for additional coverage.

The edge cases that the linter skips to avoid false positives will include:

* `<Link sx={{fontWeight:...}}>` or `<Link sx={{fontFamily:...}}>` because these technically may provide sufficient distinguishing styling.
* `<Link>` where the only adjacent text is a period, since that can't really be considered a text block.
* `<Link>` where the children is a JSX component, rather than a string literal, because then it might be an icon link rather than a text link.
* `<Link>` that are nested inside of headings as these have often been breadcrumbs.

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

## Options

- `skipImportCheck` (default: `false`)

By default, the `a11y-explicit-heading` rule will only check for `<Heading>` components imported directly from `@primer/react`. You can disable this behavior by setting `skipImportCheck` to `true`.
