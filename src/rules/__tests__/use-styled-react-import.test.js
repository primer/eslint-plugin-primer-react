const rule = require('../use-styled-react-import')
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

ruleTester.run('use-styled-react-import', rule, {
  valid: [
    // Valid: Component used without sx prop
    `import { Button } from '@primer/react'
     const Component = () => <Button>Click me</Button>`,

    // Valid: Component with sx prop imported from styled-react
    `import { Button } from '@primer/styled-react'
     const Component = () => <Button sx={{ color: 'red' }}>Click me</Button>`,

    // Valid: Utilities imported from styled-react
    `import { sx } from '@primer/styled-react'`,

    // Valid: Component not in the styled list
    `import { Avatar } from '@primer/react'
     const Component = () => <Avatar sx={{ color: 'red' }} />`,

    // Valid: Mixed imports - component without sx prop
    `import { Button, Text } from '@primer/react'
     const Component = () => <Button>Click me</Button>`,
  ],
  invalid: [
    // Invalid: Box with sx prop imported from @primer/react
    {
      code: `import { Box } from '@primer/react'
             const Component = () => <Box sx={{ color: 'red' }}>Content</Box>`,
      output: `import { Box } from '@primer/styled-react'
             const Component = () => <Box sx={{ color: 'red' }}>Content</Box>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Box'},
        },
      ],
    },

    // Invalid: Button with sx prop imported from @primer/react
    {
      code: `import { Button } from '@primer/react'
             const Component = () => <Button sx={{ margin: 2 }}>Click me</Button>`,
      output: `import { Button } from '@primer/styled-react'
             const Component = () => <Button sx={{ margin: 2 }}>Click me</Button>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },

    // Invalid: Multiple components, one with sx prop
    {
      code: `import { Button, Box, Avatar } from '@primer/react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
                 <Avatar />
               </div>
             )`,
      output: `import { Button, Avatar } from '@primer/react'
import { Box } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
                 <Avatar />
               </div>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Box'},
        },
      ],
    },

    // Invalid: Utility import from @primer/react that should be from styled-react
    {
      code: `import { sx } from '@primer/react'`,
      output: `import { sx } from '@primer/styled-react'`,
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'sx'},
        },
      ],
    },

    // Invalid: Button and Link, only Button uses sx
    {
      code: `import { Button, Link } from '@primer/react'
             const Component = () => <Button sx={{ color: 'red' }}>Click me</Button>`,
      output: `import { Link } from '@primer/react'
import { Button } from '@primer/styled-react'
             const Component = () => <Button sx={{ color: 'red' }}>Click me</Button>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },
  ],
})
