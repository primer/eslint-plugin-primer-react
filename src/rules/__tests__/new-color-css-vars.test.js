const rule = require('../new-color-css-vars')
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

ruleTester.run('no-color-css-vars', rule, {
  valid: [
    {
      code: `{color: 'fg.default'}`
    },
    {
      code: `<circle stroke="var(--color-border-default)" strokeWidth="2" />`
    },
    {
      code: `<circle fill="var(--color-border-default)" strokeWidth="2" />`
    },
    {
      code: `<div style={{ color: 'var(--color-border-default)' }}></div>`
    }
  ],
  invalid: [
    {
      code: `<Button sx={{color: 'var(--color-fg-muted)'}}>Test</Button>`,
      output: `<Button sx={{color: 'var(--fgColor-muted, var(--color-fg-muted))'}}>Test</Button>`,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))'
        }
      ]
    },
    {
      code: `
        <Box sx={{
          '&:hover [data-component="copy-link"] button, &:focus [data-component="copy-link"] button': {
            color: 'var(--color-accent-fg)'
          }
        }}>
        </Box>`,
      output: `
        <Box sx={{
          '&:hover [data-component="copy-link"] button, &:focus [data-component="copy-link"] button': {
            color: 'var(--fgColor-accent, var(--color-accent-fg))'
          }
        }}>
        </Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent, var(--color-accent-fg))'
        }
      ]
    },
    {
      code: `<Box sx={{boxShadow: '0 0 0 2px var(--color-canvas-subtle)'}} />`,
      output: `<Box sx={{boxShadow: '0 0 0 2px var(--bgColor-muted, var(--color-canvas-subtle))'}} />`,
      errors: [
        {
          message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted, var(--color-canvas-subtle))'
        }
      ]
    },
    {
      code: `<Box sx={{border: 'solid 2px var(--color-border-default)'}} />`,
      output: `<Box sx={{border: 'solid 2px var(--borderColor-default, var(--color-border-default))'}} />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))'
        }
      ]
    },
    {
      code: `<Box sx={{backgroundColor: 'var(--color-canvas-default)'}} />`,
      output: `<Box sx={{backgroundColor: 'var(--bgColor-default, var(--color-canvas-default))'}} />`,
      errors: [
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default, var(--color-canvas-default))'
        }
      ]
    },
    {
      name: 'variable in scope',
      code: `
        const baseStyles = { color: 'var(--color-fg-muted)' }
        export const Fixture = <Button sx={baseStyles}>Test</Button>
      `,
      output: `
        const baseStyles = { color: 'var(--fgColor-muted, var(--color-fg-muted))' }
        export const Fixture = <Button sx={baseStyles}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))'
        }
      ]
    },
    {
      name: 'merge in sx',
      code: `
        import {merge} from '@primer/react'
        export const Fixture = props => <Button sx={merge({color: 'var(--color-fg-muted)'}, props.sx)}>Test</Button>
      `,
      output: `
        import {merge} from '@primer/react'
        export const Fixture = props => <Button sx={merge({color: 'var(--fgColor-muted, var(--color-fg-muted))'}, props.sx)}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))'
        }
      ]
    },
    {
      code: `<Box sx={{borderColor: 'var(--color-border-default)'}} />`,
      output: `<Box sx={{borderColor: 'var(--borderColor-default, var(--color-border-default))'}} />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))'
        }
      ]
    },
    {
      name: 'variable in styled.component',
      code: `
        import {sx, SxProp} from '@primer/react'
        export const HighlightToken = styled.span\`
          color: var(--color-accent-emphasis);
          \${sx}
        \`
        const ClickableTokenSpan = styled(HighlightToken)\`
          &:hover, &:focus { background-color: accent.muted;}
        \`
      `,
      errors: [
        {
          message: 'Replace var(--color-accent-emphasis) with var(--fgColor-accent, var(--color-accent-emphasis))'
        }
      ]
    }
  ]
})
