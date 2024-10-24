function importBindingIsFromCSSModuleImport(node) {
  return node.type === 'ImportBinding' && node.parent?.source?.value?.endsWith('.module.css')
}

function identifierIsCSSModuleBinding(node, context) {
  if (node.type !== 'Identifier') return false
  const ref = context.getScope().references.find(reference => reference.identifier.name === node.name)
  if (ref.resolved?.defs?.some(importBindingIsFromCSSModuleImport)) {
    return true
  }
  return false
}

exports.importBindingIsFromCSSModuleImport = importBindingIsFromCSSModuleImport
exports.identifierIsCSSModuleBinding = identifierIsCSSModuleBinding
