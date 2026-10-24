## Rule Details

This rule reports known deprecated Primer React props, including compound components,
aliased named imports, and namespace imports. It does not require TypeScript type information.

The catalogue covers deprecated props from Primer's source annotations and component
metadata, including older props retained here to prevent their reintroduction.
Keep it in sync with `@deprecated` prop declarations and `deprecated: true` entries
in `packages/react/src/**/*.docs.json` in [primer/react](https://github.com/primer/react).
New deprecations require a catalogue update; they are not discovered automatically.

### Covered props

Unless noted otherwise, these components are imported from `@primer/react`.

| Component                                                    | Deprecated props                                               | Migration                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `ActionList.Group`                                           | `title`                                                        | Use `ActionList.GroupHeading`.                                           |
| `ActionList.Item`                                            | `as`                                                           | Use `ActionList.LinkItem` for links.                                     |
| `Button`, `LinkButton`, `ActionMenu.Button`                  | `leadingIcon`, `trailingIcon`                                  | Use `leadingVisual`, `trailingVisual`.                                   |
| `Autocomplete.Input`                                         | `openOnFocus`                                                  | Review whether opening on focus is needed; there is no replacement prop. |
| `Autocomplete.Overlay`                                       | `overlayProps`                                                 | Pass overlay props directly.                                             |
| `Banner`                                                     | `icon`                                                         | Use `leadingVisual`.                                                     |
| `CounterLabel`                                               | `scheme`                                                       | Use `variant`.                                                           |
| `IconButton`                                                 | `keyshortcuts`                                                 | Use `keybindingHint`.                                                    |
| `Link`                                                       | `hoverColor`                                                   | Use CSS.                                                                 |
| `PageLayout.Header`, `PageLayout.Pane`, `PageLayout.Footer`  | `dividerWhenNarrow`                                            | Use a responsive `divider` value.                                        |
| `PageLayout.Pane`                                            | `positionWhenNarrow`                                           | Use a responsive `position` value.                                       |
| `SegmentedControl.Button`                                    | `icon`, `leadingIcon`                                          | Use `leadingVisual`.                                                     |
| `SelectPanel`                                                | `footer`                                                       | Use `secondaryAction`.                                                   |
| `Spinner`                                                    | `aria-label`                                                   | Use `srText`.                                                            |
| `StateLabel`                                                 | `variant`                                                      | Use `size`.                                                              |
| `TextInput`, `TextInputWithTokens`, `Autocomplete.Input`     | `icon`, `contrast`, `variant`, `width`, `minWidth`, `maxWidth` | Use visual props, the default background, `size`, and CSS dimensions.    |
| `TextInput.Action`                                           | `children`, `variant`                                          | Use an icon-only action with the default invisible variant.              |
| `Textarea`                                                   | `contrast`                                                     | Use the default background.                                              |
| `ThemeProvider` (also from `@primer/react/next`)             | `preventSSRMismatch`                                           | Remove this no-op prop.                                                  |
| `UnderlineNav.Item`                                          | `icon`                                                         | Use `leadingVisual`.                                                     |
| `FilteredActionList.Input` from `@primer/react/experimental` | Same deprecated props as `TextInput`                           | Use the corresponding `TextInput` migrations.                            |
| `ActionList.Item` from `@primer/react/deprecated`            | `trailingIcon`, `trailingText`                                 | Use `trailingVisual`.                                                    |

The rule checks explicit JSX attributes and children of `TextInput.Action`.
It does not inspect prop spreads, nested configuration objects (such as `items`
or `textInputProps`), local wrappers, re-exports, or `React.createElement` calls.
Deprecated hooks, components, and context fields are outside this prop rule.

Import resolution prevents false positives for unrelated local components or
packages such as `@primer/react-brand`. Different entrypoints have separate
catalogues because they can export different APIs under the same name.

### Fixes

The existing `ActionList.Group.title` autofix is preserved for paired JSX tags
with safely convertible string or expression values. It also preserves import
aliases and JSX entities. Self-closing groups and boolean titles are reported
without a fix. Other deprecated props are reported without automatic changes:
their migrations may change behavior or require a different component.

### Examples

```jsx
/* eslint primer-react/no-deprecated-props: "error" */
import {Autocomplete as Completion} from '@primer/react'
import * as Primer from '@primer/react'

// Both are reported, even though the imports are renamed.
const input = <Completion.Input openOnFocus />
const banner = <Primer.Banner icon={InfoIcon} />
```

👎 Examples of **incorrect** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-props: "error" */
import {ActionList} from '@primer/react'

const App = () => (
  <ActionList>
    <ActionList.Group title="Group heading">
      <ActionList.Item>Item 1</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
```

👍 Examples of **correct** code for this rule:

```jsx
/* eslint primer-react/no-deprecated-props: "error" */
import {ActionList} from '@primer/react'

const App = () => (
  <ActionList>
    <ActionList.Group>
      <ActionList.GroupHeading as="h2">Group heading</ActionList.GroupHeading>
      <ActionList.Item>Item 1</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
```

```jsx
/* eslint primer-react/no-deprecated-props: "error" */
import {ActionList} from '@primer/react'

const App = () => (
  <ActionList role="lisbox">
    <ActionList.Group>
      <ActionList.GroupHeading>Group heading</ActionList.GroupHeading>
      <ActionList.Item>Item 1</ActionList.Item>
    </ActionList.Group>
  </ActionList>
)
```
