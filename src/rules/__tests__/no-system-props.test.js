const rule = require('../no-system-props')
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

ruleTester.run('no-system-props', rule, {
  valid: [
    `import {Button} from '@primer/components'; <Button sx={{width: 200}} />`,
    `import {Button} from 'coles-cool-design-system'; <Button width={200} />`,
    `import {Button} from '@primer/components'; <Button someOtherProp="foo" />`,
    `import {Box} from '@primer/components'; <Box width={200} />`,
    `import {ProgressBar} from '@primer/components'; <ProgressBar bg="howdy" />`
  ],
  invalid: [
    {
      code: `import {Button} from '@primer/components'; <Button width={200} />`,
      output: `import {Button} from '@primer/components'; <Button sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width="200" />`,
      output: `import {Button} from '@primer/components'; <Button sx={{width: "200"}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={"200"} />`,
      output: `import {Button} from '@primer/components'; <Button sx={{width: "200"}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={myWidth} />`,
      output: `import {Button} from '@primer/components'; <Button sx={{width: myWidth}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} height={200} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: 200, height: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width, height'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} sx={{height: 200}} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: 200, height: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} sx={{width: 300}} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: 300}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} sx={myStylez} />`,
      output: `import {Button} from '@primer/components'; <Button width={200} sx={myStylez} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width'}
        }
      ]
    }
  ]
})
