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
      output: `<Button sx={{color: 'fg.muted'}}>Test</Button>`,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with fg.muted'
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
            color: 'accent.fg'
          }
        }}>
        </Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with accent.fg'
        }
      ]
    },
    {
      code: `<Box sx={{boxShadow: '0 0 0 2px var(--color-canvas-subtle)'}} />`,
      output: `<Box sx={{boxShadow: '0 0 0 2px canvas.subtle'}} />`,
      errors: [
        {
          message: 'Replace var(--color-canvas-subtle) with canvas.subtle'
        }
      ]
    },
    {
      code: `<Box sx={{border: 'solid 2px var(--color-border-default)'}} />`,
      output: `<Box sx={{border: 'solid 2px border.default'}} />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with border.default'
        }
      ]
    },
    {
      code: `<Box sx={{borderColor: 'var(--color-border-default)'}} />`,
      output: `<Box sx={{borderColor: 'border.default'}} />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with border.default'
        }
      ]
    },
    {
      code: `<Box sx={{backgroundColor: 'var(--color-canvas-default)'}} />`,
      output: `<Box sx={{backgroundColor: 'canvas.default'}} />`,
      errors: [
        {
          message: 'Replace var(--color-canvas-default) with canvas.default'
        }
      ]
    },
    {
      code: `<Box backgroundColor="var(--color-canvas-default)" />`,
      output: `<Box backgroundColor="canvas.default" />`,
      errors: [
        {
          message: 'Replace var(--color-canvas-default) with canvas.default'
        }
      ]
    },
    {
      code: `<Box bg="var(--color-canvas-default)" />`,
      output: `<Box bg="canvas.default" />`,
      errors: [
        {
          message: 'Replace var(--color-canvas-default) with canvas.default'
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
        const baseStyles = { color: 'fg.muted' }
        export const Fixture = <Button sx={baseStyles}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with fg.muted'
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
        export const Fixture = props => <Button sx={merge({color: 'fg.muted'}, props.sx)}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with fg.muted'
        }
      ]
    }
    // {
    //   name: 'variable in styled.component',
    //   code: `
    //     import {sx, SxProp} from '@primer/react'
    //     export const HighlightToken = styled.span<SxProp>\`
    //       color: var(--color-accent-emphasis);
    //       \${sx}
    //     \`
    //     const ClickableTokenSpan = styled(HighlightToken)\`
    //       &:hover, &:focus { background-color: accent.muted;}
    //     \`
    //   `,
    //   output: `
    //     import {sx, SxProp} from '@primer/react'
    //     export const HighlightToken = styled.span<SxProp>\`
    //       color: accent.emphasis;
    //       \${sx}
    //     \`
    //     const ClickableTokenSpan = styled(HighlightToken)\`
    //       &:hover, &:focus { background-color: accent.muted;}
    //     \`
    //   `,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-accent-emphasis) with accent.emphasis'
    //     }
    //   ]
    // },
    // {
    //   name: 'MemberExpression in sx: not handled',
    //   code: `
    //     const colors = { muted: 'var(--color-fg-muted)' }
    //     export const Fixture = <Button sx={colors.muted}>Test</Button>
    //   `,
    //   output: `
    //     const colors = { muted: 'fg.muted' }
    //     export const Fixture = <Button sx={colors.muted}>Test</Button>
    //   `,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-fg-muted) with fg.muted'
    //     }
    //   ]
    // },
    // {
    //   name: 'CallExpression in sx: not handled',
    //   code: `
    //     const getColors = () => 'var(--color-fg-muted)'
    //     export const Fixture = <Button sx={getColors()}>Test</Button>
    //   `,
    //   output: `
    //     const getColors = () => 'fg.muted'
    //     export const Fixture = <Button sx={getColors()}>Test</Button>
    //   `,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-fg-muted) with fg.muted'
    //     }
    //   ]
    // }
  ]
})
