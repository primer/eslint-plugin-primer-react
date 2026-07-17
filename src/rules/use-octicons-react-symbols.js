'use strict'

const {OCTICONS_REACT_PACKAGE, OCTICONS_REACT_SYMBOLS_PACKAGE} = require('../utils/octicon-symbols')
const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: `Import Octicon components from \`${OCTICONS_REACT_SYMBOLS_PACKAGE}\``,
      recommended: false,
      url: url(module),
    },
    fixable: 'code',
    schema: [],
    messages: {
      useOcticonsReactSymbols: `Import Octicon components from ${OCTICONS_REACT_SYMBOLS_PACKAGE} instead of ${OCTICONS_REACT_PACKAGE}.`,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== OCTICONS_REACT_PACKAGE || node.importKind === 'type') {
          return
        }

        const iconSpecifiers = node.specifiers.filter(specifier => {
          return (
            specifier.type === 'ImportSpecifier' &&
            specifier.importKind !== 'type' &&
            specifier.imported.name.endsWith('Icon')
          )
        })
        const namespaceSpecifier = node.specifiers.find(specifier => {
          return specifier.type === 'ImportNamespaceSpecifier'
        })

        if (iconSpecifiers.length === 0 && !namespaceSpecifier) {
          return
        }

        const movedSpecifiers = namespaceSpecifier ? [namespaceSpecifier] : iconSpecifiers
        const remainingSpecifiers = node.specifiers.filter(specifier => {
          return !movedSpecifiers.includes(specifier)
        })
        const canFixNamespaceImport = !namespaceSpecifier || remainingSpecifiers.length === 0

        context.report({
          node,
          messageId: 'useOcticonsReactSymbols',
          fix: canFixNamespaceImport
            ? fixer => {
                if (remainingSpecifiers.length === 0) {
                  return fixer.replaceText(node.source, `'${OCTICONS_REACT_SYMBOLS_PACKAGE}'`)
                }

                const remainingImport = renderImportDeclaration(
                  node,
                  remainingSpecifiers,
                  OCTICONS_REACT_PACKAGE,
                  sourceCode,
                )
                const symbolsImport = `import {${iconSpecifiers
                  .map(specifier => sourceCode.getText(specifier))
                  .join(', ')}} from '${OCTICONS_REACT_SYMBOLS_PACKAGE}'`

                return fixer.replaceText(node, `${remainingImport}\n${symbolsImport}`)
              }
            : null,
        })
      },
    }
  },
}

function renderImportDeclaration(node, specifiers, source, sourceCode) {
  const defaultSpecifier = specifiers.find(specifier => specifier.type === 'ImportDefaultSpecifier')
  const namespaceSpecifier = specifiers.find(specifier => specifier.type === 'ImportNamespaceSpecifier')
  const namedSpecifiers = specifiers.filter(specifier => specifier.type === 'ImportSpecifier')
  const clauses = []

  if (defaultSpecifier) {
    clauses.push(sourceCode.getText(defaultSpecifier))
  }
  if (namespaceSpecifier) {
    clauses.push(sourceCode.getText(namespaceSpecifier))
  }
  if (namedSpecifiers.length > 0) {
    clauses.push(`{${namedSpecifiers.map(specifier => sourceCode.getText(specifier)).join(', ')}}`)
  }

  const importKind = node.importKind === 'type' ? ' type' : ''
  return `import${importKind} ${clauses.join(', ')} from '${source}'`
}
