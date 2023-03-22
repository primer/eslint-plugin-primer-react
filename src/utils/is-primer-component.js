const {isImportedFrom} = require('./is-imported-from')

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

  return isImportedFrom(/^@primer\/react/, identifier, scope)
}
exports.isPrimerComponent = isPrimerComponent
