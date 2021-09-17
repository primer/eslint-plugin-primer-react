const rule = require('../no-deprecated-colors')
const {RuleTester} = require('eslint')

const testDeprecations = {
  'text.primary': 'fg.default',
  'bg.primary': 'canvas.default',
  'auto.green.5': ['success.fg', 'success.emphasis'],
  'fade.fg10': null,
  'autocomplete.shadow': 'shadow.medium'
}

jest.mock('@primer/primitives/dist/deprecations/colors', () => testDeprecations)

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

ruleTester.run('no-deprecated-colors', rule, {
  valid: [
    `import {Box} from '@other/design-system'; <Box color="text.primary">Hello</Box>`,
    `import {Box} from "@primer/components"; <Box color="fg.default">Hello</Box>`,
    `import {hello} from "@primer/components"; hello("colors.text.primary")`,
    `import {themeGet} from "@primer/components"; themeGet("space.text.primary")`,
    `import {themeGet} from "@other/design-system"; themeGet("colors.text.primary")`,
    `import {get} from "@other/constants"; get("space.text.primary")`,
    `import {Box} from '@primer/components'; <Box sx={styles}>Hello</Box>`,
    `import {Box} from '@primer/components'; <Box sx={{color: text.primary}}>Hello</Box>`,
    `import {Box} from '@primer/components'; <Box sx={{color: "fg.default"}}>Hello</Box>`
  ],
  invalid: [
    {
      code: `import {Box} from "@primer/components"; function Example() { return <Box color="text.primary">Hello</Box> }`,
      output: `import {Box} from "@primer/components"; function Example() { return <Box color="fg.default">Hello</Box> }`,
      errors: [
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    },
    {
      code: `import {Box} from "../components"; function Example() { return <Box color="text.primary">Hello</Box> }`,
      output: `import {Box} from "../components"; function Example() { return <Box color="fg.default">Hello</Box> }`,
      options: [{checkImport: false}],
      errors: [
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    },
    {
      code: `import Box from '@primer/components/lib-esm/Box'; function Example() { return <Box color="text.primary">Hello</Box> }`,
      output: `import Box from '@primer/components/lib-esm/Box'; function Example() { return <Box color="fg.default">Hello</Box> }`,
      errors: [
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    },
    {
      code: `import {Box} from "@primer/components"; const Example = () => <Box color="text.primary">Hello</Box>`,
      output: `import {Box} from "@primer/components"; const Example = () => <Box color="fg.default">Hello</Box>`,
      errors: [
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    },
    {
      code: `import {Box} from "@primer/components"; <Box bg="bg.primary" m={1} />`,
      output: `import {Box} from "@primer/components"; <Box bg="canvas.default" m={1} />`,
      errors: [
        {
          message: '"bg.primary" is deprecated. Use "canvas.default" instead.'
        }
      ]
    },
    {
      code: `import {Box} from "@primer/components"; <Box sx={{bg: "bg.primary", m: 1, ...rest}} />`,
      output: `import {Box} from "@primer/components"; <Box sx={{bg: "canvas.default", m: 1, ...rest}} />`,
      errors: [
        {
          message: '"bg.primary" is deprecated. Use "canvas.default" instead.'
        }
      ]
    },
    {
      code: `import {Box} from "@primer/components"; <Box color="auto.green.5" />`,
      errors: [
        {
          message: '"auto.green.5" is deprecated.',
          suggestions: [
            {
              desc: 'Use "success.fg" instead.',
              output: `import {Box} from "@primer/components"; <Box color="success.fg" />`
            },
            {
              desc: 'Use "success.emphasis" instead.',
              output: `import {Box} from "@primer/components"; <Box color="success.emphasis" />`
            }
          ]
        }
      ]
    },
    {
      code: `import {Box} from "@primer/components"; <Box color="fade.fg10" />`,
      errors: [
        {
          message:
            '"fade.fg10" is deprecated. Go to https://primer.style/primitives or reach out in the #primer channel on Slack to find a suitable replacement.'
        }
      ]
    },
    {
      code: `import {Box, Text} from "@primer/components"; <Box bg="bg.primary"><Text color="text.primary">Hello</Text></Box>`,
      output: `import {Box, Text} from "@primer/components"; <Box bg="canvas.default"><Text color="fg.default">Hello</Text></Box>`,
      errors: [
        {
          message: '"bg.primary" is deprecated. Use "canvas.default" instead.'
        },
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    },
    {
      code: `import {themeGet} from "@primer/components"; themeGet("colors.text.primary")`,
      output: `import {themeGet} from "@primer/components"; themeGet("colors.fg.default")`,
      errors: [
        {
          message: '"colors.text.primary" is deprecated. Use "colors.fg.default" instead.'
        }
      ]
    },
    {
      code: `import {themeGet} from "@primer/components"; themeGet("shadows.autocomplete.shadow")`,
      output: `import {themeGet} from "@primer/components"; themeGet("shadows.shadow.medium")`,
      errors: [
        {
          message: '"shadows.autocomplete.shadow" is deprecated. Use "shadows.shadow.medium" instead.'
        }
      ]
    },
    {
      code: `import {get} from "./constants"; get("colors.text.primary")`,
      output: `import {get} from "./constants"; get("colors.fg.default")`,
      errors: [
        {
          message: '"colors.text.primary" is deprecated. Use "colors.fg.default" instead.'
        }
      ]
    },
    {
      code: `import {get} from "../constants"; get("colors.text.primary")`,
      output: `import {get} from "../constants"; get("colors.fg.default")`,
      errors: [
        {
          message: '"colors.text.primary" is deprecated. Use "colors.fg.default" instead.'
        }
      ]
    }
  ]
})
