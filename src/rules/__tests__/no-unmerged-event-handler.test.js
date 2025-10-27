const rule = require('../no-unmerged-event-handler')
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

ruleTester.run('no-unmerged-event-handler', rule, {
  valid: [
    // No spread props - OK
    `<Example onClick={handleClick} />`,
    // Spread but no event handler - OK
    `<Example {...rest} />`,
    // Event handler before spread (spread overrides) - OK
    `<Example onClick={handleClick} {...rest} />`,
    // Event handler after spread with compose - OK
    `<Example {...rest} onClick={compose(onClick, handleClick)} />`,
    // Event handler after spread with composeEventHandlers - OK
    `<Example {...rest} onClick={composeEventHandlers(onClick, handleClick)} />`,
    // Multiple spreads but event handler with compose - OK
    `<Example {...rest} {...other} onClick={compose(onClick, handleClick)} />`,
    // Different event handlers with compose - OK
    `<Example {...rest} onFocus={compose(onFocus, handleFocus)} onBlur={compose(onBlur, handleBlur)} />`,
  ],
  invalid: [
    // onClick after spread without merging - PROBLEM
    {
      code: `<Example {...rest} onClick={handleClick} />`,
      errors: [
        {
          messageId: 'noUnmergedEventHandler',
          data: {handlerName: 'onClick'},
        },
      ],
    },
    // onClick after spread with arrow function - PROBLEM
    {
      code: `<Example {...rest} onClick={() => {}} />`,
      errors: [
        {
          messageId: 'noUnmergedEventHandler',
          data: {handlerName: 'onClick'},
        },
      ],
    },
    // onChange after spread - PROBLEM
    {
      code: `<Example {...rest} onChange={handleChange} />`,
      errors: [
        {
          messageId: 'noUnmergedEventHandler',
          data: {handlerName: 'onChange'},
        },
      ],
    },
    // Multiple event handlers not merged - PROBLEM
    {
      code: `<Example {...rest} onClick={handleClick} onFocus={handleFocus} />`,
      errors: [
        {
          messageId: 'noUnmergedEventHandler',
          data: {handlerName: 'onClick'},
        },
        {
          messageId: 'noUnmergedEventHandler',
          data: {handlerName: 'onFocus'},
        },
      ],
    },
    // onSubmit after spread - PROBLEM
    {
      code: `<Example {...rest} onSubmit={handleSubmit} />`,
      errors: [
        {
          messageId: 'noUnmergedEventHandler',
          data: {handlerName: 'onSubmit'},
        },
      ],
    },
    // Multiple spreads with event handler not merged - PROBLEM
    {
      code: `<Example {...rest} {...other} onClick={handleClick} />`,
      errors: [
        {
          messageId: 'noUnmergedEventHandler',
          data: {handlerName: 'onClick'},
        },
      ],
    },
  ],
})
