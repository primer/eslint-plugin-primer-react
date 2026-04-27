import url from '../url.js'
import {isPrimerComponent} from '../utils/is-primer-component.js'
import {getJSXOpeningElementName} from '../utils/get-jsx-opening-element-name.js'
import {getJSXOpeningElementAttribute} from '../utils/get-jsx-opening-element-attribute.js'

const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

const isHeadingComponent = elem => getJSXOpeningElementName(elem) === 'Heading'
const isUsingAsProp = elem => {
  const componentAs = getJSXOpeningElementAttribute(elem, 'as')

  if (!componentAs) return

  return componentAs.value
}

const isValidAsUsage = value => validHeadings.includes(value.toLowerCase())
const isInvalid = elem => {
  if (elem.attributes.length === 1 && elem.attributes[0].type === 'JSXSpreadAttribute') return

  const elemAs = isUsingAsProp(elem)

  if (!elemAs) return 'nonExplicitHeadingLevel'
  if (elemAs.value && !isValidAsUsage(elemAs.value)) return 'invalidAsValue'

  return false
}

export default {
  meta: {
    docs: {
      description: 'Heading component must have explicit heading level, and specific `as` usage.',
      url: url(import.meta.url),
    },
    schema: [
      {
        properties: {
          skipImportCheck: {
            type: 'boolean',
          },
        },
      },
    ],
    messages: {
      nonExplicitHeadingLevel: 'Heading must have an explicit heading level applied through the `as` prop.',
      invalidAsValue: 'Usage of `as` must only be used for heading elements (h1-h6).',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXOpeningElement(jsxNode) {
        const skipImportCheck = context.options[0] ? context.options[0].skipImportCheck : false

        if (
          (skipImportCheck || isPrimerComponent(jsxNode.name, sourceCode.getScope(jsxNode))) &&
          isHeadingComponent(jsxNode)
        ) {
          const error = isInvalid(jsxNode)

          if (error) {
            context.report({
              node: jsxNode,
              messageId: error,
            })
          }
        }
      },
    }
  },
}
