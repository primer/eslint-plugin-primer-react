---
"eslint-plugin-primer-react": major
---


- BREAKING CHANGE: Deleted the `no-system-props` rule to eliminate checks for styled-system props in components.
- BREAKING CHANGE: Removed the `no-unnecessary-components` rule that enforced the use of plain HTML elements over `Box` and `Text` when not using `sx` for styling.
- BREAKING CHANGE: Eliminated the `use-styled-react-import` rule that enforced importing components from `@primer/styled-react` when using the `sx` prop.
- Removed styled-system, @types/styled-system dependencies
