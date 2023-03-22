---
"eslint-plugin-primer-react": patch
---

More `direct-slot-children` fixes:
- Fix bug related self-closing JSX tags
- Allow slot children to accept multiple parents (ex: `ActionList.Item` or `ActionList.LinkItem`)
- Add `SplitPageLayout` and `NavList` to the slot map
- Ignore `MarkdownEditor` because it's still a draft
