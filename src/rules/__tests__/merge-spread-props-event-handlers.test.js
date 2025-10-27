const rule = require('../merge-spread-props-event-handlers')
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

ruleTester.run('merge-spread-props-event-handlers', rule, {
  valid: [
    // No spread props
    `<Example onClick={() => {}} />`,
    // Spread props but no event handlers
    `<Example {...rest} />`,
    // Event handler before spread props (spread will override, which is expected)
    `<Example onClick={() => {}} {...rest} />`,
    // Event handler already using compose
    `<Example {...rest} onClick={compose(rest.onClick, () => {})} />`,
    // Event handler already using composeEventHandlers
    `<Example {...rest} onClick={composeEventHandlers(rest.onClick, handleClick)} />`,
    // Event handler already using composeHandlers
    `<Example {...rest} onClick={composeHandlers(rest.onClick, handleClick)} />`,
    // Multiple spreads but no event handlers
    `<Example {...rest} {...other} />`,
    // Non-event handler props with spread
    `<Example {...rest} className="foo" />`,
  ],
  invalid: [
    // onClick after spread with arrow function
    {
      code: `<Example {...rest} onClick={() => {}} />`,
      output: `<Example {...rest} onClick={compose(rest.onClick, () => {})} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // onClick after spread with named function
    {
      code: `<Example {...rest} onClick={handleClick} />`,
      output: `<Example {...rest} onClick={compose(rest.onClick, handleClick)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // onChange after spread
    {
      code: `<Example {...rest} onChange={handleChange} />`,
      output: `<Example {...rest} onChange={compose(rest.onChange, handleChange)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // Multiple event handlers after spread
    {
      code: `<Example {...rest} onClick={handleClick} onChange={handleChange} />`,
      output: `<Example {...rest} onClick={compose(rest.onClick, handleClick)} onChange={compose(rest.onChange, handleChange)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // Event handler after spread with custom prop name
    {
      code: `<Example {...props} onClick={handleClick} />`,
      output: `<Example {...props} onClick={compose(props.onClick, handleClick)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // onSubmit after spread
    {
      code: `<Example {...rest} onSubmit={handleSubmit} />`,
      output: `<Example {...rest} onSubmit={compose(rest.onSubmit, handleSubmit)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // onFocus after spread
    {
      code: `<Example {...rest} onFocus={handleFocus} />`,
      output: `<Example {...rest} onFocus={compose(rest.onFocus, handleFocus)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // Event handler in the middle of spreads
    {
      code: `<Example {...rest} onClick={handleClick} {...other} />`,
      output: `<Example {...rest} onClick={compose(rest.onClick, handleClick)} {...other} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // Multiple spreads with event handler after first spread
    {
      code: `<Example {...rest} {...other} onClick={handleClick} />`,
      output: `<Example {...rest} {...other} onClick={compose(rest.onClick, handleClick)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
    // onKeyDown after spread
    {
      code: `<Example {...rest} onKeyDown={handleKeyDown} />`,
      output: `<Example {...rest} onKeyDown={compose(rest.onKeyDown, handleKeyDown)} />`,
      errors: [
        {
          messageId: 'mergeEventHandler',
        },
      ],
    },
  ],
})
