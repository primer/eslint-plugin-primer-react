# Ensure className is merged with spread props (no-unmerged-classname)

When using spread props (`{...rest}`, `{...props}`, etc.) along with a `className` prop, you should merge the className from the spread props with your custom className to avoid unintentionally overriding classes.

## Rule details

This rule warns when a component has spread props before a `className` prop, but the `className` doesn't appear to be merging values using a utility like `clsx()` or `classNames()`.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-unmerged-classname: "error" */

// ❌ className may override className from rest
<Example {...rest} className="custom-class" />

// ❌ className expression doesn't merge
<Example {...rest} className={myClassName} />

// ❌ Template literal doesn't merge with rest
<Example {...rest} className={`foo ${bar}`} />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-unmerged-classname: "error" */

// ✅ Using clsx to merge className from rest
<Example {...rest} className={clsx(className, "custom-class")} />

// ✅ Using classNames to merge
<Example {...rest} className={classNames(className, "custom-class")} />

// ✅ Using cn utility to merge
<Example {...rest} className={cn(className, "custom-class")} />

// ✅ className before spread (spread will override)
<Example className="custom-class" {...rest} />

// ✅ No spread props
<Example className="custom-class" />
```

## Why this matters

When you spread props and then specify a className, you might be overriding a className that was passed in through the spread:

```jsx
// ❌ Bad: className from rest gets lost
function MyComponent({className, ...rest}) {
  return <Button {...rest} className="my-custom-class" />
  // If rest contains { className: "important-class" }
  // Result: className="my-custom-class" (important-class is lost!)
}

// ✅ Good: className from rest is preserved and merged
function MyComponent({className, ...rest}) {
  return <Button {...rest} className={clsx(className, 'my-custom-class')} />
  // If rest contains { className: "important-class" }
  // Result: className="important-class my-custom-class" (both preserved!)
}
```

## Options

This rule has no configuration options.

## When to use this rule

Use this rule when your components accept and spread props that might contain a `className`. This is common in component libraries and wrapper components.

## Related Rules

- [spread-props-first](./spread-props-first.md) - Ensures spread props come before named props
