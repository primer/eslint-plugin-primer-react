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

    // Valid: Component not imported from @primer/react
    `import { Button } from '@github-ui/button'
     const Component = () => <Button sx={{ color: 'red' }} />`,

    // Valid: Mixed imports - component without sx prop
    `import { Button, Text } from '@primer/react'
     const Component = () => <Button>Click me</Button>`,

    // Valid: Component without sx prop imported from styled-react (when not used)
    `import { Button } from '@primer/styled-react'`,
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

    // Invalid: Button imported from styled-react but used without sx prop
    {
      code: `import { Button } from '@primer/styled-react'
             const Component = () => <Button>Click me</Button>`,
      output: `import { Button } from '@primer/react'
             const Component = () => <Button>Click me</Button>`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },

    // Invalid: Box imported from styled-react but used without sx prop
    {
      code: `import { Box } from '@primer/styled-react'
             const Component = () => <Box>Content</Box>`,
      output: `import { Box } from '@primer/react'
             const Component = () => <Box>Content</Box>`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Box'},
        },
      ],
    },

    // Invalid: Multiple components from styled-react, one used without sx
    {
      code: `import { Button, Box } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
               </div>
             )`,
      output: `import { Box } from '@primer/styled-react'
import { Button } from '@primer/react'
             const Component = () => (
               <div>
                 <Button>Regular button</Button>
                 <Box sx={{ padding: 2 }}>Styled box</Box>
               </div>
             )`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Button'},
        },
      ],
    },

    // Invalid: Button used both with and without sx prop - should use alias
    {
      code: `import { Button, Link } from '@primer/react'
             const Component = () => (
               <div>
                 <Link sx={{ color: 'red' }} />
                 <Button>Regular button</Button>
                 <Button sx={{ color: 'red' }}>Styled button</Button>
               </div>
             )`,
      output: `import { Button } from '@primer/react'
import { Button as StyledButton, Link } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Link sx={{ color: 'red' }} />
                 <Button>Regular button</Button>
                 <StyledButton sx={{ color: 'red' }}>Styled button</StyledButton>
               </div>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImportWithAlias',
          data: {componentName: 'Button', aliasName: 'StyledButton'},
        },
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'Link'},
        },
        {
          messageId: 'useAliasedComponent',
          data: {componentName: 'Button', aliasName: 'StyledButton'},
        },
      ],
    },
  ],
})
