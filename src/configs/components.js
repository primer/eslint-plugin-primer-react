const components = {
    Button: 'button',
    IconButton: 'button',
    Link: 'a',
    Spinner: 'svg',
    Octicon: 'svg',
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
}

const flattenComponents = (componentObj) => {
    let result = {};

    Object.keys(componentObj).forEach((key) => {
        if (typeof componentObj[key] === 'object') {
            const test = Object.keys(componentObj[key]).forEach((item) => {
                result = { ...result, [`${key}${item !== 'self' ? `.${item}` : ''}`]: componentObj[key][item] };        
            });
        } else {
            result = {...result, [key]: componentObj[key]}
        }
    });

    return result;
}


module.exports = flattenComponents(components);