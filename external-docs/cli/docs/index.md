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

If you have an older `statelyai.json` that still uses the legacy `sources` shape, the CLI will rewrite simple single-source configs automatically when it reads them.

That writes a `statelyai.json` like:

```json
{
  "$schema": "https://stately.ai/schemas/statelyai.json",
  "version": "1.0.0",
  "projectId": "project_123",
  "studioUrl": "https://stately.ai",
  "defaultXStateVersion": 5,
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.*", "**/*.spec.*"],
  "newMachinesDir": "src"
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

6. Pull remote changes back into linked local files and create new local files for remote-only project machines when `newMachinesDir` is configured:

```bash
statelyai pull
```

`pull` skips locally modified linked files unless you pass `--force`. New remote-only machines are written as `<machine-name>.machine.ts` inside `newMachinesDir`.

Run it without installing it globally:

```bash
npx statelyai --help
```
