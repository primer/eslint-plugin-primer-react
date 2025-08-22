'use strict'

const {RuleTester} = require('eslint')
const rule = require('../no-deprecated-octicon')

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

ruleTester.run('no-deprecated-octicon', rule, {
  valid: [
    // Not an Octicon component
    {
      code: `import {Button} from '@primer/react'
export default function App() {
  return <Button>Click me</Button>
}`,
    },

    // Already using direct icon import
    {
      code: `import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <XIcon />
}`,
    },

    // Octicon without icon prop (edge case - can't transform)
    {
      code: `import {Octicon} from '@primer/react/deprecated'
export default function App() {
  return <Octicon />
}`,
    },
  ],

  invalid: [
    // Basic case: simple Octicon with icon prop
    {
      code: `import {Octicon} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <Octicon icon={XIcon} />
}`,
      output: `import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <XIcon />
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Octicon with additional props
    {
      code: `import {Octicon} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <Octicon icon={XIcon} size={16} className="test" />
}`,
      output: `import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <XIcon size={16} className="test" />
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Octicon with spread props
    {
      code: `import {Octicon} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  const props = { size: 16 }
  return <Octicon {...props} icon={XIcon} className="test" />
}`,
      output: `import {XIcon} from '@primer/octicons-react'
export default function App() {
  const props = { size: 16 }
  return <XIcon {...props} className="test" />
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Octicon with closing tag
    {
      code: `import {Octicon} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <Octicon icon={XIcon}>
    <span>Content</span>
  </Octicon>
}`,
      output: `import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <XIcon>
    <span>Content</span>
  </XIcon>
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Multiple Octicons
    {
      code: `import {Octicon} from '@primer/react/deprecated'
import {XIcon, CheckIcon} from '@primer/octicons-react'
export default function App() {
  return (
    <div>
      <Octicon icon={XIcon} />
      <Octicon icon={CheckIcon} size={24} />
    </div>
  )
}`,
      output: `import {XIcon, CheckIcon} from '@primer/octicons-react'
export default function App() {
  return (
    <div>
      <XIcon />
      <CheckIcon size={24} />
    </div>
  )
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Complex conditional case - now provides autofix
    {
      code: `import {Octicon} from '@primer/react/deprecated'
import {XIcon, CheckIcon} from '@primer/octicons-react'
export default function App() {
  return <Octicon icon={condition ? XIcon : CheckIcon} />
}`,
      output: `import {XIcon, CheckIcon} from '@primer/octicons-react'
export default function App() {
  return condition ? <XIcon /> : <CheckIcon />
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Complex conditional case with props - applies props to both components
    {
      code: `import {Octicon} from '@primer/react/deprecated'
import {XIcon, CheckIcon} from '@primer/octicons-react'
export default function App() {
  return <Octicon icon={condition ? XIcon : CheckIcon} size={16} className="test" />
}`,
      output: `import {XIcon, CheckIcon} from '@primer/octicons-react'
export default function App() {
  return condition ? <XIcon size={16} className="test" /> : <CheckIcon size={16} className="test" />
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Dynamic icon access - now provides autofix
    {
      code: `import {Octicon} from '@primer/react/deprecated'
export default function App() {
  const icons = { x: XIcon }
  return <Octicon icon={icons.x} />
}`,
      output: `export default function App() {
  const icons = { x: XIcon }
  return React.createElement(icons.x, {})
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Dynamic icon access with props
    {
      code: `import {Octicon} from '@primer/react/deprecated'
export default function App() {
  const icons = { x: XIcon }
  return <Octicon icon={icons.x} size={16} className="btn-icon" />
}`,
      output: `export default function App() {
  const icons = { x: XIcon }
  return React.createElement(icons.x, {size: 16, className: "btn-icon"})
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Test partial import removal - Octicon removed but other imports remain
    {
      code: `import {Octicon, Button} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <Octicon icon={XIcon} />
}`,
      output: `import {Button} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <XIcon />
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },

    // Test partial import removal - Octicon in middle of import list
    {
      code: `import {Button, Octicon, TextField} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <Octicon icon={XIcon} />
}`,
      output: `import {Button, TextField} from '@primer/react/deprecated'
import {XIcon} from '@primer/octicons-react'
export default function App() {
  return <XIcon />
}`,
      errors: [
        {
          messageId: 'replaceDeprecatedOcticon',
        },
      ],
    },
  ],
})
