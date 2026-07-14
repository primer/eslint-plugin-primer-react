---
"eslint-plugin-primer-react": minor
---

Upgrade ESLint to v10.7.0 and update related ESLint dependencies to compatible versions. Replaced the remaining usages of the removed `context.getSourceCode()` API with the `context.sourceCode ?? context.getSourceCode()` fallback so rules work on both ESLint 9 and 10.
