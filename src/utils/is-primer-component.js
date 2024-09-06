const {isImportedFrom} = require('./is-imported-from')

/**
 * Check if `name` is a JSX component that is imported from `@primer/react` or
 * a subpath `@primer/react/*`.
 * @returns {boolean}
 */
function isPrimerComponent(name, scope) {
  let identifier

  switch (name.type) {
    case 'JSXIdentifier':
      identifier = name
      break
    case 'JSXMemberExpression':
      identifier = name.object
      break
    default:
      return false
  }
  return isImportedFrom(/^@primer\/react(?:$|\/)/, identifier, scope)
}
exports.isPrimerComponent = isPrimerComponent
