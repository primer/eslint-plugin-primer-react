'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-flash')

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

ruleTester.run('no-deprecated-flash', rule, {
  valid: [
    // Banner import and usage is valid
    {
      code: `import {Banner} from '@primer/react/experimental'
      
function Component() {
  return <Banner variant="warning">Content</Banner>
}`,
    },
    // Flash imported from other packages is valid
    {
      code: `import {Flash} from 'some-other-package'
      
function Component() {
  return <Flash>Content</Flash>
}`,
    },
    // No import of Flash
    {
      code: `import {Button} from '@primer/react'
      
function Component() {
  return <Button>Click me</Button>
}`,
    },
  ],
  invalid: [
    // Basic Flash import and usage
    {
      code: `import {Flash} from '@primer/react'

function Component() {
  return <Flash variant="warning">Banner content</Flash>
}`,
      output: `import {Banner} from '@primer/react/experimental'

function Component() {
  return <Banner variant="warning">Banner content</Banner>
}`,
      errors: [{messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}],
    },

    // Flash with complex props
    {
      code: `import {Flash} from '@primer/react'

function Component() {
  return (
    <Flash 
      variant="warning" 
      sx={{fontSize: 0, borderRadius: 0, py: 2, px: 3}}
      className="custom-class"
    >
      Banner content
    </Flash>
  )
}`,
      output: `import {Banner} from '@primer/react/experimental'

function Component() {
  return (
    <Banner 
      variant="warning" 
      sx={{fontSize: 0, borderRadius: 0, py: 2, px: 3}}
      className="custom-class"
    >
      Banner content
    </Banner>
  )
}`,
      errors: [{messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}],
    },

    // Mixed imports - Flash with other components
    {
      code: `import {Button, Flash, Text} from '@primer/react'

function Component() {
  return (
    <div>
      <Button>Click me</Button>
      <Flash variant="error">Error message</Flash>
      <Text>Some text</Text>
    </div>
  )
}`,
      output: `import {Button, Text} from '@primer/react'
import {Banner} from '@primer/react/experimental'

function Component() {
  return (
    <div>
      <Button>Click me</Button>
      <Banner variant="error">Error message</Banner>
      <Text>Some text</Text>
    </div>
  )
}`,
      errors: [{messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}],
    },

    // Flash only import
    {
      code: `import {Flash} from '@primer/react'

function Component() {
  return <Flash>Just Flash</Flash>
}`,
      output: `import {Banner} from '@primer/react/experimental'

function Component() {
  return <Banner>Just Flash</Banner>
}`,
      errors: [{messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}],
    },

    // Self-closing Flash
    {
      code: `import {Flash} from '@primer/react'

function Component() {
  return <Flash variant="info" />
}`,
      output: `import {Banner} from '@primer/react/experimental'

function Component() {
  return <Banner variant="info" />
}`,
      errors: [{messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}],
    },

    // Multiple Flash components
    {
      code: `import {Flash} from '@primer/react'

function Component() {
  return (
    <div>
      <Flash variant="warning">Warning</Flash>
      <Flash variant="error">Error</Flash>
    </div>
  )
}`,
      output: `import {Banner} from '@primer/react/experimental'

function Component() {
  return (
    <div>
      <Banner variant="warning">Warning</Banner>
      <Banner variant="error">Error</Banner>
    </div>
  )
}`,
      errors: [{messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}],
    },

    // Flash with existing Banner import (should not duplicate)
    {
      code: `import {Flash} from '@primer/react'
import {Banner} from '@primer/react/experimental'

function Component() {
  return (
    <div>
      <Flash variant="warning">Flash message</Flash>
      <Banner variant="info">Banner message</Banner>
    </div>
  )
}`,
      output: `import {Banner} from '@primer/react/experimental'

function Component() {
  return (
    <div>
      <Banner variant="warning">Flash message</Banner>
      <Banner variant="info">Banner message</Banner>
    </div>
  )
}`,
      errors: [{messageId: 'flashDeprecated'}, {messageId: 'flashDeprecated'}],
    },
  ],
})
