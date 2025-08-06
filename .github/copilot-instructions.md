# eslint-plugin-primer-react

ESLint plugin for Primer React components. This is a JavaScript-based ESLint plugin that provides rules for validating and auto-fixing Primer React component usage.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Setup

- Install Node.js v18+ (currently works with v20+):
  - Check version: `node --version && npm --version`
- Install dependencies: `npm ci` -- takes 60 seconds. Set timeout to 90+ seconds.
- **NO BUILD STEP REQUIRED** - This is a direct JavaScript project with main entry at `src/index.js`

### Development Commands

- Run tests: `npm test` -- takes 5 seconds. Fast, no long timeout needed.
- Run linting: `npm run lint` -- takes 1.5 seconds. Very fast.
- Run markdown linting: `npm run lint:md` -- takes under 1 second. Very fast.
- Check formatting: `npm run format:check` -- takes 0.5 seconds. Very fast.
- Fix formatting: `npm run format` -- applies Prettier formatting fixes.

### Testing and Validation

- **ALWAYS** run `npm test` after making changes to rules - tests run in 5 seconds
- **ALWAYS** run `npm run lint && npm run lint:md` before committing - both complete in under 3 seconds total
- **ALWAYS** run `npm run format:check` to verify formatting - completes in 0.5 seconds
- All validation commands are very fast - no need for long timeouts or cancellation warnings

### Manual Rule Testing

You can manually test individual rules using this pattern:

```bash
node -e "
const rule = require('./src/rules/RULE_NAME');
const {RuleTester} = require('eslint');
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  }
});
ruleTester.run('test', rule, {
  valid: [{ code: 'VALID_CODE_HERE' }],
  invalid: [{ code: 'INVALID_CODE_HERE', errors: [{ messageId: 'MESSAGE_ID' }] }]
});
"
```

## Repository Structure and Navigation

### Key Directories

- `src/rules/` - ESLint rule implementations
- `src/rules/__tests__/` - Jest tests for each rule using ESLint RuleTester
- `docs/rules/` - Markdown documentation for each rule
- `src/configs/` - ESLint configuration presets (e.g., recommended.js)
- `src/utils/` - Utility functions shared across rules
- `.github/workflows/` - CI pipeline definitions

### Important Files

- `src/index.js` - Main entry point, exports all rules and configs
- `package.json` - Scripts and dependencies (no build scripts needed)
- `jest.config.js` - Jest test configuration
- `.eslintrc.js` - ESLint configuration for the project itself
- `.nvmrc` - Node.js version specification (v18)

### Rule Development Pattern

Each rule follows this structure:

1. Rule implementation: `src/rules/rule-name.js`
2. Test file: `src/rules/__tests__/rule-name.test.js`
3. Documentation: `docs/rules/rule-name.md`
4. Export from: `src/index.js` (add to rules object)
5. Optional: Add to `src/configs/recommended.js` if should be in recommended preset

## Validation Scenarios

### After Making Rule Changes

1. Run the rule's specific test: `npm test -- --testNamePattern="rule-name"`
2. Run all tests: `npm test` (5 seconds)
3. Test the rule manually using the Node.js snippet pattern above
4. Verify the rule is exported properly from `src/index.js`

### Before Committing

1. `npm run lint` - JavaScript linting (1.5 seconds)
2. `npm run lint:md` - Markdown linting (<1 second)
3. `npm run format:check` - Formatting validation (0.5 seconds)
4. `npm test` - Full test suite (5 seconds)

### Testing Plugin Integration

The plugin can be tested by:

1. Using manual Node.js rule testing (shown above)
2. Running existing test suite which validates all rules
3. Creating test files and using ESLint RuleTester in the **tests** files

## Common Development Tasks

### Adding a New Rule

1. Create rule implementation: `src/rules/new-rule-name.js`
2. Create test file: `src/rules/__tests__/new-rule-name.test.js`
3. Add to exports in `src/index.js`
4. Create documentation: `docs/rules/new-rule-name.md`
5. Optionally add to `src/configs/recommended.js`
6. Run tests: `npm test`
7. Run linting: `npm run lint`

### Modifying Existing Rules

1. Edit rule in `src/rules/rule-name.js`
2. Update tests in `src/rules/__tests__/rule-name.test.js`
3. Update documentation in `docs/rules/rule-name.md` if needed
4. Run tests: `npm test`
5. Test manually using Node.js snippet if needed

### Working with Changesets (for releases)

- `npx changeset` - Create a changeset for changes
- `npx changeset status` - Check changeset status
- Changesets are used for versioning and publishing to npm

## Troubleshooting

### Common Issues

- **Node.js version**: Use Node.js v18+ (v20+ works fine)
- **Dependencies**: Always use `npm ci` instead of `npm install` for consistent installs
- **Test failures**: Run `npm test` to see specific failures - tests are fast and detailed
- **Lint failures**: Run `npm run lint` and `npm run lint:md` to see specific issues
- **Format issues**: Run `npm run format` to auto-fix formatting

### Rule Testing Issues

- Use the RuleTester pattern shown above for manual testing
- Check that messageId in tests matches the rule's meta.messages
- Verify JSX parsing works by including ecmaFeatures.jsx in parserOptions

## Command Reference

Essential commands and their typical execution times:

- `npm ci` - Install dependencies (60 seconds)
- `npm test` - Run all tests (5 seconds)
- `npm run lint` - Lint JavaScript (1.5 seconds)
- `npm run lint:md` - Lint Markdown (<1 second)
- `npm run format:check` - Check formatting (0.5 seconds)
- `npm run format` - Fix formatting (similar time)

All commands except `npm ci` are very fast. No need for extended timeouts or cancellation warnings on validation commands.
