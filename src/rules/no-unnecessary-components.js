// @ts-check

const {ESLintUtils} = require('@typescript-eslint/utils')
const {IndexKind} = require('typescript')
const {pick: pickStyledSystemProps} = require('@styled-system/props')

/** @typedef {import('@typescript-eslint/types').TSESTree.JSXAttribute} JSXAttribute */

const components = {
  Box: {
    replacement: 'div',
    messageId: 'unecessaryBox',
    message: 'Prefer plain HTML elements over `Box` when not using `sx` for styling.',
  },
  Text: {
    replacement: 'span',
    messageId: 'unecessarySpan',
    message: 'Prefer plain HTML elements over `Text` when not using `sx` for styling.',
  },
}

const elementNameRegex = /^[a-z]\w*$/
const componentNameRegex = /^[A-Z][\w._]*$/

/** @param {string} propName */
const isStyledSystemProp = propName => propName in pickStyledSystemProps({[propName]: propName})

const rule = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description:
        '`Box` and `Text` should only be used to provide access to the `sx` styling system and have a performance cost. If `sx` props are not being used, prefer `div` and `span` instead.',
    },
    messages: {
      [components.Box.messageId]: components.Box.message,
      [components.Text.messageId]: components.Text.message,
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    /**
     * Cache components that we've verified are imported from @primer/react in this file, to save a bit of time
     * @type {Map<string, boolean>}
     */
    const validatedComponents = new Map()

    return {
      JSXElement(node) {
        const {
          openingElement: {name, attributes},
          closingElement,
        } = node

        // Ensure this is one of the components we are looking for. Note this doesn't account for import aliases; this
        // is intentional to avoid having to do the scope tree traversal for every component of every name, which would
        // be needlessly expensive. We just ignore aliased imports.
        if (name.type !== 'JSXIdentifier' || !(name.name in components)) return
        const componentConfig = components[/** @type {keyof typeof components} */ (name.name)]

        // Only continue if the variable declaration is an import from @primer/react. Otherwise it could, for example,
        // be an import from @primer/brand, which would be valid without sx.
        let isImportedFromPrimer = validatedComponents.get(name.name)
        if (isImportedFromPrimer === undefined) {
          // Find the variable declaration for this component
          let variable
          /** @type {import('@typescript-eslint/utils/ts-eslint').Scope.Scope | undefined} */
          let scope = context.sourceCode.getScope(name)
          while (scope && !variable) {
            variable = scope.variables.find(v => v.name === name.name)
            scope = scope.upper ?? undefined
          }

          isImportedFromPrimer =
            variable?.defs.some(
              def =>
                def.type === 'ImportBinding' &&
                def.parent.type === 'ImportDeclaration' &&
                def.parent.source.value === '@primer/react',
            ) ?? false

          validatedComponents.set(name.name, isImportedFromPrimer)
        }
        if (!isImportedFromPrimer) return

        // Validate the attributes and ensure an `sx` prop is present or spreaded in
        /** @type {typeof attributes[number] | undefined | null} */
        let asProp = undefined
        for (const attribute of attributes) {
          // If there is a spread type, check if the type of the spreaded value has an `sx` property
          if (attribute.type === 'JSXSpreadAttribute') {
            const services = ESLintUtils.getParserServices(context)
            const typeChecker = services.program.getTypeChecker()

            const spreadType = services.getTypeAtLocation(attribute.argument)
            if (typeChecker.getPropertyOfType(spreadType, 'sx') !== undefined) return

            // Check if the spread type has a string index signature - this could hide an `sx` property
            if (typeChecker.getIndexTypeOfType(spreadType, IndexKind.String) !== undefined) return

            // If there is an `as` inside the spread object, we can't autofix reliably
            if (typeChecker.getPropertyOfType(spreadType, 'as') !== undefined) asProp = null

            continue
          }

          // Has sx prop, so should keep using this component
          if (
            attribute.name.type === 'JSXIdentifier' &&
            (attribute.name.name === 'sx' || isStyledSystemProp(attribute.name.name))
          )
            return

          // If there is an `as` prop we will need to account for that when autofixing
          if (attribute.name.type === 'JSXIdentifier' && attribute.name.name === 'as') asProp = attribute
        }

        // Determine a replacement component name accounting for the `as` prop if present
        /** @type {string | null} */
        let replacement = componentConfig.replacement
        if (asProp === null) {
          // {...{as: 'something-unusable'}}
          replacement = null
        } else if (asProp?.type === 'JSXAttribute') {
          // as={ComponentReference}
          if (asProp.value?.type === 'JSXExpressionContainer' && asProp.value.expression.type === 'Identifier') {
            // can't just use expression.name here because we want the whole expression if it's A.B
            const expressionStr = context.sourceCode.getText(asProp.value.expression)
            replacement = componentNameRegex.test(expressionStr) ? expressionStr : null
          }
          // as={'tagName'} (surprisingly common, we really should enable `react/jsx-curly-brace-presence`)
          else if (
            asProp.value?.type === 'JSXExpressionContainer' &&
            asProp.value.expression.type === 'Literal' &&
            typeof asProp.value.expression.value === 'string' &&
            elementNameRegex.test(asProp.value.expression.value)
          ) {
            replacement = asProp.value.expression.value
          }
          // as="tagName"
          else if (
            asProp.value?.type === 'Literal' &&
            typeof asProp.value.value === 'string' &&
            elementNameRegex.test(asProp.value.value)
          ) {
            replacement = asProp.value.value
          }
          // too complex to autofix
          else {
            replacement = null
          }
        }

        context.report({
          node: name,
          messageId: componentConfig.messageId,
          fix: replacement
            ? function* (fixer) {
                yield fixer.replaceText(name, replacement)
                if (closingElement) yield fixer.replaceText(closingElement.name, replacement)
                if (asProp) yield fixer.remove(asProp)
              }
            : undefined,
        })
      },
    }
  },
})

module.exports = {...rule, components}
