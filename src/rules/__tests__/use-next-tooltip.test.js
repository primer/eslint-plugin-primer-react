const rule = require('../use-next-tooltip')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('use-next-tooltip', rule, {
  valid: [
    `import {Tooltip} from '@primer/react/next';`,
    `import {UnderlineNav, Button} from '@primer/react';
   import {Tooltip} from '@primer/react/next';`,
    `import {UnderlineNav, Button} from '@primer/react';
   import {Tooltip, SelectPanel} from '@primer/react/next';`,
  ],
  invalid: [
    {
      code: `import {Tooltip} from '@primer/react';`,
      errors: [{messageId: 'useNextTooltip'}],
      output: `import {Tooltip} from '@primer/react/next';`,
    },
    {
      code: `import {Tooltip, Button} from '@primer/react';`,
      errors: [{messageId: 'useNextTooltip'}],
      output: `import {Button} from '@primer/react';\nimport {Tooltip} from '@primer/react/next';`,
    },
    {
      code: `import {ActionList, ActionMenu, Tooltip, Button} from '@primer/react';`,
      errors: [{messageId: 'useNextTooltip'}],
      output: `import {ActionList, ActionMenu, Button} from '@primer/react';\nimport {Tooltip} from '@primer/react/next';`,
    },
  ],
})
