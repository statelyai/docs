---
title: "@statelyai/sdk"
description: "Shared SDK modules for Stately clients, sync helpers, graph conversion, and code generation."
sourcePath: "packages/sdk/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/sdk/docs/index.md"
---

Shared SDK modules for Stately clients, sync helpers, graph conversion, and code generation.

The Stately CLI now lives in:

- `statelyai`

If you want the command-line workflow, use:

```bash
npx statelyai --help
```

This package is the programmatic dependency used by that CLI.

The broader in-progress package documentation draft is kept in:

- [README-next.md](https://github.com/statelyai/viz/blob/main/packages/sdk/README-next.md)

Published schemas:

- `@statelyai/sdk/statelyai.schema.json`
- `@statelyai/sdk/xstate.schema.json`

The CLI-facing `statelyai.json` schema now uses top-level `include` / `exclude` globs for local file discovery.
