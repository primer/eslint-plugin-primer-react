const rule = require('../namespace-spacing-utils')
const {RuleTester} = require('eslint')

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

ruleTester.run('namespace-spacing-utils', rule, {
  valid: [
    // Already namespaced margin classes
    '<div className="pr-m-4" />',
    '<div className="pr-mx-2" />',
    '<div className="pr-my-3" />',
    '<div className="pr-mt-1" />',
    '<div className="pr-mr-2" />',
    '<div className="pr-mb-3" />',
    '<div className="pr-ml-4" />',

    // Already namespaced padding classes
    '<div className="pr-p-4" />',
    '<div className="pr-px-2" />',
    '<div className="pr-py-3" />',
    '<div className="pr-pt-1" />',
    '<div className="pr-pr-2" />',
    '<div className="pr-pb-3" />',
    '<div className="pr-pl-4" />',

    // Multiple namespaced classes
    '<div className="pr-m-4 pr-p-2" />',
    '<div className="some-class pr-m-4 other-class" />',

    // Negative spacing classes (already namespaced)
    '<div className="pr-m-n4" />',
    '<div className="pr-mt-n2" />',

    // Auto spacing classes (already namespaced)
    '<div className="pr-m-auto" />',
    '<div className="pr-mx-auto" />',

    // Non-spacing classes should be ignored
    '<div className="text-bold color-fg-default" />',
    '<div className="d-flex flex-row" />',

    // Classes that look similar but aren't spacing utilities
    '<div className="my-custom-class" />',
    '<div className="padding-extra" />',
    '<div className="margin-custom" />',

    // Empty className
    '<div className="" />',

    // No className
    '<div />',

    // Template literal with namespaced classes
    '<div className={`pr-m-4 pr-p-2`} />',

    // Responsive variants (already namespaced) - Primer CSS format: mx-sm-2, mx-md-4
    '<div className="pr-mx-sm-2" />',
    '<div className="pr-mx-md-4" />',
    '<div className="pr-p-lg-3" />',
  ],
  invalid: [
    // Basic margin classes without namespace
    {
      code: '<div className="m-4" />',
      output: '<div className="pr-m-4" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'm-4', replacement: 'pr-m-4'}}],
    },
    {
      code: '<div className="mx-2" />',
      output: '<div className="pr-mx-2" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mx-2', replacement: 'pr-mx-2'}}],
    },
    {
      code: '<div className="my-3" />',
      output: '<div className="pr-my-3" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'my-3', replacement: 'pr-my-3'}}],
    },
    {
      code: '<div className="mt-1" />',
      output: '<div className="pr-mt-1" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mt-1', replacement: 'pr-mt-1'}}],
    },
    {
      code: '<div className="mr-2" />',
      output: '<div className="pr-mr-2" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mr-2', replacement: 'pr-mr-2'}}],
    },
    {
      code: '<div className="mb-3" />',
      output: '<div className="pr-mb-3" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mb-3', replacement: 'pr-mb-3'}}],
    },
    {
      code: '<div className="ml-4" />',
      output: '<div className="pr-ml-4" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'ml-4', replacement: 'pr-ml-4'}}],
    },

    // Basic padding classes without namespace
    {
      code: '<div className="p-4" />',
      output: '<div className="pr-p-4" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'p-4', replacement: 'pr-p-4'}}],
    },
    {
      code: '<div className="px-2" />',
      output: '<div className="pr-px-2" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'px-2', replacement: 'pr-px-2'}}],
    },
    {
      code: '<div className="py-3" />',
      output: '<div className="pr-py-3" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'py-3', replacement: 'pr-py-3'}}],
    },
    {
      code: '<div className="pt-1" />',
      output: '<div className="pr-pt-1" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'pt-1', replacement: 'pr-pt-1'}}],
    },
    {
      code: '<div className="pb-3" />',
      output: '<div className="pr-pb-3" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'pb-3', replacement: 'pr-pb-3'}}],
    },
    {
      code: '<div className="pl-4" />',
      output: '<div className="pr-pl-4" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'pl-4', replacement: 'pr-pl-4'}}],
    },

    // Negative spacing classes
    {
      code: '<div className="m-n4" />',
      output: '<div className="pr-m-n4" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'm-n4', replacement: 'pr-m-n4'}}],
    },
    {
      code: '<div className="mt-n2" />',
      output: '<div className="pr-mt-n2" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mt-n2', replacement: 'pr-mt-n2'}}],
    },

    // Auto spacing classes
    {
      code: '<div className="m-auto" />',
      output: '<div className="pr-m-auto" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'm-auto', replacement: 'pr-m-auto'}}],
    },
    {
      code: '<div className="mx-auto" />',
      output: '<div className="pr-mx-auto" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mx-auto', replacement: 'pr-mx-auto'}}],
    },

    // Mixed with other classes
    {
      code: '<div className="some-class m-4 other-class" />',
      output: '<div className="some-class pr-m-4 other-class" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'm-4', replacement: 'pr-m-4'}}],
    },

    // Multiple unnamespaced classes - each is reported and fixed (first pass fixes first match only in test)
    {
      code: '<div className="m-4 p-2" />',
      output: '<div className="pr-m-4 p-2" />',
      errors: [
        {messageId: 'namespaceRequired', data: {className: 'm-4', replacement: 'pr-m-4'}},
        {messageId: 'namespaceRequired', data: {className: 'p-2', replacement: 'pr-p-2'}},
      ],
    },

    // Template literal
    {
      code: '<div className={`m-4`} />',
      output: '<div className={`pr-m-4`} />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'm-4', replacement: 'pr-m-4'}}],
    },

    // Responsive variants - Primer CSS format: mx-sm-2, mx-md-4
    {
      code: '<div className="mx-sm-2" />',
      output: '<div className="pr-mx-sm-2" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mx-sm-2', replacement: 'pr-mx-sm-2'}}],
    },
    {
      code: '<div className="mx-md-4" />',
      output: '<div className="pr-mx-md-4" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'mx-md-4', replacement: 'pr-mx-md-4'}}],
    },
    {
      code: '<div className="p-lg-3" />',
      output: '<div className="pr-p-lg-3" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'p-lg-3', replacement: 'pr-p-lg-3'}}],
    },

    // Size 0 classes
    {
      code: '<div className="m-0" />',
      output: '<div className="pr-m-0" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'm-0', replacement: 'pr-m-0'}}],
    },
    {
      code: '<div className="p-0" />',
      output: '<div className="pr-p-0" />',
      errors: [{messageId: 'namespaceRequired', data: {className: 'p-0', replacement: 'pr-p-0'}}],
    },

    // Duplicate class occurrences (edge case - should replace all)
    {
      code: '<div className="m-4 some-class m-4" />',
      output: '<div className="pr-m-4 some-class pr-m-4" />',
      errors: [
        {messageId: 'namespaceRequired', data: {className: 'm-4', replacement: 'pr-m-4'}},
        {messageId: 'namespaceRequired', data: {className: 'm-4', replacement: 'pr-m-4'}},
      ],
    },
  ],
})
