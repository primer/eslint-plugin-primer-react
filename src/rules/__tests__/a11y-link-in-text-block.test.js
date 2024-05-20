const rule = require('../a11y-link-in-text-block')
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

ruleTester.run('a11y-link-in-text-block', rule, {
  valid: [
    `import {Link} from '@primer/react';
     <p>bla blah <Link inline={true}>Link level 1</Link></p>;
  `,
    `import {Link} from '@primer/react';
    <p>bla blah<Link inline>Link level 1</Link></p>;
`,
    `import {Link} from '@primer/react';
    <><span>something</span><Link inline={true}>Link level 1</Link></>;
`,
  ],
  invalid: [
    {
      code: `import {Link} from '@primer/react';
      <p>bla blah<Link>Link level 1</Link></p>
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
    {
      code: `import {Link} from '@primer/react';
      <Box>Something something{' '}
      <Link>Link level 1</Link>
      </Box>
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
  ],
})
