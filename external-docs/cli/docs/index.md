---
title: "statelyai"
description: "CLI implementation for Stately."
sourcePath: "packages/cli/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/cli/docs/index.md"
---

CLI implementation for Stately.

This package contains the `statelyai` command implementation.


## Happy Path

1. Get an API key from [Stately API Key settings](https://stately.ai/registry/user/my-settings?tab=API+Key).
2. Log in once:

```bash
statelyai login
```

3. Initialize the current repo:

```bash
statelyai init
```

4. Optionally scan the repo and save suggested source globs:

```bash
statelyai init --scan
```

That writes a `statelyai.json` like:

```json
{
  "$schema": "https://stately.ai/schemas/statelyai.json",
  "version": "1.0.0",
  "projectId": "project_123",
  "studioUrl": "https://stately.ai",
  "defaultXStateVersion": 5,
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.*", "**/*.spec.*"]
}
```

5. Push local machines:

```bash
statelyai push
```

Preview what `push` would do without updating Studio or local files:

```bash
statelyai push --dry-run
```

If a saved `// @statelyai id=...` points to a deleted or inaccessible remote machine, `push` will prompt to relink the file as a new remote machine and replace the local id.

6. Pull remote changes back into linked local files:

```bash
statelyai pull
```

`pull` skips locally modified files unless you pass `--force`.

Run it without installing it globally:

```bash
npx statelyai --help
```
