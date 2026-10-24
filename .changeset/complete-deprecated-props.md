---
'eslint-plugin-primer-react': minor
---

Expand `no-deprecated-props` to cover known deprecated Primer props, including compound components, inherited input props, aliases, and namespace imports. Resolve imports to avoid reporting unrelated components, and preserve the `ActionList.Group.title` fix without producing invalid JSX for self-closing groups.
