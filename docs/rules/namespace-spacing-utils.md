# Enforce namespacing of spacing utility classes (namespace-spacing-utils)

Primer CSS spacing utility classes (margin and padding) should be namespaced with the `pr-` prefix to avoid conflicts with other CSS frameworks and ensure consistent styling.

## Rule details

This rule enforces that all Primer CSS spacing utility classes (margin and padding) in `className` attributes are prefixed with `pr-`.

### Spacing utility patterns

The following patterns are detected:

- Margin: `m-{size}`, `mx-{size}`, `my-{size}`, `mt-{size}`, `mr-{size}`, `mb-{size}`, `ml-{size}`
- Padding: `p-{size}`, `px-{size}`, `py-{size}`, `pt-{size}`, `pr-{size}`, `pb-{size}`, `pl-{size}`
- Sizes: `0-12`, `n1-n12` (negative values)
- Responsive variants: `mx-sm-2`, `mx-md-4`, `p-lg-3`, `mt-xl-6` (breakpoint embedded in class name)

**Note:** `auto` values (e.g., `m-auto`, `mx-auto`) are **not** flagged by this rule and don't need namespacing.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/namespace-spacing-utils: "error" */

// ❌ Margin classes without namespace
<div className="m-4" />
<div className="mx-2" />
<div className="mt-1 mb-3" />

// ❌ Padding classes without namespace
<div className="p-4" />
<div className="px-2 py-3" />

// ❌ Negative spacing without namespace
<div className="m-n4" />

// ❌ Responsive variants without namespace
<div className="mx-sm-2" />
<div className="mx-md-4" />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/namespace-spacing-utils: "error" */

// ✅ Margin classes with namespace
<div className="pr-m-4" />
<div className="pr-mx-2" />
<div className="pr-mt-1 pr-mb-3" />

// ✅ Padding classes with namespace
<div className="pr-p-4" />
<div className="pr-px-2 pr-py-3" />

// ✅ Negative spacing with namespace
<div className="pr-m-n4" />

// ✅ Auto spacing (no namespace needed)
<div className="mx-auto" />
<div className="m-auto" />

// ✅ Responsive variants with namespace
<div className="pr-mx-sm-2" />
<div className="pr-mx-md-4" />

// ✅ Non-spacing classes are not affected
<div className="text-bold color-fg-default" />
```

## Options

This rule has no configuration options.

## When to use autofix

This rule includes an autofix that will automatically add the `pr-` prefix to unnamespaced spacing utility classes. The autofix operates on individual class tokens and is designed to only modify class names that match the spacing utility patterns, but you should still review the changes before committing.
