import {RuleTester} from 'eslint'
import rule from '../a11y-remove-disable-tooltip.js'

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

ruleTester.run('a11y-remove-disable-tooltip', rule, {
  valid: [
    `import {IconButton} from '@primer/react';
    <IconButton icon={SearchIcon} aria-label="Search" />`,
  ],
  invalid: [
    {
      code: `<IconButton icon={SearchIcon} aria-label="Search" unsafeDisableTooltip />`,
      output: `<IconButton icon={SearchIcon} aria-label="Search" />`,
      errors: [
        {
          messageId: 'removeDisableTooltipProp',
        },
      ],
    },
    {
      code: `<IconButton icon={SearchIcon} aria-label="Search" unsafeDisableTooltip={true} />`,
      output: `<IconButton icon={SearchIcon} aria-label="Search" />`,
      errors: [
        {
          messageId: 'removeDisableTooltipProp',
        },
      ],
    },
    {
      code: `<IconButton icon={SearchIcon} aria-label="Search" unsafeDisableTooltip={false} />`,
      output: `<IconButton icon={SearchIcon} aria-label="Search" />`,
      errors: [
        {
          messageId: 'removeDisableTooltipProp',
        },
      ],
    },
  ],
})
