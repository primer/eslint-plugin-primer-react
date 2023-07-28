---
'eslint-plugin-primer-react': patch
---

* Fixes `nonInteractiveLink` rule for links that pass values through JSX rather than a string
* Adds optional chaining to `getJSXOpeningElementAttribute` to avoid error when no `name` is present
