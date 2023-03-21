const rule = require('../direct-slot-children')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

ruleTester.run('direct-slot-children', rule, {
  valid: [
    `import {PageLayout} from '@primer/react'; <PageLayout><PageLayout.Header>Header</PageLayout.Header><PageLayout.Footer>Footer</PageLayout.Footer></PageLayout>`,
    `import {PageLayout} from '@primer/react'; <PageLayout><div><PageLayout.Pane>Header</PageLayout.Pane></div></PageLayout>`,
    `import {PageLayout} from 'some-library'; <PageLayout.Header>Header</PageLayout.Header>`
  ],
  invalid: [
    {
      code: `import {PageLayout} from '@primer/react'; <PageLayout.Header>Header</PageLayout.Header>`,
      errors: [
        {
          messageId: 'directSlotChildren',
          data: {childName: 'PageLayout.Header', parentName: 'PageLayout'}
        }
      ]
    },
    {
      code: `import {PageLayout} from '@primer/react/drafts'; <PageLayout.Header>Header</PageLayout.Header>`,
      errors: [
        {
          messageId: 'directSlotChildren',
          data: {childName: 'PageLayout.Header', parentName: 'PageLayout'}
        }
      ]
    },
    {
      code: `import {PageLayout} from '@primer/react'; <div><PageLayout.Header>Header</PageLayout.Header></div>`,
      errors: [
        {
          messageId: 'directSlotChildren',
          data: {childName: 'PageLayout.Header', parentName: 'PageLayout'}
        }
      ]
    },
    {
      code: `import {PageLayout} from '@primer/react'; <PageLayout><div><PageLayout.Header>Header</PageLayout.Header></div></PageLayout>`,
      errors: [
        {
          messageId: 'directSlotChildren',
          data: {childName: 'PageLayout.Header', parentName: 'PageLayout'}
        }
      ]
    },
    {
      code: `import {TreeView} from '@primer/react'; <TreeView><TreeView.Item><div><TreeView.LeadingVisual>Visual</TreeView.LeadingVisual></div></TreeView.Item></TreeView>`,
      errors: [
        {
          messageId: 'directSlotChildren',
          data: {childName: 'TreeView.LeadingVisual', parentName: 'TreeView.Item'}
        }
      ]
    }
  ]
})
