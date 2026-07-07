---
'eslint-plugin-primer-react': minor
---

Remove plugin:github/react from src/configs/recommended.js to avoid silently depending on GitHub’s React config behavior.
Expand this package’s eslint peer dependency range to include ESLint ^10.0.0.
Update the lockfile to reflect the peer dependency change.
