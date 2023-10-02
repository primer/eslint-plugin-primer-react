function flattenComponents(componentObj) {
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

exports.flattenComponents = flattenComponents
