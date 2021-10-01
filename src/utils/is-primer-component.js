const {isImportedFrom} = require('./is-imported-from')

function isPrimerComponent(identifier, scope) {
  return isImportedFrom(/^@primer\/components/, identifier, scope)
}
exports.isPrimerComponent = isPrimerComponent
