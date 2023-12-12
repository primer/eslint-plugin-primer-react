const deprecated = new Map([
  [
    // Entrypoint
    '@primer/react',
    // Imports
    [
      {
        name: 'SSRProvider',
        reason:
          'The SSRProvider component is no longer needed and will be removed in the next major release of @primer/react. For more information about this change, visit: https://gh.io/AAnz4j4',
      },
      {
        name: 'useSSRSafeId',
        reason:
          'The useSSRSafeId hook has been deprecated and will be removed in the next major release of @primer/react. Instead, use the [React.useId()](https://react.dev/reference/react/useId) hook. For more information about this change, visit: https://gh.io/AAnz4j4',
      },
    ],
  ],
])

/**
 * @param {string} entrypoint
 * @param {string} importSpecifier
 * @returns {string}
 */
function getDeprecatedMessage(entrypoint, importSpecifier) {
  if (!deprecated.has(entrypoint)) {
    throw new Error(`No deprecations found for entrypoint: ${entrypoint}`)
  }

  const deprecatedImports = deprecated.get(entrypoint)
  const deprecatedImport = deprecatedImports.find(deprecatedImport => {
    return deprecatedImport.name === importSpecifier
  })
  if (!deprecatedImport) {
    throw new Error(`No deprecations found for import specifier: ${importSpecifier}`)
  }

  return deprecatedImport.reason
}

module.exports = {
  deprecated,
  getDeprecatedMessage,
}
