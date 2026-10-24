'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-props')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('no-deprecated-props', rule, {
  valid: [
    `import {ActionList} from '@primer/react';
    <ActionList>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3">Group heading 1</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3">Group heading 2</ActionList.GroupHeading>
            <ActionList.Item>Item 2</ActionList.Item>
        </ActionList.Group>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList>
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading 2</ActionList.GroupHeading>
            <ActionList.Item>Item 2</ActionList.Item>
        </ActionList.Group>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList>
        <ActionList.Group>
            <ActionList.GroupHeading as="h3">Group heading</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Item>Item 2</ActionList.Item>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList role="listbox">
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
        <ActionList.Item>Item 2</ActionList.Item>
    </ActionList>`,
    `import {ActionList} from '@primer/react';
    <ActionList role="menu">
        <ActionList.Item>Item</ActionList.Item>
        <ActionList.Group>
            <ActionList.GroupHeading>Group heading</ActionList.GroupHeading>
            <ActionList.Item>Group item</ActionList.Item>
        </ActionList.Group>
    </ActionList>`,
  ],
  invalid: [
    {
      code: `<ActionList.Group title="Group heading 1"></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title="Group heading 1" sx={{padding: 2}}></ActionList.Group>`,
      output: `<ActionList.Group sx={{padding: 2}}><ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group variant="filled" title="Group heading 1"></ActionList.Group>`,
      output: `<ActionList.Group variant="filled"><ActionList.GroupHeading>Group heading 1</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title={titleVariable}></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>{titleVariable}</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title={'Title'}></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>{'Title'}</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
    {
      code: `<ActionList.Group title={condition ? 'Title' : undefined}></ActionList.Group>`,
      output: `<ActionList.Group><ActionList.GroupHeading>{condition ? 'Title' : undefined}</ActionList.GroupHeading></ActionList.Group>`,
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
  ].map(test => ({
    ...test,
    code: `import {ActionList} from '@primer/react';\n${test.code}`,
    output: `import {ActionList} from '@primer/react';\n${test.output}`,
  })),
})

const deprecatedProps = [
  ['ActionList.Item', 'as'],
  ['Autocomplete.Input', 'openOnFocus'],
  ['Autocomplete.Overlay', 'overlayProps'],
  ['Banner', 'icon'],
  ['CounterLabel', 'scheme'],
  ['IconButton', 'keyshortcuts'],
  ['Link', 'hoverColor'],
  ['PageLayout.Header', 'dividerWhenNarrow'],
  ['PageLayout.Pane', 'dividerWhenNarrow'],
  ['PageLayout.Pane', 'positionWhenNarrow'],
  ['PageLayout.Footer', 'dividerWhenNarrow'],
  ['SegmentedControl.Button', 'icon'],
  ['SegmentedControl.Button', 'leadingIcon'],
  ['SelectPanel', 'footer'],
  ['Spinner', 'aria-label'],
  ['StateLabel', 'variant'],
  ['TextInput.Action', 'children'],
  ['TextInput.Action', 'variant'],
  ['Textarea', 'contrast'],
  ['ThemeProvider', 'preventSSRMismatch'],
  ['UnderlineNav.Item', 'icon'],
  ...['TextInput', 'TextInputWithTokens', 'Autocomplete.Input'].flatMap(component =>
    ['icon', 'contrast', 'variant', 'width', 'minWidth', 'maxWidth'].map(prop => [component, prop]),
  ),
  ...['Button', 'LinkButton', 'ActionMenu.Button'].flatMap(component =>
    ['leadingIcon', 'trailingIcon'].map(prop => [component, prop]),
  ),
]

ruleTester.run('no-deprecated-props catalogue', rule, {
  valid: [
    `import {ActionList} from '@primer/react'; <ActionList.LinkItem as="a" />`,
    `import {Autocomplete} from '@primer/react'; <Autocomplete.Input onFocus={onFocus} />`,
    `import {Autocomplete} from '@primer/react'; <Autocomplete.Overlay width="small" />`,
    `import {Banner} from '@primer/react'; <Banner leadingVisual={Icon} />`,
    `import {CounterLabel} from '@primer/react'; <CounterLabel variant="secondary" />`,
    `import {IconButton} from '@primer/react'; <IconButton icon={Icon} keybindingHint="g" />`,
    `import {Link} from '@primer/react'; <Link className="hover" />`,
    `import {PageLayout} from '@primer/react'; <PageLayout.Pane divider={{narrow: 'line'}} position={{narrow: 'end'}} />`,
    `import {SegmentedControl} from '@primer/react'; <SegmentedControl.Button leadingVisual={Icon} />`,
    `import {SelectPanel} from '@primer/react'; <SelectPanel secondaryAction={action} />`,
    `import {Spinner} from '@primer/react'; <Spinner srText="Loading" />`,
    `import {StateLabel} from '@primer/react'; <StateLabel size="small" />`,
    `import {TextInput} from '@primer/react'; <TextInput leadingVisual={Icon} size="small" style={{width: 100}} />`,
    `import {TextInput} from '@primer/react'; <TextInput.Action icon={Icon}>{/* no children */}</TextInput.Action>`,
    `import {UnderlineNav} from '@primer/react'; <UnderlineNav.Item leadingVisual={Icon} />`,
    `import {Banner} from '@primer/react-brand'; <Banner icon={Icon} />`,
    `import * as Primer from '@primer/react-brand'; <Primer.Autocomplete.Input openOnFocus />`,
    `import {SelectPanel} from '@primer/react/experimental'; <SelectPanel footer={footer} />`,
    `import {ActionList} from '@primer/react/deprecated'; <ActionList.Item as="a" />`,
    `import {ActionList} from './local'; <ActionList.Group title="Local title" />`,
    `const Autocomplete = local; <Autocomplete.Input openOnFocus />`,
    `import {Banner} from '@primer/react'; function Example(Banner) { return <Banner icon={Icon} /> }`,
    `import * as Primer from '@primer/react'; function Example(Primer) { return <Primer.Banner icon={Icon} /> }`,
    `import {Autocomplete} from '@primer/react'; function Example(Autocomplete) { return <Autocomplete.Input openOnFocus /> }`,
    `import {Banner} from '@primer/react'; <Banner {...props} />`,
    `import * as Primer from '@primer/react'; <Primer.toString icon={Icon} />`,
    `import {Banner} from '@primer/react'; <Banner toString={value} />`,
    `<ActionList.Group title="Unresolved component" />`,
    `<svg:path title="Not a component" />`,
  ],
  invalid: [
    ...deprecatedProps.flatMap(([component, prop]) => {
      const [root, ...members] = component.split('.')
      const alias = ['Alias', ...members].join('.')
      return [
        `import {${root}} from '@primer/react'; <${component} ${prop}={value} />`,
        `import {${root} as Alias} from '@primer/react'; <${alias} ${prop}={value} />`,
        `import * as Primer from '@primer/react'; <Primer.${component} ${prop}={value} />`,
      ].map(code => ({
        code,
        output: null,
        errors: [{messageId: 'deprecatedProp'}],
      }))
    }),
    {
      code: `import {Autocomplete as A} from '@primer/react'; <A.Input openOnFocus={false} />`,
      output: null,
      errors: [{messageId: 'deprecatedProp'}],
    },
    {
      code: `import {TextInput} from '@primer/react'; <TextInput icon={Icon} contrast />`,
      output: null,
      errors: [{messageId: 'deprecatedProp'}, {messageId: 'deprecatedProp'}],
    },
    ...['trailingIcon', 'trailingText'].map(prop => ({
      code: `import {ActionList as Legacy} from '@primer/react/deprecated'; <Legacy.Item ${prop}={value} />`,
      output: null,
      errors: [{messageId: 'deprecatedProp'}],
    })),
    ...['icon', 'contrast', 'variant', 'width', 'minWidth', 'maxWidth'].map(prop => ({
      code: `import {FilteredActionList} from '@primer/react/experimental'; <FilteredActionList.Input ${prop}={value} />`,
      output: null,
      errors: [{messageId: 'deprecatedProp'}],
    })),
    {
      code: `import {ThemeProvider} from '@primer/react/next'; <ThemeProvider preventSSRMismatch />`,
      output: null,
      errors: [{messageId: 'deprecatedProp'}],
    },
    ...['Text', '{value}', '<span />', '<>Text</>'].map(children => ({
      code: `import {TextInput} from '@primer/react'; <TextInput.Action>${children}</TextInput.Action>`,
      output: null,
      errors: [{messageId: 'deprecatedProp'}],
    })),
    {
      code: `import {ActionList as List} from '@primer/react'; <List.Group title="Title"></List.Group>`,
      output: `import {ActionList as List} from '@primer/react'; <List.Group><List.GroupHeading>Title</List.GroupHeading></List.Group>`,
      errors: [{messageId: 'titlePropDeprecated'}],
    },
    {
      code: `import * as Primer from '@primer/react'; <Primer.ActionList.Group title="A &amp; B"></Primer.ActionList.Group>`,
      output: `import * as Primer from '@primer/react'; <Primer.ActionList.Group><Primer.ActionList.GroupHeading>A &amp; B</Primer.ActionList.GroupHeading></Primer.ActionList.Group>`,
      errors: [{messageId: 'titlePropDeprecated'}],
    },
    ...['title', 'title="Title"', 'title={title}'].map(attribute => ({
      code: `import {ActionList} from '@primer/react'; <ActionList.Group ${attribute} />`,
      output: null,
      errors: [{messageId: 'titlePropDeprecated'}],
    })),
    ...['title', 'title="{literal}"'].map(attribute => ({
      code: `import {ActionList} from '@primer/react'; <ActionList.Group ${attribute}></ActionList.Group>`,
      output: null,
      errors: [{messageId: 'titlePropDeprecated'}],
    })),
  ],
})
