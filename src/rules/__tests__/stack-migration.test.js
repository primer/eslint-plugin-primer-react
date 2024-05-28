const rule = require('../stack-migration')
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

ruleTester.run('stack-migration', rule, {
  valid: [
    `import {Box} from '@primer/react';
    <Box sx={{bg: 'canvas.subtle'}}>Test</Box>
  `,
  ],
  invalid: [
    {
      code: `import {Box} from '@primer/react';
      <Box sx={{display: 'flex'}}>Test</Box>
    `,
      errors: [{messageId: 'boxToStackMigration'}],
    },
    {
      code: `import {Box} from '@primer/react';
      <Box sx={{display: 'flex'}}>Test</Box>
    `,
      errors: [{messageId: 'boxToStackMigration'}],
    },
    {
      code: `import {Box} from '@primer/react';
      <Box sx={{p: 3, display: 'flex'}}>Test</Box>
    `,
      errors: [{messageId: 'boxToStackMigration'}],
    },
    {
      code: `import {Box} from '@primer/react';
      <Box sx={{p: 3, display: 'grid'}}>Test</Box>
    `,
      errors: [{messageId: 'boxToStackMigration'}],
    },
  ],
})
