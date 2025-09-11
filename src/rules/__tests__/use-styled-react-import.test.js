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

    // Invalid: ActionList.Item with sx prop and ActionList imported from @primer/react
    {
      code: `import { ActionList } from '@primer/react'
             const Component = () => <ActionList.Item sx={{ color: 'red' }}>Content</ActionList.Item>`,
      output: `import { ActionList } from '@primer/styled-react'
             const Component = () => <ActionList.Item sx={{ color: 'red' }}>Content</ActionList.Item>`,
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'ActionList'},
        },
      ],
    },

    // Invalid: FormControl used both with and without sx prop - should use alias
    {
      code: `import { FormControl } from '@primer/react'
             const Component = () => (
               <div>
                 <FormControl></FormControl>
                 <FormControl sx={{ color: 'red' }}>
                   <FormControl.Label visuallyHidden>Label</FormControl.Label>
                 </FormControl>
               </div>
             )`,
      output: `import { FormControl } from '@primer/react'
import { FormControl as StyledFormControl } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <FormControl></FormControl>
                 <StyledFormControl sx={{ color: 'red' }}>
                   <StyledFormControl.Label visuallyHidden>Label</StyledFormControl.Label>
                 </StyledFormControl>
               </div>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImportWithAlias',
          data: {componentName: 'FormControl', aliasName: 'StyledFormControl'},
        },
        {
          messageId: 'useAliasedComponent',
          data: {componentName: 'FormControl', aliasName: 'StyledFormControl'},
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

    // Invalid: ActionList used without sx, ActionList.Item used with sx - should use alias for compound component
    {
      code: `import { ActionList, ActionMenu } from '@primer/react'
             const Component = () => (
               <ActionMenu>
                 <ActionMenu.Overlay>
                   <ActionList>
                     <ActionList.Item sx={{ paddingLeft: 'calc(1 * var(--base-size-12))' }}>
                       Item
                     </ActionList.Item>
                   </ActionList>
                 </ActionMenu.Overlay>
               </ActionMenu>
             )`,
      output: `import { ActionList, ActionMenu } from '@primer/react'
import { ActionList as StyledActionList } from '@primer/styled-react'
             const Component = () => (
               <ActionMenu>
                 <ActionMenu.Overlay>
                   <ActionList>
                     <StyledActionList.Item sx={{ paddingLeft: 'calc(1 * var(--base-size-12))' }}>
                       Item
                     </StyledActionList.Item>
                   </ActionList>
                 </ActionMenu.Overlay>
               </ActionMenu>
             )`,
      errors: [
        {
          messageId: 'useStyledReactImportWithAlias',
          data: {componentName: 'ActionList', aliasName: 'StyledActionList'},
        },
        {
          messageId: 'useAliasedComponent',
          data: {componentName: 'ActionList', aliasName: 'StyledActionList'},
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

    // Invalid: <Link /> and <StyledButton /> imported from styled-react but used without sx prop
    {
      code: `import { Button } from '@primer/react'
import { Button as StyledButton, Link } from '@primer/styled-react'
             const Component = () => (
               <div>
                 <Link />
                 <Button>Regular button</Button>
                 <StyledButton>Styled button</StyledButton>
               </div>
             )`,
      output: `import { Button, Link } from '@primer/react'

             const Component = () => (
               <div>
                 <Link />
                 <Button>Regular button</Button>
                 <Button>Styled button</Button>
               </div>
             )`,
      errors: [
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Button'},
        },
        {
          messageId: 'usePrimerReactImport',
          data: {componentName: 'Link'},
        },
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

// Test configuration options
ruleTester.run('use-styled-react-import with custom configuration', rule, {
  valid: [
    // Valid: Custom component not in default list
    {
      code: `import { CustomButton } from '@primer/react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      options: [{}], // Using default configuration
    },

    // Valid: Custom component in custom list used without sx prop
    {
      code: `import { CustomButton } from '@primer/react'
             const Component = () => <CustomButton>Click me</CustomButton>`,
      options: [{styledComponents: ['CustomButton']}],
    },

    // Valid: Custom component with sx prop imported from styled-react
    {
      code: `import { CustomButton } from '@primer/styled-react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      options: [{styledComponents: ['CustomButton']}],
    },

    // Valid: Box not in custom list, so sx usage is allowed from @primer/react
    {
      code: `import { Box } from '@primer/react'
             const Component = () => <Box sx={{ color: 'red' }}>Content</Box>`,
      options: [{styledComponents: ['CustomButton']}], // Box not included
    },
  ],
  invalid: [
    // Invalid: Custom component with sx prop should be from styled-react
    {
      code: `import { CustomButton } from '@primer/react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      output: `import { CustomButton } from '@primer/styled-react'
             const Component = () => <CustomButton sx={{ color: 'red' }}>Click me</CustomButton>`,
      options: [{styledComponents: ['CustomButton']}],
      errors: [
        {
          messageId: 'useStyledReactImport',
          data: {componentName: 'CustomButton'},
        },
      ],
    },
    // Invalid: Custom utility should be from styled-react
    {
      code: `import { customSx } from '@primer/react'`,
      output: `import { customSx } from '@primer/styled-react'`,
      options: [{styledUtilities: ['customSx']}],
      errors: [
        {
          messageId: 'moveToStyledReact',
          data: {importName: 'customSx'},
        },
      ],
    },
  ],
})
