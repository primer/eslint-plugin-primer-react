// Regex pattern to match margin/padding utility classes from Primer CSS
// Matches: m-{size}, mx-{size}, my-{size}, mt-{size}, mr-{size}, mb-{size}, ml-{size}
//          p-{size}, px-{size}, py-{size}, pt-{size}, pr-{size}, pb-{size}, pl-{size}
// Sizes: 0-12, n1-n12 (negative)
// Responsive variants: mx-sm-2, mx-md-4, etc. (breakpoint embedded in class name)
// Note: auto values (m-auto, mx-auto, etc.) are skipped - they don't need namespacing
const spacingUtilPattern = /^[mp][xytblr]?-(?:sm-|md-|lg-|xl-)?n?[0-9]+$/

// Check if a single class token is an unnamespaced spacing utility
const isUnNamespacedSpacingUtil = token => {
  return spacingUtilPattern.test(token)
}

// Process a class name string by tokenizing on whitespace
// Returns array of {original, replacement} for unnamespaced spacing utilities
const findUnNamespacedClasses = classNameStr => {
  const tokens = classNameStr.split(/\s+/).filter(Boolean)
  const matches = []

  for (const token of tokens) {
    if (isUnNamespacedSpacingUtil(token)) {
      matches.push({
        original: token,
        replacement: `pr-${token}`,
      })
    }
  }

  return matches
}

// Fix all unnamespaced spacing utilities in a class string by tokenizing
const fixClassNameStr = classNameStr => {
  // Split by whitespace while preserving the whitespace structure
  return classNameStr.replace(/\S+/g, token => {
    if (isUnNamespacedSpacingUtil(token)) {
      return `pr-${token}`
    }
    return token
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
    docs: {
      description: 'Enforce namespacing of Primer CSS spacing utility classes (margin/padding) with the `pr-` prefix.',
    },
    messages: {
      namespaceRequired: 'Primer CSS spacing utility class "{{className}}" should be namespaced as "{{replacement}}".',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    const reportUnNamespacedClasses = (classNameStr, valueNode, isTemplateLiteral = false) => {
      const unNamespacedClasses = findUnNamespacedClasses(classNameStr)

      if (unNamespacedClasses.length === 0) return

      // Report each unnamespaced class
      for (const {original, replacement} of unNamespacedClasses) {
        context.report({
          node: valueNode,
          messageId: 'namespaceRequired',
          data: {
            className: original,
            replacement,
          },
          fix(fixer) {
            // Get the raw text of the value node
            const rawText = sourceCode.getText(valueNode)

            // For string literals, fix the content inside the quotes
            // For template literals, fix the raw content (getText includes backticks)
            let fixedText
            if (isTemplateLiteral) {
              // Template element - getText returns content WITH backticks for simple template literals
              // We need to strip them, fix the content, and add them back
              if (rawText.startsWith('`') && rawText.endsWith('`')) {
                const content = rawText.slice(1, -1)
                fixedText = `\`${fixClassNameStr(content)}\``
              } else {
                // Raw template element text without backticks
                fixedText = fixClassNameStr(rawText)
              }
            } else {
              // String literal - preserve the quotes
              const quote = rawText[0]
              const content = rawText.slice(1, -1)
              fixedText = quote + fixClassNameStr(content) + quote
            }

            return fixer.replaceText(valueNode, fixedText)
          },
        })
      }
    }

    return {
      // Handle className="..." (string literal)
      'JSXAttribute[name.name="className"] Literal': function (node) {
        if (typeof node.value === 'string') {
          reportUnNamespacedClasses(node.value, node, false)
        }
      },
      // Handle className={`...`} (template literal)
      'JSXAttribute[name.name="className"] TemplateLiteral TemplateElement': function (node) {
        if (node.value && typeof node.value.raw === 'string') {
          reportUnNamespacedClasses(node.value.raw, node, true)
        }
      },
    }
  },
}
