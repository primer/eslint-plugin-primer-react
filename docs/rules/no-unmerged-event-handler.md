# Ensure event handlers are merged with spread props (no-unmerged-event-handler)

When using spread props (`{...rest}`, `{...props}`, etc.) along with event handler props (like `onClick`, `onChange`, etc.), you should merge the event handler from the spread props with your custom handler to avoid unintentionally overriding event handlers.

## Rule details

This rule warns when a component has spread props before an event handler prop, but the event handler doesn't appear to be merging handlers using a utility like `compose()` or `composeEventHandlers()`.

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-unmerged-event-handler: "error" */

// ❌ onClick may override onClick from rest
<Example {...rest} onClick={handleClick} />

// ❌ Arrow function doesn't merge
<Example {...rest} onClick={() => {}} />

// ❌ onChange expression doesn't merge
<Example {...rest} onChange={handleChange} />
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-unmerged-event-handler: "error" */

// ✅ Using compose to merge onClick from rest
<Example {...rest} onClick={compose(onClick, handleClick)} />

// ✅ Using composeEventHandlers to merge
<Example {...rest} onClick={composeEventHandlers(onClick, handleClick)} />

// ✅ Event handler before spread (spread will override)
<Example onClick={handleClick} {...rest} />

// ✅ No spread props
<Example onClick={handleClick} />
```

## Why this matters

When you spread props and then specify an event handler, you might be overriding an event handler that was passed in through the spread:

```jsx
// ❌ Bad: onClick from rest gets lost
function MyComponent({onClick, ...rest}) {
  return <Button {...rest} onClick={() => console.log('clicked')} />
  // If rest contains { onClick: importantHandler }
  // Result: importantHandler never gets called!
}

// ✅ Good: onClick from rest is preserved and composed
function MyComponent({onClick, ...rest}) {
  return <Button {...rest} onClick={compose(onClick, () => console.log('clicked'))} />
  // If rest contains { onClick: importantHandler }
  // Result: Both importantHandler and the log function get called!
}
```

## Detected Event Handlers

This rule checks for the following event handler props:

- Mouse events: `onClick`, `onDoubleClick`, `onContextMenu`, `onMouseDown`, `onMouseUp`, `onMouseEnter`, `onMouseLeave`, `onMouseMove`, `onMouseOver`, `onMouseOut`
- Touch events: `onTouchStart`, `onTouchEnd`, `onTouchMove`, `onTouchCancel`
- Keyboard events: `onKeyDown`, `onKeyUp`, `onKeyPress`
- Form events: `onChange`, `onSubmit`, `onInput`, `onInvalid`, `onSelect`
- Focus events: `onFocus`, `onBlur`
- Drag events: `onDrag`, `onDragEnd`, `onDragEnter`, `onDragExit`, `onDragLeave`, `onDragOver`, `onDragStart`, `onDrop`
- Other events: `onScroll`, `onWheel`, `onLoad`, `onError`, `onAbort`
- Media events: `onCanPlay`, `onCanPlayThrough`, `onDurationChange`, `onEmptied`, `onEncrypted`, `onEnded`, `onLoadedData`, `onLoadedMetadata`, `onLoadStart`, `onPause`, `onPlay`, `onPlaying`, `onProgress`, `onRateChange`, `onSeeked`, `onSeeking`, `onStalled`, `onSuspend`, `onTimeUpdate`, `onVolumeChange`, `onWaiting`
- Animation/Transition events: `onAnimationStart`, `onAnimationEnd`, `onAnimationIteration`, `onTransitionEnd`

## Options

This rule has no configuration options.

## When to use this rule

Use this rule when your components accept and spread props that might contain event handlers. This is common in component libraries and wrapper components.

## Related Rules

- [spread-props-first](./spread-props-first.md) - Ensures spread props come before named props
- [no-unmerged-classname](./no-unmerged-classname.md) - Ensures className is merged with spread props
