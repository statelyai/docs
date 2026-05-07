---
title: "@statelyai/sdk"
description: "Preview this SDK is not yet publicly available. Reach out to team@stately.ai for early access."
sourcePath: "packages/sdk/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/sdk/docs/index.md"
---

> **Preview** -- this SDK is not yet publicly available. Reach out to [team@stately.ai](mailto:team@stately.ai) for early access.

The Stately SDK lets you embed the [Stately visual editor](https://stately.ai) directly into your own application, inspect live actor systems, and programmatically manage Stately Studio projects and machines.

## What's coming

### Embeddable editor

Drop a fully interactive state machine editor into any web app. The embed communicates over `postMessage` and gives you full control over theme, layout, panels, read-only mode, and more.

```ts
import { createStatelyEmbed } from '@statelyai/sdk';

const embed = createStatelyEmbed({
  baseUrl: 'https://stately.ai',
  apiKey: 'your-api-key',
});

embed.mount(document.getElementById('editor')!);

embed.init({
  machine: myMachineConfig,
  format: 'xstate',
  mode: 'editing',
  theme: 'dark',
});
```

Key capabilities:

- **Mount or attach** to any container element or existing iframe
- **Two-way sync** - push machine configs in, get changes and saves back via event callbacks
- **Export** to multiple formats: XState v5, XState JSON, Mermaid, Redux, Zustand, ASL, SCXML, and more
- **Comments** via Liveblocks integration (optional)
- **Asset uploads** with built-in S3 and Supabase adapters, or bring your own upload handler
- **Runtime settings** - toggle color mode, grid, snap lines, autolayout, and view mode on the fly

### Self-hosting

The SDK is designed to work with both hosted Stately (`stately.ai`) and self-hosted deployments of the editor.

When self-hosting, authentication is handled by your editor server, not by this npm package. The editor host supports configurable auth strategies, and you can disable API-key checks for editor-sync endpoints when running behind your own auth layer.

A fully self-contained deployment with no external auth looks like:

```ts
const embed = createStatelyEmbed({
  baseUrl: 'https://your-editor.example.com',
});
```

Key environment variables for self-hosted deployments:

| Variable                    | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| `AUTH_PROVIDER`             | Auth strategy used by the editor host        |
| `EDITOR_SYNC_AUTH_REQUIRED` | Set to `false` to skip editor-sync API-key checks |
| `STATELY_API_KEY`           | Server-side API key for Stately data fetching |
| `STATELY_API_URL`           | Stately API base URL override                |
| `NEXT_PUBLIC_BASE_URL`      | Public-facing editor URL                     |

### Studio API client

Programmatic access to Stately Studio for managing projects and machines, extracting machine configs from source code, and verifying API keys.

```ts
import { createStatelyClient } from '@statelyai/sdk';

const studio = createStatelyClient({
  apiKey: process.env.STATELY_API_KEY,
});

const projects = await studio.projects.list();
const machine = await studio.machines.get('machine-id');
const extracted = await studio.code.extractMachines(sourceCode);
```

### Inspector

Stream live actor-system state to the Stately inspector over WebSockets, with support for automatic XState actor adoption and manual actor registration.

```ts
import { createActor } from 'xstate';
import { createStatelyInspector } from '@statelyai/sdk';

const inspector = createStatelyInspector({
  actor: createActor(machine),
  autoOpen: true,
});
```

### CLI and sync

A `statelyai` CLI for syncing local XState source files with Stately Studio projects: push local machines to the cloud, pull remote changes back into source, and open a local file in a browser-backed visual editor session.

```bash
npx statelyai push
npx statelyai pull
npx statelyai open ./checkout.machine.ts
```

### Graph and codegen helpers

Convert between Studio graph data, XState machine configs, and TypeScript source. Generate types from JSON Schema.

## Get notified

This SDK and the embeddable editor are in active development. For early access, pricing, and self-hosting details, contact [team@stately.ai](mailto:team@stately.ai).
