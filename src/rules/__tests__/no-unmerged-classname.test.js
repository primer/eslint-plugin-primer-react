const rule = require('../no-unmerged-classname')
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

ruleTester.run('no-unmerged-classname', rule, {
  valid: [
    // No spread props - OK
    `<Example className="foo" />`,
    // Spread but no className - OK
    `<Example {...rest} />`,
    // className before spread (spread overrides) - OK
    `<Example className="foo" {...rest} />`,
    // className after spread with clsx - OK
    `<Example {...rest} className={clsx(className, "foo")} />`,
    // className after spread with classNames - OK
    `<Example {...rest} className={classNames(className, "foo")} />`,
    // className after spread with cn - OK
    `<Example {...rest} className={cn(className, "foo")} />`,
    // Multiple spreads but className with clsx - OK
    `<Example {...rest} {...other} className={clsx(className, "foo")} />`,
  ],
  invalid: [
    // className after spread without merging - PROBLEM
    {
      code: `<Example {...rest} className="foo" />`,
      errors: [
        {
          messageId: 'noUnmergedClassName',
        },
      ],
    },
    // className after spread with expression but not merging function - PROBLEM
    {
      code: `<Example {...rest} className={myClassName} />`,
      errors: [
        {
          messageId: 'noUnmergedClassName',
        },
      ],
    },
    // className after spread with template literal - PROBLEM
    {
      code: `<Example {...rest} className={\`foo \${bar}\`} />`,
      errors: [
        {
          messageId: 'noUnmergedClassName',
        },
      ],
    },
    // Multiple spreads with className not merged - PROBLEM
    {
      code: `<Example {...rest} {...other} className="foo" />`,
      errors: [
        {
          messageId: 'noUnmergedClassName',
        },
      ],
    },
  ],
})
