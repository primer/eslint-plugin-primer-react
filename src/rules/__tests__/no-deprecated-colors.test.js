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
    ecmaFeatures: {
      jsx: true
    }
  }
})

ruleTester.run('no-deprecated-colors', rule, {
  valid: [],
  invalid: [
    {
      code: '<Box color="text.primary" />',
      output: '<Box color="fg.default" />',
      errors: [
        {
          message: '"text.primary" is deprecated. Use "fg.default" instead.'
        }
      ]
    },
    {
      code: '<Box bg="bg.primary" />',
      output: '<Box bg="canvas.default" />',
      errors: [
        {
          message: '"bg.primary" is deprecated. Use "canvas.default" instead.'
        }
      ]
    },
    {
      code: '<Box color="auto.green.5" />',
      errors: [
        {
          message: '"auto.green.5" is deprecated.',
          suggestions: [
            {
              desc: 'Use "success.fg" instead.',
              output: '<Box color="success.fg" />'
            },
            {
              desc: 'Use "success.emphasis" instead.',
              output: '<Box color="success.emphasis" />'
            }
          ]
        }
      ]
    },
    {
      code: '<Box color="fade.fg10" />',
      errors: [
        {
          message:
            '"fade.fg10" is deprecated. See https://primer.style/primitives or reach out in the #primer Slack channel to find a suitable replacement.'
        }
      ]
    }
  ]
})
