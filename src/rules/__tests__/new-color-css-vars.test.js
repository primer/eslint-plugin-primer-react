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
      code: `<circle style={{color: '#444'}} strokeWidth='2' />`,
    },
    {
      code: `<circle stroke='var(--borderColor-default)' strokeWidth='2' />`,
    },
    {
      code: `<circle fill='red' strokeWidth='2' />`,
    },
    {
      code: `<Blankslate border></Blankslate>`,
    },
    {
      code: `<div sx={{lineHeight: 1}}></div>`,
    },
    {
      name: 'variable with number',
      code: `
        const size = 2
        export const Fixture = <Button padding={size}>Test</Button>
      `,
    },
  ],
  invalid: [
    {
      name: 'attribute: simple variable',
      code: `<circle stroke='var(--color-border-default)' fill='var(--color-border-default)' strokeWidth='2' />`,
      output: `<circle stroke='var(--borderColor-default, var(--color-border-default))' fill='var(--borderColor-default, var(--color-border-default))' strokeWidth='2' />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
      ],
    },
    {
      name: 'attribute: conditional variable',
      code: `<circle stroke={test ? 'var(--color-border-default)' : 'red'} strokeWidth='2' />`,
      output: `<circle stroke={test ? 'var(--borderColor-default, var(--color-border-default))' : 'red'} strokeWidth='2' />`,
      errors: [
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
      ],
    },
    {
      name: 'sx: simple variable',
      code: `<Button sx={{color: 'var(--color-fg-muted)'}}>Test</Button>`,
      output: `<Button sx={{color: 'var(--fgColor-muted, var(--color-fg-muted))'}}>Test</Button>`,
      errors: [
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))',
        },
      ],
    },
    {
      name: 'style: simple variable',
      code: `<div style={{ border: 'var(--color-border-default)' }}></div>`,
      output: `<div style={{ border: 'var(--borderColor-default, var(--color-border-default))' }}></div>`,
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
            color: 'var(--fgColor-accent, var(--color-accent-fg))'
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
            color: 'var(--fgColor-accent, var(--color-accent-fg))'
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
      name: 'value variable in scope',
      code: `
        const bg = 'var(--color-canvas-subtle)'
        const sx = disabled ? {color: 'var(--color-primer-fg-disabled)'} : undefined
        export const Fixture = <Button bg={bg} sx={sx}>Test</Button>
      `,
      output: `
        const bg = 'var(--bgColor-muted, var(--color-canvas-subtle))'
        const sx = disabled ? {color: 'var(--fgColor-disabled, var(--color-primer-fg-disabled))'} : undefined
        export const Fixture = <Button bg={bg} sx={sx}>Test</Button>
      `,
      errors: [
        {
          message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted, var(--color-canvas-subtle))',
        },
        {
          message:
            'Replace var(--color-primer-fg-disabled) with var(--fgColor-disabled, var(--color-primer-fg-disabled))',
        },
      ],
    },
    {
      name: 'conditional with !important',
      code: `
        const extraSx = focused ? {backgroundColor: 'var(--color-canvas-subtle) !important'} : {}
      `,
      output: `
        const extraSx = focused ? {backgroundColor: 'var(--bgColor-muted, var(--color-canvas-subtle)) !important'} : {}
      `,
      errors: [
        {
          message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted, var(--color-canvas-subtle))',
        },
      ],
    },
    {
      name: 'variable object in scope',
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
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))',
        },
      ],
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
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))',
        },
      ],
    },
    {
      name: 'variable in styled.component',
      code: `
        import {sx, SxProp} from '@primer/react'
        export const HighlightToken = styled.span\`
          color: var(--color-accent-emphasis);
          background-color: var(--color-canvas-default);
          \${sx}
        \`
        const ClickableTokenSpan = styled(HighlightToken)\`
          &:hover, &:focus { background-color: accent.muted;}
        \`
      `,
      errors: [
        {
          message:
            'Replace var(--color-accent-emphasis) with var(--bgColor-accent-emphasis, var(--color-accent-emphasis))',
        },
        {
          message: 'Replace var(--color-canvas-default) with var(--bgColor-default, var(--color-canvas-default))',
        },
      ],
    },
    {
      name: 'variable in styled.component with conditional',
      code: `
        import {sx, SxProp} from '@primer/react'
        export const HighlightToken = styled.span\`
          color: \\\${danger ? var(--color-danger-emphasis) : var(--color-accent-emphasis)};
          \${sx}
        \`
        const ClickableTokenSpan = styled(HighlightToken)\`
          &:hover, &:focus { background-color: accent.muted;}
        \`
      `,
      errors: [
        {
          message:
            'Replace var(--color-danger-emphasis) with var(--bgColor-danger-emphasis, var(--color-danger-emphasis))',
        },
        {
          message:
            'Replace var(--color-accent-emphasis) with var(--bgColor-accent-emphasis, var(--color-accent-emphasis))',
        },
      ],
    },
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
                bg: 'var(--color-canvas-default)',
                borderLeft: '1px solid var(--color-border-default)',
                borderRight: '1px solid var(--color-border-default)',
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
                  ? 'inset 2px 0 0 var(--borderColor-neutral-emphasis, var(--color-fg-subtle))'
                  : 'inset 2px 0 0 var(--bgColor-attention-emphasis, var(--color-attention-fg))',
                color: 'var(--fgColor-default)',
                bg: 'var(--bgColor-default, var(--color-canvas-default))',
                borderLeft: '1px solid var(--borderColor-default, var(--color-border-default))',
                borderRight: '1px solid var(--borderColor-default, var(--color-border-default))',
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
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
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
                  ? 'inset 2px 0 0 var(--borderColor-neutral-emphasis, var(--color-fg-subtle))'
                  : 'inset 2px 0 0 var(--bgColor-attention-emphasis, var(--color-attention-fg))',
                color: 'var(--fgColor-default)',
                bg: 'var(--bgColor-default, var(--color-canvas-default))'
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
      name: 'typescript object with nested cssObject',
      code: `
        const Styles = {
          table: {
            width: '100%',
            lineHeight: '100%',
          },
          thead: {
            background: 'var(--color-canvas-subtle)',
            borderBottom: '1px solid',
            borderColor: 'var(--color-border-default)',
          },
        }
      `,
      output: `
        const Styles = {
          table: {
            width: '100%',
            lineHeight: '100%',
          },
          thead: {
            background: 'var(--bgColor-muted, var(--color-canvas-subtle))',
            borderBottom: '1px solid',
            borderColor: 'var(--borderColor-default, var(--color-border-default))',
          },
        }
      `,
      errors: [
        {
          message: 'Replace var(--color-canvas-subtle) with var(--bgColor-muted, var(--color-canvas-subtle))',
        },
        {
          message: 'Replace var(--color-border-default) with var(--borderColor-default, var(--color-border-default))',
        },
      ],
    },
    {
      name: 'inline sx',
      code: `<Box sx={{outline: '2px solid var(--color-accent-fg)'}}>Test</Box>`,
      output: `<Box sx={{outline: '2px solid var(--focus-outlineColor, var(--color-accent-fg))'}}>Test</Box>`,
      errors: [
        {
          message: 'Replace var(--color-accent-fg) with var(--focus-outlineColor, var(--color-accent-fg))',
        },
      ],
    },
    {
      name: 'inline sx with nesting',
      code: `
        <Box sx={{
          color: 'var(--color-fg-subtle)',
          '&:hover': {
            color: 'var(--color-accent-fg)',
          }
        }}>Test</Box>
      `,
      output: `
        <Box sx={{
          color: 'var(--fgColor-muted, var(--color-fg-subtle))',
          '&:hover': {
            color: 'var(--fgColor-accent, var(--color-accent-fg))',
          }
        }}>Test</Box>
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-subtle) with var(--fgColor-muted, var(--color-fg-subtle))',
        },
        {
          message: 'Replace var(--color-accent-fg) with var(--fgColor-accent, var(--color-accent-fg))',
        },
      ],
    },
    {
      name: 'inside return statement',
      code: `
      const fn = () => {
        const th = {
          padding: '8px 12px',
        }

        return {
          button: {
            border: 0,
            padding: 0,
            background: 'transparent',
            color: isSelected ? 'var(--color-fg-default)' : 'var(--color-fg-muted)',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            gap: '8px',
            flexDirection: isRightAligned ? 'row-reverse' : 'row',
            justifyContent: 'flex-start',
          },
          th,
        }
      }
      `,
      output: `
      const fn = () => {
        const th = {
          padding: '8px 12px',
        }

        return {
          button: {
            border: 0,
            padding: 0,
            background: 'transparent',
            color: isSelected ? 'var(--fgColor-default, var(--color-fg-default))' : 'var(--fgColor-muted, var(--color-fg-muted))',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            gap: '8px',
            flexDirection: isRightAligned ? 'row-reverse' : 'row',
            justifyContent: 'flex-start',
          },
          th,
        }
      }
      `,
      errors: [
        {
          message: 'Replace var(--color-fg-default) with var(--fgColor-default, var(--color-fg-default))',
        },
        {
          message: 'Replace var(--color-fg-muted) with var(--fgColor-muted, var(--color-fg-muted))',
        },
      ],
    },
  ],
})
