function isReactComponent(jsxNode) {
  if (jsxNode.name.type !== 'JSXIdentifier') return false

  // checking if it's not an html or custom element
  const firstLetter = jsxNode.name.name
  if (firstLetter === firstLetter.toLowerCase()) return false

  return true
}
exports.isReactComponent = isReactComponent
