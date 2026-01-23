// Regex pattern to match margin/padding utility classes from Primer CSS
// Matches: m-{size}, mx-{size}, my-{size}, mt-{size}, mr-{size}, mb-{size}, ml-{size}
//          p-{size}, px-{size}, py-{size}, pt-{size}, pr-{size}, pb-{size}, pl-{size}
// Sizes: 0-12, auto, n1-n12 (negative), responsive variants like md:m-4
const spacingUtilPattern = /(?<!\S)(?:(?:sm|md|lg|xl):)?([mp][xytblr]?-(?:auto|n?[0-9]+))(?!\S)/g

// Process a class name string and find unnamespaced spacing utilities
const findUnNamespacedClasses = classNameStr => {
  const matches = []
  let match
  spacingUtilPattern.lastIndex = 0 // Reset regex state
  while ((match = spacingUtilPattern.exec(classNameStr)) !== null) {
    const fullMatch = match[0]
    // Check if it's already namespaced (has pr- prefix)
    // We need to check the position before the match for "pr-"
    const startIndex = match.index
    const prefix = classNameStr.slice(Math.max(0, startIndex - 3), startIndex)
    if (!prefix.endsWith('pr-')) {
      matches.push({
        original: fullMatch,
        replacement: fullMatch.includes(':') ? fullMatch.replace(/:([mp])/, ':pr-$1') : `pr-${fullMatch}`,
        index: startIndex,
      })
    }
  }
  return matches
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
    const reportUnNamespacedClasses = (node, classNameStr, valueNode) => {
      const unNamespacedClasses = findUnNamespacedClasses(classNameStr)

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
            const sourceCode = context.sourceCode
            const rawText = sourceCode.getText(valueNode)

            // Replace the unnamespaced class with the namespaced version
            const fixedText = rawText.replace(original, replacement)
            return fixer.replaceText(valueNode, fixedText)
          },
        })
      }
    }

    return {
      // Handle className="..." (string literal)
      'JSXAttribute[name.name="className"] Literal': function (node) {
        if (typeof node.value === 'string') {
          reportUnNamespacedClasses(node, node.value, node)
        }
      },
      // Handle className={`...`} (template literal)
      'JSXAttribute[name.name="className"] TemplateLiteral TemplateElement': function (node) {
        if (node.value && typeof node.value.raw === 'string') {
          reportUnNamespacedClasses(node, node.value.raw, node)
        }
      },
    }
  },
}
