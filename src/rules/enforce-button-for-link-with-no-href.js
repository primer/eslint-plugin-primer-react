import url from '../url.js'
import {getJSXOpeningElementAttribute} from '../utils/get-jsx-opening-element-attribute.js'
import {getJSXOpeningElementName} from '../utils/get-jsx-opening-element-name.js'
import {isPrimerComponent} from '../utils/is-primer-component.js'

export default {
  meta: {
    type: 'error',
    docs: {
      description: 'Disallow usage of Link component without href',
      recommended: true,
      url: url(import.meta.url),
    },
    messages: {
      noLinkWithoutHref: 'Links without href and other side effects are not accessible. Use a Button instead.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    return {
      JSXElement(node) {
        const openingElement = node.openingElement
        const elementName = getJSXOpeningElementName(openingElement)

        // Check if this is a Link component from @primer/react
        if (elementName === 'Link' && isPrimerComponent(openingElement.name, sourceCode.getScope(node))) {
          // Check if the Link has an href attribute
          const hrefAttribute = getJSXOpeningElementAttribute(openingElement, 'href')

          if (!hrefAttribute) {
            context.report({
              node: openingElement,
              messageId: 'noLinkWithoutHref',
            })
          }
        }
      },
    }
  },
}
