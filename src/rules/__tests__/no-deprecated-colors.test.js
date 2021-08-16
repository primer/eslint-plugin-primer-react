const rule = require('../no-deprecated-colors')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester()

ruleTester.run('no-deprecated-colors', rule, {
  valid: [],
  invalid: [{code: 'hello()', errors: ['Hello ESLint']}]
})
