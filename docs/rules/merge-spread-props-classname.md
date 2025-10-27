# Ensure className is merged with spread props (merge-spread-props-classname)

When using spread props (`{...rest}`, `{...props}`, etc.) before a `className` prop, the className should be merged using a utility like `clsx` to avoid unintentionally overriding the className from the spread props.

## Rule details

This rule enforces that when a JSX element has both spread props and a `className` prop, and the spread props come before the `className`, the className should use `clsx` or a similar utility to merge both class names.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/merge-spread-props-classname: "error" */

// ❌ className after spread - not merged
<Example {...rest} className="custom-class" />

// ❌ className expression after spread - not merged
<Example {...rest} className={styles.button} />

// ❌ Multiple spreads with className - not merged
<Example {...rest} {...other} className="custom-class" />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/merge-spread-props-classname: "error" */

// ✅ className merged with clsx
<Example {...rest} className={clsx(rest.className, "custom-class")} />

// ✅ className merged with classnames
<Example {...rest} className={classnames(rest.className, "custom-class")} />

// ✅ className before spread (spread will override, which is expected)
<Example className="custom-class" {...rest} />

// ✅ Only spread props
<Example {...rest} />

// ✅ Only className
<Example className="custom-class" />
```

## Why this matters

When you have spread props before a className, the className from the spread props can be overridden if you don't merge them properly:

```jsx
// ❌ Bad: className from rest gets overridden
function MyComponent({className, ...rest}) {
  return <Button {...rest} className="custom-class" />
}

// If called as: <MyComponent className="parent-class" />
// Result: className="custom-class" (parent-class is lost!)

// ✅ Good: Both classNames are merged
function MyComponent({className, ...rest}) {
  return <Button {...rest} className={clsx(rest.className, 'custom-class')} />
}

// If called as: <MyComponent className="parent-class" />
// Result: className="parent-class custom-class" (both are applied!)
```

## Options

This rule has no configuration options.

## When to use autofix

This rule includes an autofix that will automatically wrap your className in a `clsx()` call with the spread prop's className. The autofix is safe to use and will preserve your className logic while adding the merging behavior.

Note: You'll need to import `clsx` in your file if it's not already imported.
