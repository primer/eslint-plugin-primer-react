const rule = require('../enforce-css-module-identifier-casing')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
})

ruleTester.run('enforce-css-module-identifier-casing', rule, {
  valid: [
    'import classes from "a.module.css"; function Foo() { return <Box className={classes.Foo}/> }',
    'import classes from "a.module.css"; function Foo() { return <Box className={clsx(classes.Foo)}/> }',
    'import classes from "a.module.css"; function Foo() { return <Box className={clsx(className, classes.Foo)}/> }',
    'import classes from "a.module.css"; function Foo() { return <Box className={`${classes.Foo}`}/> }',
    'import classes from "a.module.css"; function Foo() { return <Box className={`${classes["Foo"]}`}/> }',
    'import classes from "a.module.css"; let x = "Foo"; function Foo() { return <Box className={`${classes[x]}`}/> }',
  ],
  invalid: [
    {
      code: 'import classes from "a.module.css"; function Foo() { return <Box className={classes.foo}/> }',
      errors: [
        {
          messageId: 'pascal',
          data: {name: 'foo'},
        },
      ],
    },
    {
      code: 'import classes from "a.module.css"; function Foo() { return <Box className={clsx(classes.foo)}/> }',
      errors: [
        {
          messageId: 'pascal',
          data: {name: 'foo'},
        },
      ],
    },
    {
      code: 'import classes from "a.module.css"; function Foo() { return <Box className={clsx(className, classes.foo)}/> }',
      errors: [
        {
          messageId: 'pascal',
          data: {name: 'foo'},
        },
      ],
    },
    {
      code: 'import classes from "a.module.css"; function Foo() { return <Box className={`${classes.foo}`}/> }',
      errors: [
        {
          messageId: 'pascal',
          data: {name: 'foo'},
        },
      ],
    },
    {
      code: 'import classes from "a.module.css"; function Foo() { return <Box className={classes["foo"]}/> }',
      errors: [
        {
          messageId: 'pascal',
          data: {name: 'foo'},
        },
      ],
    },
    {
      code: 'import classes from "a.module.css"; function Foo() { return <Box className={classes.Foo}/> }',
      options: [{casing: 'camel'}],
      errors: [
        {
          messageId: 'camel',
          data: {name: 'Foo'},
        },
      ],
    },
    {
      code: 'import classes from "a.module.css"; let FooClass = "foo"; function Foo() { return <Box className={classes[FooClass]}/> }',
      errors: [
        {
          messageId: 'pascal',
          data: {name: 'foo'},
        },
      ],
    },
    {
      code: 'import classes from "a.module.css"; function Foo() { return <Box className={classes[x]}/> }',
      options: [{casing: 'camel'}],
      errors: [
        {
          messageId: 'bad',
          data: {type: 'Identifier'},
        },
      ],
    },
  ],
})
