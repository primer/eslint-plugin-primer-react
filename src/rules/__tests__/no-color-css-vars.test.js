const rule = require('../no-color-css-vars')
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

// report all strings that start with 'var(--color-'
// autofix strings: 'var(--color-fg-default)' -> 'fg.default'

{
  /* <Button sx={{zIndex: 1, color: 'var(--color-fg-muted)'}}> */
}

{
  /* <Box sx={{
        '&:hover [data-component="copy-link"] button, &:focus [data-component="copy-link"] button': {
          color: 'var(--color-accent-fg)',
        },
      }}
></Box> */
}

ruleTester.run('no-color-css-vars', rule, {
  valid: [`{color: 'fg.default'}`],
  invalid: [
    {
      code: `{color: 'var(--color-fg-default)'}`,
      output: `{color: 'fg.default'}`,
      errors: [
        {
          message: 'Replace var(--color-fg-default) with fg.default'
        }
      ]
    }
  ]
})
