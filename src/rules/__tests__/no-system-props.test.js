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
    `import {ProgressBar} from '@primer/components'; <ProgressBar bg="howdy" />`,
    `import {Button} from '@primer/components'; <Button {...someExpression()} />`
  ],
  invalid: [
    {
      code: `import {Button} from '@primer/components'; <Button width={200} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width="200" />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: "200"}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={"200"} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: "200"}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={myWidth} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: myWidth}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} height={100} />`,
      output: `import {Button} from '@primer/components'; <Button   sx={{width: 200, height: 100}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width, height', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} sx={{height: 200}} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{height: 200, width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} sx={{width: 300}} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{width: 300}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} sx={myStylez} />`,
      output: `import {Button} from '@primer/components'; <Button width={200} sx={myStylez} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Button} from '@primer/components'; <Button width={200} sx={{...partialStyles, width: 100}} />`,
      output: `import {Button} from '@primer/components'; <Button  sx={{...partialStyles, width: 100}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Button'}
        }
      ]
    },
    {
      code: `import {Label} from '@primer/components'; <Label width={200} outline />`,
      output: `import {Label} from '@primer/components'; <Label  outline sx={{width: 200}} />`,
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Label'}
        }
      ]
    },
    {
      code: `import {Box} from '@primer/components'; <Box width={200} />`,
      output: `import {Box} from '@primer/components'; <Box  sx={{width: 200}} />`,
      options: [{includeUtilityComponents: true}],
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Box'}
        }
      ]
    },
    {
      code: `import {Text} from '@primer/components'; <Text width={200} />`,
      output: `import {Text} from '@primer/components'; <Text  sx={{width: 200}} />`,
      options: [{includeUtilityComponents: true}],
      errors: [
        {
          messageId: 'noSystemProps',
          data: {propNames: 'width', componentName: 'Text'}
        }
      ]
    }
  ]
})
