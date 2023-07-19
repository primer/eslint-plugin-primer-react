const flattenComponents = require('../utils/flatten-components');

const components = flattenComponents({
    Button: 'button',
    IconButton: 'button',
    Link: 'a',
    Spinner: 'svg',
    ToggleSwitch: 'button',
    Radio: 'input',
    TextInput: {
        Action: 'button',
        self: 'input',
    }, 
    Select: {
        Option: 'option', 
        self: 'select',
     },
    TabNav: {
        Link: 'a',
        self: 'nav',
    },
})

module.exports = components;