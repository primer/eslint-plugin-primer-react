---
"eslint-plugin-primer-react": patch
---

Add `skipImportCheck` option. By default, the `no-deprecated-colors` rule will only check for deprecated colors used in functions and components that are imported from `@primer/components`. You can disable this behavior by setting `skipImportCheck` to `true`. This is useful for linting custom components that pass color-related props down to Primer React components.
