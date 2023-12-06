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
      code: `import {Tooltip, Button} from '@primer/react';\n<Tooltip aria-label="tooltip text"><Button>Button</Button></Tooltip>`,
      errors: [{messageId: 'useNextTooltip'}, {messageId: 'useTextProp'}],
      output: `import {Button} from '@primer/react';\nimport {Tooltip} from '@primer/react/next';\n<Tooltip text="tooltip text"><Button>Button</Button></Tooltip>`,
    },
    {
      code: `import {ActionList, ActionMenu, Tooltip, Button} from '@primer/react';\n<Tooltip aria-label="tooltip text"><Button>Button</Button></Tooltip>`,
      errors: [
        {messageId: 'useNextTooltip', line: 1},
        {messageId: 'useTextProp', line: 2},
      ],
      output: `import {ActionList, ActionMenu, Button} from '@primer/react';\nimport {Tooltip} from '@primer/react/next';\n<Tooltip text="tooltip text"><Button>Button</Button></Tooltip>`,
    },
  ],
})
