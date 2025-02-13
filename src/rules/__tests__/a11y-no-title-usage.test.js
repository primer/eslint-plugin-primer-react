const rule = require('../a11y-no-title-usage')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('a11y-no-title-usage', rule, {
  valid: [
    `import {RelativeTime} from '@primer/react';
  <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={true} />`,
    `import {RelativeTime} from '@primer/react';
  <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle />`,
    `import {RelativeTime} from '@primer/react';
  <RelativeTime date={new Date('2020-01-01T00:00:00Z')} />`,
  ],
  invalid: [
    {
      code: `import {RelativeTime} from '@primer/react'; <RelativeTime date={new Date('2020-01-01T00:00:00Z')} noTitle={false} />`,
      output: `import {RelativeTime} from '@primer/react'; <RelativeTime date={new Date('2020-01-01T00:00:00Z')} />`,
      errors: [{messageId: 'noTitleOnRelativeTime'}],
    },
  ],
})
