const rule = require('../no-deprecated-colors')
const {RuleTester} = require('eslint')

const testDeprecations = {
  'text.primary': 'fg.default',
  'bg.primary': 'canvas.default',
  'auto.green.5': ['success.fg', 'success.emphasis'],
  'fade.fg10': null
}

jest.mock('@primer/primitives/dist/deprecations/colors_v2', () => testDeprecations)

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
    `import {Box} from '@primer/components'; <Box color="fg.default">Hello</Box>`
  ],
  invalid: [
    {
      code: `import {Box} from '@primer/components'; function Example() { return <Box color="text.primary">Hello</Box> }`,
      output: `import {Box} from '@primer/components'; function Example() { return <Box color="fg.default">Hello</Box> }`,
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
      code: `import {Box} from '@primer/components'; const Example = () => <Box color="text.primary">Hello</Box>`,
      output: `import {Box} from '@primer/components'; const Example = () => <Box color="fg.default">Hello</Box>`,
      errors: [
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    },
    {
      code: `import {Box} from '@primer/components'; <Box bg="bg.primary" m={1} />`,
      output: `import {Box} from '@primer/components'; <Box bg="canvas.default" m={1} />`,
      errors: [
        {
          message: '"bg.primary" is deprecated. Use "canvas.default" instead.'
        }
      ]
    },
    {
      code: `import {Box} from '@primer/components'; <Box color="auto.green.5" />`,
      errors: [
        {
          message: '"auto.green.5" is deprecated.',
          suggestions: [
            {
              desc: 'Use "success.fg" instead.',
              output: `import {Box} from '@primer/components'; <Box color="success.fg" />`
            },
            {
              desc: 'Use "success.emphasis" instead.',
              output: `import {Box} from '@primer/components'; <Box color="success.emphasis" />`
            }
          ]
        }
      ]
    },
    {
      code: `import {Box} from '@primer/components'; <Box color="fade.fg10" />`,
      errors: [
        {
          message:
            '"fade.fg10" is deprecated. Go to https://primer.style/primitives or reach out in the #primer channel on Slack to find a suitable replacement.'
        }
      ]
    },
    {
      code: `import {Box, Text} from '@primer/components'; <Box bg="bg.primary"><Text color="text.primary">Hello</Text></Box>`,
      output: `import {Box, Text} from '@primer/components'; <Box bg="canvas.default"><Text color="fg.default">Hello</Text></Box>`,
      errors: [
        {
          message: '"bg.primary" is deprecated. Use "canvas.default" instead.'
        },
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    }
  ]
})
