const rule = require('../new-color-css-vars-have-fallback')
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

ruleTester.run('new-color-css-vars-have-fallback', rule, {
  valid: [
    {
      code: `<circle stroke="var(--fgColor-muted, var(--color-fg-muted))" strokeWidth="2" />`,
    },
  ],
  invalid: [
    {
      code: `<circle stroke="var(--fgColor-muted)" strokeWidth="2" />`,
      errors: [
        {
          message:
            'Expected a fallback value for CSS variable --fgColor-muted. New color variables fallbacks, check primer.style/primitives to find the correct value.',
        },
      ],
    },
  ],
})
