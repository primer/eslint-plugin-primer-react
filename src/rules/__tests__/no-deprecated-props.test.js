'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-props')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
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
      code: `
        import {ActionList} from '@primer/react';
        <ActionList>
            <ActionList.Group title="Group heading 1">
                <ActionList.Item>Item</ActionList.Item>
            </ActionList.Group>
            <ActionList.Group title="Group heading 2">
                <ActionList.Item>Item 2</ActionList.Item>
            </ActionList.Group>
        </ActionList>`,
      output: `
        import {ActionList} from '@primer/react';
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
      errors: [
        {
          messageId: 'titlePropDeprecated',
        },
        {
          messageId: 'titlePropDeprecated',
        },
      ],
    },
  ],
})
