'use strict'

const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getVariableDeclaration} = require('../utils/get-variable-declaration')
const {OCTICONS_REACT_SYMBOLS_PACKAGE, getConfiguredOcticonSymbols} = require('../utils/octicon-symbols')
const url = require('../url')

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require the configured Octicon SVG symbols in an app root',
      recommended: false,
      url: url(module),
    },
    fixable: 'code',
    schema: [],
    messages: {
      invalidConfiguration: 'Configure settings["primer-react"].octiconSymbols as an array of symbol component names.',
      missingOcticonSymbolsImport: `Import OcticonSymbols from ${OCTICONS_REACT_SYMBOLS_PACKAGE} in the configured app root.`,
      missingOcticonSymbols:
        'Render OcticonSymbols in the configured app root and place all configured symbol components inside it.',
      missingSymbolImport: `Import {{symbolNames}} from ${OCTICONS_REACT_SYMBOLS_PACKAGE}.`,
      missingSymbol: 'Render {{symbolNames}} inside OcticonSymbols.',
      unconfiguredSymbol:
        '{{symbolName}} is rendered inside OcticonSymbols but is not listed in settings["primer-react"].octiconSymbols.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const symbolSpecifiers = []
    const openingElements = []
    let octiconSymbolsSpecifier
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
          if (specifier.type !== 'ImportSpecifier' || specifier.importKind === 'type') {
            continue
          }

          if (specifier.imported.name === 'OcticonSymbols') {
            octiconSymbolsSpecifier = specifier
          } else if (specifier.imported.name.endsWith('Symbol')) {
            symbolSpecifiers.push(specifier)
          }
        }
      },
      JSXOpeningElement(node) {
        openingElements.push(node)
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

        if (!octiconSymbolsSpecifier) {
          context.report({
            node: program,
            messageId: 'missingOcticonSymbolsImport',
          })
          return
        }

        const octiconSymbolsElements = openingElements.filter(openingElement => {
          return isImportedJSXElement(openingElement, octiconSymbolsSpecifier, sourceCode)
        })

        if (octiconSymbolsElements.length === 0) {
          context.report({
            node: octiconSymbolsSpecifier,
            messageId: 'missingOcticonSymbols',
          })
          return
        }

        const missingSymbolImports = Array.from(configuredSymbols).filter(symbolName => {
          return !symbolSpecifiers.some(specifier => specifier.imported.name === symbolName)
        })
        if (missingSymbolImports.length > 0) {
          const importDeclaration = octiconSymbolsSpecifier.parent
          const lastSpecifier = importDeclaration.specifiers[importDeclaration.specifiers.length - 1]

          context.report({
            node: importDeclaration,
            messageId: 'missingSymbolImport',
            data: {
              symbolNames: missingSymbolImports.join(', '),
            },
            fix(fixer) {
              return fixer.insertTextAfter(lastSpecifier, `, ${missingSymbolImports.join(', ')}`)
            },
          })
        }

        const missingRenderedSymbols = []
        for (const symbolName of configuredSymbols) {
          const specifier = symbolSpecifiers.find(specifier => specifier.imported.name === symbolName)
          if (!specifier) {
            continue
          }
          const isRendered = openingElements.some(openingElement => {
            return (
              isImportedJSXElement(openingElement, specifier, sourceCode) &&
              isInsideOcticonSymbols(openingElement, octiconSymbolsSpecifier, sourceCode)
            )
          })
          if (!isRendered) {
            missingRenderedSymbols.push({
              specifier,
              hasJSXUsage: openingElements.some(openingElement => {
                return isImportedJSXElement(openingElement, specifier, sourceCode)
              }),
            })
          }
        }

        if (missingRenderedSymbols.length > 0) {
          const octiconSymbolsElement = octiconSymbolsElements[0].parent
          const safeSymbols = missingRenderedSymbols.filter(({specifier, hasJSXUsage}) => {
            return (
              !hasJSXUsage &&
              getVariableDeclaration(sourceCode.getScope(octiconSymbolsElement.openingElement), specifier.local)
                ?.node === specifier
            )
          })

          context.report({
            node: octiconSymbolsElement.openingElement,
            messageId: 'missingSymbol',
            data: {
              symbolNames: missingRenderedSymbols.map(({specifier}) => specifier.imported.name).join(', '),
            },
            fix:
              safeSymbols.length > 0
                ? fixer => {
                    return insertSymbolElements(
                      fixer,
                      sourceCode,
                      octiconSymbolsElement,
                      safeSymbols.map(({specifier}) => specifier.local.name),
                    )
                  }
                : null,
          })
        }

        for (const specifier of symbolSpecifiers) {
          const symbolName = specifier.imported.name
          if (configuredSymbols.has(symbolName)) {
            continue
          }

          const renderedElement = openingElements.find(openingElement => {
            return (
              isImportedJSXElement(openingElement, specifier, sourceCode) &&
              isInsideOcticonSymbols(openingElement, octiconSymbolsSpecifier, sourceCode)
            )
          })
          if (renderedElement) {
            context.report({
              node: renderedElement,
              messageId: 'unconfiguredSymbol',
              data: {
                symbolName,
              },
            })
          }
        }
      },
    }
  },
}

function insertSymbolElements(fixer, sourceCode, octiconSymbolsElement, symbolNames) {
  const {openingElement, closingElement} = octiconSymbolsElement
  const componentName = getJSXOpeningElementName(openingElement)
  const line = sourceCode.lines[openingElement.loc.start.line - 1]
  const indentation = /^\s*/.exec(line)[0]
  const childIndentation = `${indentation}  `
  const children = symbolNames.map(symbolName => `<${symbolName} />`).join(`\n${childIndentation}`)

  if (openingElement.selfClosing) {
    const openingText = sourceCode.getText(openingElement).replace(/\s*\/>$/, '>')
    return fixer.replaceText(
      octiconSymbolsElement,
      `${openingText}\n${childIndentation}${children}\n${indentation}</${componentName}>`,
    )
  }

  const previousToken = sourceCode.getTokenBefore(closingElement)
  const whitespaceRange = [previousToken.range[1], closingElement.range[0]]
  return fixer.replaceTextRange(whitespaceRange, `\n${childIndentation}${children}\n${indentation}`)
}

function isImportedJSXElement(openingElement, specifier, sourceCode) {
  const name = getJSXOpeningElementName(openingElement)
  if (name !== specifier.local.name) {
    return false
  }

  return getVariableDeclaration(sourceCode.getScope(openingElement), openingElement.name)?.node === specifier
}

function isInsideOcticonSymbols(openingElement, octiconSymbolsSpecifier, sourceCode) {
  let current = openingElement.parent

  while (current?.parent) {
    current = current.parent
    if (
      current.type === 'JSXElement' &&
      isImportedJSXElement(current.openingElement, octiconSymbolsSpecifier, sourceCode)
    ) {
      return true
    }
  }

  return false
}
