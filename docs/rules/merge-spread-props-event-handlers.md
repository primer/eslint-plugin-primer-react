# Ensure event handlers are merged with spread props (merge-spread-props-event-handlers)

When using spread props (`{...rest}`, `{...props}`, etc.) before event handler props (like `onClick`, `onChange`, etc.), the event handlers should be merged using a utility like `compose` to avoid unintentionally overriding the event handler from the spread props.

## Rule details

This rule enforces that when a JSX element has both spread props and event handler props, and the spread props come before the event handlers, the event handlers should use `compose` or a similar utility to merge both handlers.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/merge-spread-props-event-handlers: "error" */

// ❌ onClick after spread - not merged
<Example {...rest} onClick={handleClick} />

// ❌ onChange after spread - not merged
<Example {...rest} onChange={() => {}} />

// ❌ Multiple event handlers after spread - not merged
<Example {...rest} onClick={handleClick} onChange={handleChange} />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/merge-spread-props-event-handlers: "error" */

// ✅ onClick merged with compose
<Example {...rest} onClick={compose(rest.onClick, handleClick)} />

// ✅ onChange merged with compose
<Example {...rest} onChange={compose(rest.onChange, handleChange)} />

// ✅ Event handler before spread (spread will override, which is expected)
<Example onClick={handleClick} {...rest} />

// ✅ Only spread props
<Example {...rest} />

// ✅ Only event handler
<Example onClick={handleClick} />
```

## Why this matters

When you have spread props before an event handler, the event handler from the spread props can be overridden if you don't merge them properly:

```jsx
// ❌ Bad: onClick from rest gets overridden
function MyComponent({onClick, ...rest}) {
  return <Button {...rest} onClick={handleClick} />
}

// If called as: <MyComponent onClick={parentHandler} />
// Result: Only handleClick runs (parentHandler is lost!)

// ✅ Good: Both handlers are composed
function MyComponent({onClick, ...rest}) {
  return <Button {...rest} onClick={compose(rest.onClick, handleClick)} />
}

// If called as: <MyComponent onClick={parentHandler} />
// Result: Both parentHandler and handleClick run in sequence!
```

## Supported event handlers

This rule recognizes the following React event handler props:

- Mouse events: `onClick`, `onMouseEnter`, `onMouseLeave`, `onMouseDown`, `onMouseUp`
- Form events: `onChange`, `onSubmit`, `onInput`, `onSelect`
- Focus events: `onFocus`, `onBlur`
- Keyboard events: `onKeyDown`, `onKeyUp`, `onKeyPress`
- Touch events: `onTouchStart`, `onTouchEnd`, `onTouchMove`, `onTouchCancel`
- Pointer events: `onPointerDown`, `onPointerUp`, `onPointerMove`, etc.
- And many more...

## Options

This rule has no configuration options.

## When to use autofix

This rule includes an autofix that will automatically wrap your event handler in a `compose()` call with the spread prop's event handler. The autofix is safe to use and will preserve your event handler logic while adding the composing behavior.

Note: You'll need to import `compose` or a similar function in your file if it's not already imported. Common utilities include:

- `compose` from utility libraries
- `composeEventHandlers` from Radix UI
- Custom composition utilities from your codebase
