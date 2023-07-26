const rule = require('../no-deprecated-components')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

ruleTester.run('no-deprecated-components', rule, {
  valid: [`import {ActionList} from '@primer/react';`, `import {Tooltip} from '@primer/react/experimental';`],
  invalid: [
    {
      code: `import {ActionList} from '@primer/react/deprecated';`,
      errors: [
        {
          messageId: 'deprecatedComponent'
        }
      ]
    },
    {
      code: `import {Tooltip} from '@primer/react';`,
      errors: [
        {
          messageId: 'toBeDeprecatedComponent'
        }
      ]
    }
  ]
})
