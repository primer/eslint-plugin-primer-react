function getJSXOpeningElementAttribute(openingEl, name) {
  const attributes = openingEl.attributes
  const attribute = attributes.find(attribute => {
    // console.log('hey attribute', attribute)
    return attribute.name.name === name
  })

  return attribute
}

exports.getJSXOpeningElementAttribute = getJSXOpeningElementAttribute
