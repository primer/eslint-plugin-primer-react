const {flattenComponents} = require('../utils/flatten-components')

const components = flattenComponents({
  Button: 'button',
  IconButton: 'button',
  ToggleSwitch: 'button',
  Radio: 'input',
  Checkbox: 'input',
  Text: 'span',
  TextInput: {
    Action: 'button',
    self: 'input',
  },
  Select: {
    Option: 'option',
    self: 'select',
  },
  TabNav: {
    self: 'nav',
  },
})

module.exports = components
