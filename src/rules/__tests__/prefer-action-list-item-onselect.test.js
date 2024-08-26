const {RuleTester} = require('@typescript-eslint/rule-tester')
const rule = require('../prefer-action-list-item-onselect')

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('prefer-action-list-item-onselect', rule, {
  valid: [
    {code: `<ActionList.Item onSelect={() => console.log(1)} />`},
    {code: `<ActionList.Item onSelect={() => console.log(1)} onClick={() => console.log(1)} />`},
    {code: `<Other onClick={() => console.log(1)} />`},
    {code: `<ActionList.Item onClick={() => console.log(1)} onKeyDown={() => console.log(1)} />`},
    {code: `<ActionList.Item onClick={() => console.log(1)} onKeyUp={() => console.log(1)} />`},
  ],
  invalid: [
    {
      code: `<ActionList.Item onClick={() => console.log(1)} />`,
      errors: [{messageId: 'prefer-action-list-item-onselect'}],
    },
    {
      code: `<ActionList.Item aria-label="Edit item 1" onClick={() => console.log(1)} />`,
      errors: [{messageId: 'prefer-action-list-item-onselect'}],
    },
  ],
})
