const OCTICONS_REACT_PACKAGE = '@primer/octicons-react'
const OCTICONS_REACT_SYMBOLS_PACKAGE = '@primer/octicons-react-symbols'

function getConfiguredOcticonSymbols(context) {
  const configuredSymbols = context.settings?.['primer-react']?.octiconSymbols

  if (!Array.isArray(configuredSymbols)) {
    return null
  }

  const symbols = new Set()
  for (const symbol of configuredSymbols) {
    if (typeof symbol !== 'string' || !/^[A-Za-z_$][\w$]*Symbol$/.test(symbol)) {
      return null
    }
    symbols.add(symbol)
  }

  return symbols
}

function getSymbolName(iconName) {
  if (!iconName.endsWith('Icon')) {
    return null
  }

  return `${iconName.slice(0, -4)}Symbol`
}

module.exports = {
  OCTICONS_REACT_PACKAGE,
  OCTICONS_REACT_SYMBOLS_PACKAGE,
  getConfiguredOcticonSymbols,
  getSymbolName,
}
