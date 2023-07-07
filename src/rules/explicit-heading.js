const {isPrimerComponent} = require('../utils/is-primer-component')
const {getJSXOpeningElementName} = require('../utils/get-jsx-opening-element-name')
const {getJSXOpeningElementAttribute} = require('../utils/get-jsx-opening-element-attribute')

const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const isHeading = elem => getJSXOpeningElementName(elem) === 'Heading'
const isUsingAs = elem => {
    const asUsage = getJSXOpeningElementAttribute(elem, 'as');

    if (!asUsage) return;

    return asUsage.value;
}

const isValidAs = value => validHeadings.includes(value.toLowerCase());
const isInvalid = elem => {
    const elemAs = isUsingAs(elem);

    if (!elemAs) return 'nonExplicitHeadingLevel'; 
    if(!isValidAs(elemAs.value)) return 'invalidAsValue';

    return false;
}

module.exports = {
    meta: {
        type: "problem",
        schema: [
            {
              properties: {
                skipImportCheck: {
                  type: 'boolean'
                }
              }
            }
          ],
          messages: {
            nonExplicitHeadingLevel: "Heading must have an explicit heading level applied through `as` prop.",
            invalidAsValue: "Usage of `as` must only be used for headings (h1-h6)."
          }
    },
    create: function(context) {
        return {
            // callback functions
            JSXOpeningElement(jsxNode) {
                if (isPrimerComponent(jsxNode.name, context.getScope(jsxNode)) && isHeading(jsxNode)) {
                    const error = isInvalid(jsxNode);

                    if (error) {
                      context.report({
                        node: jsxNode,
                        messageId: error
                      })
                    }
                }
            }
        };
    }
};