'use strict'
const {getVariableDeclaration} = require('../utils/get-variable-declaration')
const url = require('../url')

const textInputProps = {
  icon: 'Use `leadingVisual` or `trailingVisual` instead.',
  contrast: 'Omit this prop to use the default background.',
  variant: 'Use `size` instead.',
  width: 'Set `width` using CSS or `style` instead.',
  minWidth: 'Set `min-width` using CSS or `style` instead.',
  maxWidth: 'Set `max-width` using CSS or `style` instead.',
}
const buttonProps = {
  leadingIcon: 'Use `leadingVisual` instead.',
  trailingIcon: 'Use `trailingVisual` instead.',
}
const narrowDivider = 'Use `divider` with a responsive value instead.'
const deprecations = {
  'ActionList.Group': {title: 'Use `ActionList.GroupHeading` instead.'},
  'ActionList.Item': {as: 'Use `ActionList.LinkItem` for links; `as` has no effect on `ActionList.Item`.'},
  'ActionMenu.Button': buttonProps,
  'Autocomplete.Input': {
    ...textInputProps,
    openOnFocus: 'Remove this prop. Review whether opening the menu on focus is still needed.',
  },
  'Autocomplete.Overlay': {overlayProps: 'Pass overlay props directly to `Autocomplete.Overlay` instead.'},
  Banner: {icon: 'Use `leadingVisual` instead.'},
  Button: buttonProps,
  CounterLabel: {scheme: 'Use `variant` instead.'},
  IconButton: {keyshortcuts: 'Use `keybindingHint` instead.'},
  Link: {hoverColor: 'Style hover color using CSS instead.'},
  LinkButton: buttonProps,
  'PageLayout.Header': {dividerWhenNarrow: narrowDivider},
  'PageLayout.Pane': {
    dividerWhenNarrow: narrowDivider,
    positionWhenNarrow: 'Use `position` with a responsive value instead.',
  },
  'PageLayout.Footer': {dividerWhenNarrow: narrowDivider},
  'SegmentedControl.Button': {
    icon: 'Use `leadingVisual` instead.',
    leadingIcon: 'Use `leadingVisual` instead.',
  },
  SelectPanel: {footer: 'Use `secondaryAction` instead.'},
  Spinner: {'aria-label': 'Use `srText` instead.'},
  StateLabel: {variant: 'Use `size` with `small` or `medium` instead.'},
  TextInput: textInputProps,
  'TextInput.Action': {
    children: 'Use an icon-only action with the `icon` prop instead.',
    variant: 'Omit this prop to use the invisible button variant.',
  },
  TextInputWithTokens: textInputProps,
  Textarea: {contrast: 'Omit this prop to use the default background.'},
  ThemeProvider: {preventSSRMismatch: 'Remove this prop; it no longer has any effect.'},
  'UnderlineNav.Item': {icon: 'Use `leadingVisual` instead.'},
}

const entrypoints = new Map([
  ['@primer/react', deprecations],
  [
    '@primer/react/deprecated',
    {
      'ActionList.Item': {
        trailingIcon: 'Use `trailingVisual` instead.',
        trailingText: 'Use `trailingVisual` instead.',
      },
    },
  ],
  [
    '@primer/react/experimental',
    {
      'FilteredActionList.Input': textInputProps,
    },
  ],
  [
    '@primer/react/next',
    {
      ThemeProvider: deprecations.ThemeProvider,
    },
  ],
])

function getPrimerComponent(node, scope) {
  const members = []
  let root = node.name
  while (root.type === 'JSXMemberExpression') {
    members.unshift(root.property.name)
    root = root.object
  }
  if (root.type !== 'JSXIdentifier') return null

  const definition = getVariableDeclaration(scope, {name: root.name})
  if (definition?.type !== 'ImportBinding') return null
  const entrypoint = definition.parent.source.value
  const specifier = definition.node
  if (specifier.type === 'ImportSpecifier') {
    members.unshift(specifier.imported.name ?? specifier.imported.value)
  } else if (specifier.type !== 'ImportNamespaceSpecifier') {
    return null
  }

  const component = members.join('.')
  const catalogue = entrypoints.get(entrypoint)
  if (!catalogue || !Object.hasOwn(catalogue, component)) return null
  return {component, props: catalogue[component]}
}

function fixGroupTitle(fixer, node, title, sourceCode) {
  if (!title.value || node.selfClosing) return null
  let groupTitle
  if (title.value.type === 'Literal') {
    groupTitle = sourceCode.getText(title.value).slice(1, -1)
    if (/[{}<>]/.test(groupTitle)) return null
  } else if (title.value.type === 'JSXExpressionContainer' && title.value.expression.type !== 'JSXEmptyExpression') {
    groupTitle = sourceCode.getText(title.value)
  } else {
    return null
  }
  const heading = `${sourceCode.getText(node.name).slice(0, -'Group'.length)}GroupHeading`
  const start = title.range[0]
  const whitespace = sourceCode.text[start - 1]
  return [
    fixer.removeRange([whitespace === ' ' ? start - 1 : start, title.range[1]]),
    fixer.insertTextAfter(node, `<${heading}>${groupTitle}</${heading}>`),
  ]
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid deprecated Primer React component props.',
      recommended: true,
      url: url(module),
    },
    fixable: 'code',
    schema: [],
    messages: {
      titlePropDeprecated: 'The `title` prop is deprecated. Please use `ActionList.GroupHeading` instead.',
      deprecatedProp: 'The `{{prop}}` prop on `{{component}}` is deprecated. {{hint}}',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const primer = getPrimerComponent(node, context.sourceCode.getScope(node))
        if (!primer) return
        for (const attribute of node.attributes) {
          if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') continue
          const prop = attribute.name.name
          if (!Object.hasOwn(primer.props, prop)) continue
          if (primer.component === 'ActionList.Group' && prop === 'title') {
            context.report({
              node: attribute,
              messageId: 'titlePropDeprecated',
              fix: fixer => fixGroupTitle(fixer, node, attribute, context.sourceCode),
            })
          } else {
            context.report({
              node: attribute,
              messageId: 'deprecatedProp',
              data: {component: primer.component, prop, hint: primer.props[prop]},
            })
          }
        }
        if (
          Object.hasOwn(primer.props, 'children') &&
          !node.selfClosing &&
          node.parent.children.some(
            child =>
              (child.type === 'JSXText' && child.value.trim() !== '') ||
              (child.type === 'JSXExpressionContainer' && child.expression.type !== 'JSXEmptyExpression') ||
              child.type === 'JSXElement' ||
              child.type === 'JSXFragment' ||
              child.type === 'JSXSpreadChild',
          )
        ) {
          context.report({
            node,
            messageId: 'deprecatedProp',
            data: {component: primer.component, prop: 'children', hint: primer.props.children},
          })
        }
      },
    }
  },
}
