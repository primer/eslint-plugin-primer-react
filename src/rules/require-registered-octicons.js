'use strict'

const {OCTICONS_REACT_SYMBOLS_PACKAGE, getConfiguredOcticonSymbols, getSymbolName} = require('../utils/octicon-symbols')
const {getVariableDeclaration} = require('../utils/get-variable-declaration')
const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require used Octicon components to have a configured SVG symbol',
      recommended: false,
      url: url(module),
    },
    schema: [],
    messages: {
      invalidConfiguration: 'Configure settings["primer-react"].octiconSymbols as an array of symbol component names.',
      namedImportsOnly: `Use named imports from ${OCTICONS_REACT_SYMBOLS_PACKAGE} so Octicon symbol registration can be verified.`,
      unregisteredIcon:
        '{{iconName}} requires {{symbolName}} in settings["primer-react"].octiconSymbols and the app OcticonSymbols component.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const iconImports = []
    const namespaceImports = []
    const jsxUsages = new Set()
    let program

    return {
      Program(node) {
        program = node
      },
      ImportDeclaration(node) {
        if (node.source.value !== OCTICONS_REACT_SYMBOLS_PACKAGE || node.importKind === 'type') {
          return
        }

        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportNamespaceSpecifier') {
            namespaceImports.push({
              specifier,
              variable: sourceCode.getDeclaredVariables(specifier)[0],
            })
          } else if (
            specifier.type === 'ImportSpecifier' &&
            specifier.importKind !== 'type' &&
            getSymbolName(specifier.imported.name)
          ) {
            iconImports.push({
              specifier,
              variable: sourceCode.getDeclaredVariables(specifier)[0],
            })
          }
        }
      },
      JSXOpeningElement(node) {
        markJSXUsage(node.name, sourceCode.getScope(node), iconImports, namespaceImports, jsxUsages)
      },
      'Program:exit': function () {
        const configuredSymbols = getConfiguredOcticonSymbols(context)
        if (configuredSymbols === null) {
          context.report({
            node: program,
            messageId: 'invalidConfiguration',
          })
          return
        }

        for (const iconImport of namespaceImports) {
          if (isUsed(iconImport, jsxUsages)) {
            context.report({
              node: iconImport.specifier,
              messageId: 'namedImportsOnly',
            })
          }
        }

        for (const iconImport of iconImports) {
          if (!isUsed(iconImport, jsxUsages)) {
            continue
          }

          const {specifier} = iconImport
          const iconName = specifier.imported.name
          const symbolName = getSymbolName(iconName)
          if (!configuredSymbols.has(symbolName)) {
            context.report({
              node: specifier,
              messageId: 'unregisteredIcon',
              data: {
                iconName,
                symbolName,
              },
            })
          }
        }
      },
    }
  },
}

function markJSXUsage(name, scope, iconImports, namespaceImports, jsxUsages) {
  if (name.type === 'JSXIdentifier') {
    const iconImport = iconImports.find(iconImport => {
      return iconImport.specifier.local.name === name.name
    })
    if (iconImport && getVariableDeclaration(scope, name)?.node === iconImport.specifier) {
      jsxUsages.add(iconImport.specifier)
    }
    return
  }

  if (name.type === 'JSXMemberExpression') {
    let object = name.object
    while (object.type === 'JSXMemberExpression') {
      object = object.object
    }

    const namespaceImport = namespaceImports.find(iconImport => {
      return iconImport.specifier.local.name === object.name
    })
    if (namespaceImport && getVariableDeclaration(scope, object)?.node === namespaceImport.specifier) {
      jsxUsages.add(namespaceImport.specifier)
    }
  }
}

function isUsed(iconImport, jsxUsages) {
  return (
    jsxUsages.has(iconImport.specifier) ||
    iconImport.variable?.references.some(reference => {
      return reference.isTypeReference !== true && reference.identifier.parent.type !== 'TSTypeQuery'
    })
  )
}
