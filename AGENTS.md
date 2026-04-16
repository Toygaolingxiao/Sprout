<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Release Automation Policy

After completing any feature update or bug fix in this repository:

1. Validate changes (at least build success).
2. Auto-run release flow with version bump, commit, push, and deploy trigger.
3. Default command:

```bash
npm run release:auto -- --type patch --notes "<item1>|<item2>|<item3>"
```

Only skip this if the user explicitly says not to release yet.
