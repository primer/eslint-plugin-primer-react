const rule = require('../non-interactive-tooltip-trigger')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
})

ruleTester.run('non-interactive-tooltip-trigger', rule, {
  valid: [
    `import {Tooltip, Button} from '@primer/react';<Tooltip aria-label="Filter vegetarian options" direction="e"><Button>🥦</Button></Tooltip>`,
    `import {Tooltip, Button} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><Button>Save</Button></Tooltip>`,
    `import {Tooltip, IconButton} from '@primer/react';import {SearchIcon} from '@primer/octicons-react';<Tooltip aria-label="Supplementary text" direction="e"><IconButton icon={SearchIcon} aria-label="Search" /></Tooltip>`,
    `import {Tooltip, Button} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><div><Button>Save</Button></div></Tooltip>`,
    `import {Tooltip, Button} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><div><a href="https://gthub.com">Save</a></div></Tooltip>`,
    `import {Tooltip} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><a href="https://github.com">see commit message</a></Tooltip>`
  ],
  invalid: [
    {
      code: `import {Tooltip} from '@primer/react';<Tooltip type="description" text="supportive text" direction="e"><button>save</button><button>cancel</button></Tooltip>`,
      errors: [
        {
          messageId: 'singleChild'
        }
      ]
    },
    {
      code: `import {Tooltip} from '@primer/react';<Tooltip aria-label="Filter vegetarian options" direction="e"><span>non interactive element</span></Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger'
        }
      ]
    },
    {
      code: `import {Tooltip, Button} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><h1>Save</h1></Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger'
        }
      ]
    },
    {
      code: `import {Tooltip} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><a>see commit message</a></Tooltip>`,
      errors: [
        {
          messageId: 'anchorTagWithoutHref'
        }
      ]
    },
    {
      code: `import {Tooltip} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><input type="hidden" /></Tooltip>`,
      errors: [
        {
          messageId: 'hiddenInput'
        }
      ]
    },
    {
      code: `import {Tooltip, Button} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><heading><span>Save</span></heading></Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger'
        }
      ]
    },
    {
      code: `import {Tooltip, Button} from '@primer/react';<Tooltip aria-label="Supplementary text" direction="e"><h1><a>Save</a></h1></Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger'
        }
      ]
    }
  ]
})