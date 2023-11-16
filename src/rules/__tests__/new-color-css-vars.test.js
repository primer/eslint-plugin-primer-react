const rule = require('../new-color-css-vars')
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

ruleTester.run('no-color-css-vars', rule, {
  valid: [
    {
      code: `{color: 'fg.default'}`,
    },
    {
      code: `<circle style={{color: '#444'}} strokeWidth="2" />`,
    },
    {
      code: `<circle stroke="var(--borderColor-default)" strokeWidth="2" />`,
    },
    {
      code: `<circle fill="red" strokeWidth="2" />`,
    },
    {
      code: `<Blankslate border></Blankslate>`,
    },
    {
      code: `<div sx={{lineHeight: 1}}></div>`,
    },
  ],
  invalid: [
    {
      name: 'attribute: simple variable',
      code: `<circle stroke="var(--color-border-default)" strokeWidth="2" />`,
      output: `<circle stroke="var(--borderColor-default, var(--color-border-default))" strokeWidth="2" />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
      ],
    },
    {
      name: 'attribute: conditional variable',
      code: `<circle stroke={test ? "var(--color-border-default)" : "red"} strokeWidth="2" />`,
      output: `<circle stroke={test ? "var(--borderColor-default, var(--color-border-default))" : "red"} strokeWidth="2" />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
      ],
    },
    {
      name: 'sx: simple variable',
      code: `<Button sx={{color: 'var(--color-fg-muted)'}}>Test</Button>`,
      output: `<Button sx={{color: "var(--fgColor-muted, var(--color-fg-muted))"}}>Test</Button>`,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))',
        },
      ],
    },
    {
      name: 'style: simple variable',
      code: `<div style={{ border: 'var(--color-border-default)' }}></div>`,
      output: `<div style={{ border: "var(--borderColor-default, var(--color-border-default))" }}></div>`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
      ],
    },
    {
      name: 'sx: nested variable',
      code: `
        <Box sx={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: 'var(--color-accent-fg)'
          }
        }}>
        </Box>`,
      output: `
        <Box sx={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: "var(--fgColor-accent, var(--color-accent-fg))"
          }
        }}>
        </Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent, var(--color-accent-fg))',
        },
      ],
    },
    {
      name: 'style: nested variable',
      code: `
        <Box style={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: 'var(--color-accent-fg)'
          }
        }}>
        </Box>`,
      output: `
        <Box style={{
          '&:hover button, &:focus [data-component="copy-link"] button': {
            color: "var(--fgColor-accent, var(--color-accent-fg))"
          }
        }}>
        </Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent, var(--color-accent-fg))',
        },
      ],
    },
    // {
    //   code: `<Box sx={{boxShadow: '0 0 0 2px var(--color-canvas-subtle)'}} />`,
    //   output: `<Box sx={{boxShadow: '0 0 0 2px var(--bgColor-muted, var(--color-canvas-subtle))'}} />`,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted, var(--color-canvas-subtle))'
    //     }
    //   ]
    // },
    // {
    //   code: `<Box sx={{border: 'solid 2px var(--color-border-default)'}} />`,
    //   output: `<Box sx={{border: 'solid 2px var(--borderColor-default, var(--color-border-default))'}} />`,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))'
    //     }
    //   ]
    // },
    // {
    //   code: `<Box sx={{backgroundColor: 'var(--color-canvas-default)'}} />`,
    //   output: `<Box sx={{backgroundColor: 'var(--bgColor-default, var(--color-canvas-default))'}} />`,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-canvas-default) with var(--bgColor-default, var(--color-canvas-default))'
    //     }
    //   ]
    // },
    // {
    //   name: 'variable in scope',
    //   code: `
    //     const baseStyles = { color: 'var(--color-fg-muted)' }
    //     export const Fixture = <Button sx={baseStyles}>Test</Button>
    //   `,
    //   output: `
    //     const baseStyles = { color: 'var(--fgColor-muted, var(--color-fg-muted))' }
    //     export const Fixture = <Button sx={baseStyles}>Test</Button>
    //   `,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))'
    //     }
    //   ]
    // },
    // {
    //   name: 'merge in sx',
    //   code: `
    //     import {merge} from '@primer/react'
    //     export const Fixture = props => <Button sx={merge({color: 'var(--color-fg-muted)'}, props.sx)}>Test</Button>
    //   `,
    //   output: `
    //     import {merge} from '@primer/react'
    //     export const Fixture = props => <Button sx={merge({color: 'var(--fgColor-muted, var(--color-fg-muted))'}, props.sx)}>Test</Button>
    //   `,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))'
    //     }
    //   ]
    // },
    // {
    //   code: `<Box sx={{borderColor: 'var(--color-border-default)'}} />`,
    //   output: `<Box sx={{borderColor: 'var(--borderColor-default, var(--color-border-default))'}} />`,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))'
    //     }
    //   ]
    // },
    // {
    //   name: 'variable in styled.component',
    //   code: `
    //     import {sx, SxProp} from '@primer/react'
    //     export const HighlightToken = styled.span\`
    //       color: var(--color-accent-emphasis);
    //       \${sx}
    //     \`
    //     const ClickableTokenSpan = styled(HighlightToken)\`
    //       &:hover, &:focus { background-color: accent.muted;}
    //     \`
    //   `,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-accent-emphasis) with var(--fgColor-accent, var(--color-accent-emphasis))',
    //     },
    //   ],
    // },
    {
      name: 'sx: conditional variable',
      code: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              sx={{
                boxShadow: subtle
                  ? 'inset 2px 0 0 var(--color-fg-subtle)'
                  : 'inset 2px 0 0 var(--color-attention-fg)',
                color: 'var(--fgColor-default)',
                bg: 'var(--color-canvas-default)'
              }}
            />
          )
        }
      `,
      output: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              sx={{
                boxShadow: subtle
                  ? "inset 2px 0 0 var(--borderColor-neutral-emphasis, var(--color-fg-subtle))"
                  : "inset 2px 0 0 var(--bgColor-attention-emphasis, var(--color-attention-fg))",
                color: 'var(--fgColor-default)',
                bg: "var(--bgColor-default, var(--color-canvas-default))"
              }}
            />
          )
        }
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-subtle) with var(--borderColor-neutral-emphasis, var(--color-fg-subtle))',
        },
        {
          message:
            'Replace var(--color-attention-fg) with var(--bgColor-attention-emphasis, var(--color-attention-fg))',
        },
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default, var(--color-canvas-default))',
        },
      ],
    },
    {
      name: 'style: conditional variable',
      code: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              style={{
                boxShadow: subtle
                  ? 'inset 2px 0 0 var(--color-fg-subtle)'
                  : 'inset 2px 0 0 var(--color-attention-fg)',
                color: 'var(--fgColor-default)',
                bg: 'var(--color-canvas-default)'
              }}
            />
          )
        }
      `,
      output: `
        import {Box} from '@primer/react'

        function someComponent({subtle}) {
          return (
            <Box
              style={{
                boxShadow: subtle
                  ? "inset 2px 0 0 var(--borderColor-neutral-emphasis, var(--color-fg-subtle))"
                  : "inset 2px 0 0 var(--bgColor-attention-emphasis, var(--color-attention-fg))",
                color: 'var(--fgColor-default)',
                bg: "var(--bgColor-default, var(--color-canvas-default))"
              }}
            />
          )
        }
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-subtle) with var(--borderColor-neutral-emphasis, var(--color-fg-subtle))',
        },
        {
          message:
            'Replace var(--color-attention-fg) with var(--bgColor-attention-emphasis, var(--color-attention-fg))',
        },
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default, var(--color-canvas-default))',
        },
      ],
    },
    // {
    //   code: `<Box sx={{outline: '2px solid var(--color-accent-fg)'}}>Test</Box>`,
    //   // output: `<Box sx={{outline: '2px solid var(--fgColor-accent, var(--borderColor-accent-emphasis, var(--focus-outlineColor, var(--color-accent-fg))))'}}>Test</Box>`,
    //   output: `<Box sx={{outline: '2px solid var(--focus-outlineColor, var(--color-accent-fg))'}}>Test</Box>`,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-accent-fg) with var(--focus-outlineColor, var(--color-accent-fg))'
    //     }
    //   ]
    // },
    // {
    //   code: `
    //     <Box sx={{
    //       color: 'var(--color-fg-subtle)',
    //       '&:hover': {
    //         color: 'var(--color-accent-fg)',
    //       }
    //     }}>Test</Box>
    //   `,
    //   // output: `
    //   //   <Box sx={{
    //   //     color: 'var(--fgColor-muted, var(--color-fg-subtle))',
    //   //     '&:hover': {
    //   //       color: 'var(--fgColor-accent, var(--color-accent-fg))',
    //   //   }}>Test</Box>
    //   // `,
    //   output: `
    //     <Box sx={{
    //       color: 'var(--fgColor-muted, var(--color-fg-subtle))',
    //       '&:hover': {
    //         color: 'var(--fgColor-accent, var(--borderColor-accent-emphasis, var(--bgColor-accent-emphasis, var(--color-accent-fg))))',
    //       }
    //     }}>Test</Box>
    //   `,
    //   errors: [
    //     {
    //       message: 'Replace var(--color-accent-fg) with var(--focus-outlineColor, var(--color-accent-fg))'
    //     }
    //   ]
    // }
  ],
})
