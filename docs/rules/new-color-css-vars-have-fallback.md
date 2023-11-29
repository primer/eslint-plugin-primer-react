## Ensure new Primitive v8 color CSS vars have a fallback

This rule is temporary as we begin testing v8 color tokens behind a feature flag. If a color token is used without a fallback, the color will only render if the feature flag is enabled. This rule is an extra safety net to ensure we don't accidentally ship code that relies on the feature flag.

## Rule Details

This rule refers to a JSON file that lists all the new color tokens

```json
["--fgColor-default", "--fgColor-muted", "--fgColor-onEmphasis"]
```

If it finds that one of these tokens is used without a fallback, it will throw an error.

👎 Examples of **incorrect** code for this rule

```jsx
<Button sx={{color: 'var(--fgColor-muted)'}}>Test</Button>
```

👍 Examples of **correct** code for this rule:

```jsx
<Button sx={{color: 'var(--fgColor-muted, var(--color-fg-muted))'}}>Test</Button>
```
