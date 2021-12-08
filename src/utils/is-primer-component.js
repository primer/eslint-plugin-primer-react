const {isImportedFrom} = require('./is-imported-from')

function isPrimerComponent(identifier, scope) {
  return isImportedFrom(/^@primer\/react/, identifier, scope)
}
exports.isPrimerComponent = isPrimerComponent
