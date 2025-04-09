# eslint-plugin-primer-react

[![npm package](https://img.shields.io/npm/v/eslint-plugin-primer-react.svg)](https://www.npmjs.com/package/eslint-plugin-primer-react)

ESLint rules for Primer React

## Installation

Assuming you already have [ESLint](https://www.npmjs.com/package/eslint) and [Primer React](https://github.com/primer/react) installed, run:

   ```shell
   npm install --save-dev eslint-plugin-primer-react

   # or

   yarn add --dev eslint-plugin-primer-react
   ```

## Setup

### Flat Configuration (`eslint.config.js`)

In your [`eslint.config`](https://eslint.org/docs/user-guide/configuring/configuration-files) file, import `eslint-plugin-primer-react` and extend the recommended configuration using `getFlatConfigs()`:

```js
import pluginPrimerReact from 'eslint-plugin-primer-react'

export default [
  pluginPrimerReact.getFlatConfigs().recommended,
  {
    rules: {
      'primer-react/no-system-props': 'error',
      // other custom rules...
    },
  },
]
```

### Legacy Configuration (`.eslintrc.js`)

In your [`.eslintrc`](https://eslint.org/docs/latest/use/configure/configuration-files-deprecated) file, extend the recommended Primer React ESLint config:

   ```js
   {
     "extends": [
       // ...
       "plugin:primer-react/recommended"
     ]
   }
   ```

## Rules

- [direct-slot-children](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/direct-slot-children.md)
- [no-system-props](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-system-props.md)
- [new-css-color-vars](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/new-css-color-vars.md)
- [no-deprecated-props](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-deprecated-props.md)
- [a11y-tooltip-interactive-trigger](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-tooltip-interactive-trigger.md)
- [a11y-explicit-heading](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-explicit-heading.md)
- [a11y-link-in-text-block](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-link-in-text-block.md)
- [a11y-remove-disable-tooltip](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-remove-disable-tooltip.md)
- [a11y-use-accessible-tooltip](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/a11y-use-accessible-tooltip.md)
- [no-deprecated-experimental-components](https://github.com/primer/eslint-plugin-primer-react/blob/main/docs/rules/no-deprecated-experimental-components.md)
