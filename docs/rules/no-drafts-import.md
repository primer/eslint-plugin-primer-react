# Disallow use of the drafts endpoint in primer/react (no-drafts-import)

🔧 The `--fix` option on the [ESLint CLI](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

The `/drafts` endpoint in `@primer/react` has been deprecated in favor of
`@primer/react/experimental`.

## Rule details

This rule disallows the use of importing from `@primer/react/drafts` as
`@primer/react/experimental` is now the preferred entrypoint.

👎 Examples of **incorrect** code for this rule:

```tsx
import {UnderlineNav} from '@primer/react/drafts'
```

👍 Examples of **correct** code for this rule:

```tsx
import {UnderlineNav} from '@primer/react/experimental'
```
