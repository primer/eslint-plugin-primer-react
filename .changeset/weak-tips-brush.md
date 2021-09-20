---
"eslint-plugin-primer-react": patch
---

The `no-deprecated-colors` rule can now find deprecated colors in the following cases:

* Nested `sx` properties:
 
   ```jsx
  <Box sx={{'&:hover': {bg: 'bg.primary'}}}>
   ```

* Functions in `sx` prop:

   ```jsx
  <Box sx={{boxShadow: theme => `0 1px 2px ${theme.colors.text.primary}`}}>
   ```
