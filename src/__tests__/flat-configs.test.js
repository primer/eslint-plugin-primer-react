const plugin = require('..')
const flatConfigs = plugin.getFlatConfigs()

describe('Recommended flat configuration', () => {
  const recommended = flatConfigs.recommended

  test('should have basic configuration', () => {
    expect(recommended.languageOptions).toBeDefined()
    expect(recommended.languageOptions.parserOptions).toBeDefined()
    expect(recommended.settings).toBeDefined()
  })

  test('should have primer-react plugin configured', () => {
    expect(recommended.plugins['primer-react']).toBeDefined()
  })

  test('should inherit github plugin configured', () => {
    expect(recommended.plugins).toHaveProperty('github')
  })

  describe('rules', () => {
    const primerRecommendedRules = [
      'direct-slot-children',
      'no-system-props',
      'a11y-tooltip-interactive-trigger',
      'new-color-css-vars',
      'a11y-explicit-heading',
      'no-deprecated-props',
      'a11y-remove-disable-tooltip',
      'a11y-use-accessible-tooltip',
      'no-unnecessary-components',
      'prefer-action-list-item-onselect',
      'enforce-css-module-identifier-casing',
      'enforce-css-module-default-import',
    ]

    test.each(primerRecommendedRules)('should include primer-react rule %s', ruleName => {
      expect(recommended.rules[`primer-react/${ruleName}`]).toBeDefined()
    })

    test('should include at least one rule starting with "github/"', () => {
      const hasGithubRule = Object.keys(recommended.rules).some(ruleName => ruleName.startsWith('github/'))
      expect(hasGithubRule).toBe(true)
    })
  })
})
