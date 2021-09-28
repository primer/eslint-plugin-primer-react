const styledSystemAttributes = ['width', 'height']

export default function(context) {
  return {
    JSXOpeningElement(node) {
      console.log(node.attributes)

      const systemAttributeNodes = node.attributes.filter(attribute => {
        return styledSystemAttributes.indexOf(attribute.name) !== -1
      })

      if (systemAttributeNodes.length !== 0) {
        context.report({
          node,
          message: `Styled-system attributes are deprecated (${attributes.map(a => a.name)})`,
        })

        // fix(fixer) {

        // }
      }
    }
  };
};
