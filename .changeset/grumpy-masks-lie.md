---
'eslint-plugin-primer-react': patch
---

Update no-wildcard-imports rule to not create separate imports for type only imports. This prevents an issue downstream with autofixers
