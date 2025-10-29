const rule = require('../merge-spread-props-classname')
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

ruleTester.run('merge-spread-props-classname', rule, {
  valid: [
    // No spread props
    `<Example className="foo" />`,
    // Spread props but no className
    `<Example {...rest} />`,
    // className before spread props (spread will override, which is expected)
    `<Example className="foo" {...rest} />`,
    // className already using clsx
    `<Example {...rest} className={clsx(rest.className, "foo")} />`,
    // className already using classnames
    `<Example {...rest} className={classnames(rest.className, "foo")} />`,
    // className already using classNames (capital N)
    `<Example {...rest} className={classNames(rest.className, "foo")} />`,
    // className already using cn
    `<Example {...rest} className={cn(rest.className, "foo")} />`,
    // Multiple spreads but no className
    `<Example {...rest} {...other} />`,
  ],
  invalid: [
    // className after spread with string literal
    {
      code: `<Example {...rest} className="foo" />`,
      output: `<Example {...rest} className={clsx(rest.className, "foo")} />`,
      errors: [
        {
          messageId: 'mergeClassName',
        },
      ],
    },
    // className after spread with expression
    {
      code: `<Example {...rest} className={styles.button} />`,
      output: `<Example {...rest} className={clsx(rest.className, styles.button)} />`,
      errors: [
        {
          messageId: 'mergeClassName',
        },
      ],
    },
    // className after spread with template literal
    {
      code: '<Example {...rest} className={`foo ${bar}`} />',
      output: '<Example {...rest} className={clsx(rest.className, `foo ${bar}`)} />',
      errors: [
        {
          messageId: 'mergeClassName',
        },
      ],
    },
    // Multiple spreads with className after first spread
    {
      code: `<Example {...rest} {...other} className="foo" />`,
      output: `<Example {...rest} {...other} className={clsx(rest.className, "foo")} />`,
      errors: [
        {
          messageId: 'mergeClassName',
        },
      ],
    },
    // className after spread with custom prop name
    {
      code: `<Example {...props} className="foo" />`,
      output: `<Example {...props} className={clsx(props.className, "foo")} />`,
      errors: [
        {
          messageId: 'mergeClassName',
        },
      ],
    },
    // Complex className expression
    {
      code: `<Example {...rest} className={someCondition ? "foo" : "bar"} />`,
      output: `<Example {...rest} className={clsx(rest.className, someCondition ? "foo" : "bar")} />`,
      errors: [
        {
          messageId: 'mergeClassName',
        },
      ],
    },
    // className in the middle of spreads
    {
      code: `<Example {...rest} className="foo" {...other} />`,
      output: `<Example {...rest} className={clsx(rest.className, "foo")} {...other} />`,
      errors: [
        {
          messageId: 'mergeClassName',
        },
      ],
    },
  ],
})
