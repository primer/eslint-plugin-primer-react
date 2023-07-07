const rule = require('../explicit-heading')
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

ruleTester.run('explicit-heading', rule, {
  valid: [
  `import {Heading} from '@primer/react';
  <Heading as="h1">Heading level 1</Heading>
  `,
  `import {Heading} from '@primer/react';
  <Heading as="h2">Heading level 2</Heading>
  `,
  `import {Heading} from '@primer/react';
  <Heading as="H3">Heading level 2</Heading>
  `,
],
invalid: [    
  {
    code: `
    import {Heading} from '@primer/react';

    <Heading>Heading without "as"</Heading>
    `,
    errors: [
      {
        messageId: 'nonExplicitHeadingLevel'
      }
    ]
  },
  {
    code: `
    import {Heading} from '@primer/react';

    <Heading as="span">Heading component used as "span"</Heading>
    `,
    errors: [
      {
        messageId: 'invalidAsValue'
      }
    ]
  },
]
})
