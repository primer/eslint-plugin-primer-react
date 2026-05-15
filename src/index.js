import a11yExplicitHeading from './rules/a11y-explicit-heading.js'
import a11yLinkInTextBlock from './rules/a11y-link-in-text-block.js'
import a11yNoDuplicateFormLabels from './rules/a11y-no-duplicate-form-labels.js'
import a11yNoTitleUsage from './rules/a11y-no-title-usage.js'
import a11yRemoveDisableTooltip from './rules/a11y-remove-disable-tooltip.js'
import a11yTooltipInteractiveTrigger from './rules/a11y-tooltip-interactive-trigger.js'
import a11yUseAccessibleTooltip from './rules/a11y-use-accessible-tooltip.js'
import directSlotChildren from './rules/direct-slot-children.js'
import enforceButtonForLinkWithNoHref from './rules/enforce-button-for-link-with-no-href.js'
import enforceCssModuleDefaultImport from './rules/enforce-css-module-default-import.js'
import enforceCssModuleIdentifierCasing from './rules/enforce-css-module-identifier-casing.js'
import newColorCssVars from './rules/new-color-css-vars.js'
import noDeprecatedEntrypoints from './rules/no-deprecated-entrypoints.js'
import noDeprecatedExperimentalComponents from './rules/no-deprecated-experimental-components.js'
import noDeprecatedProps from './rules/no-deprecated-props.js'
import noSystemProps from './rules/no-system-props.js'
import noUnnecessaryComponents from './rules/no-unnecessary-components.js'
import noUseResponsiveValue from './rules/no-use-responsive-value.js'
import noWildcardImports from './rules/no-wildcard-imports.js'
import preferActionListItemOnselect from './rules/prefer-action-list-item-onselect.js'
import spreadPropsFirst from './rules/spread-props-first.js'
import useDeprecatedFromDeprecated from './rules/use-deprecated-from-deprecated.js'
import useStyledReactImport from './rules/use-styled-react-import.js'
import noDeprecatedOcticon from './rules/no-deprecated-octicon.js'
import recommended from './configs/recommended.js'

export default {
  rules: {
    'a11y-explicit-heading': a11yExplicitHeading,
    'a11y-link-in-text-block': a11yLinkInTextBlock,
    'a11y-no-duplicate-form-labels': a11yNoDuplicateFormLabels,
    'a11y-no-title-usage': a11yNoTitleUsage,
    'a11y-remove-disable-tooltip': a11yRemoveDisableTooltip,
    'a11y-tooltip-interactive-trigger': a11yTooltipInteractiveTrigger,
    'a11y-use-accessible-tooltip': a11yUseAccessibleTooltip,
    'direct-slot-children': directSlotChildren,
    'enforce-button-for-link-with-no-href': enforceButtonForLinkWithNoHref,
    'enforce-css-module-default-import': enforceCssModuleDefaultImport,
    'enforce-css-module-identifier-casing': enforceCssModuleIdentifierCasing,
    'new-color-css-vars': newColorCssVars,
    'no-deprecated-entrypoints': noDeprecatedEntrypoints,
    'no-deprecated-experimental-components': noDeprecatedExperimentalComponents,
    'no-deprecated-props': noDeprecatedProps,
    'no-system-props': noSystemProps,
    'no-unnecessary-components': noUnnecessaryComponents,
    'no-use-responsive-value': noUseResponsiveValue,
    'no-wildcard-imports': noWildcardImports,
    'prefer-action-list-item-onselect': preferActionListItemOnselect,
    'spread-props-first': spreadPropsFirst,
    'use-deprecated-from-deprecated': useDeprecatedFromDeprecated,
    'use-styled-react-import': useStyledReactImport,
    'no-deprecated-octicon': noDeprecatedOcticon,
  },
  configs: {
    recommended,
  },
}
