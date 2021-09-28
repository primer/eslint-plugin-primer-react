const {isImportedFrom} = require('./isImportedFrom')

function isPrimerComponent(identifier, scope) {
  return isImportedFrom(/^@primer\/components/, identifier, scope)
}
exports.isPrimerComponent = isPrimerComponent
