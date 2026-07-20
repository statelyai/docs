---
title: "@statelyai/sdk"
description: "The public alpha SDK for embedding the Stately visual editor, inspecting live actor systems, and using the Stately Studio API."
sourcePath: "packages/sdk/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/sdk/docs/index.md"
---

The public alpha SDK for embedding the Stately visual editor, inspecting live
actor systems, and using the Stately Studio API.

APIs may change between minor releases. Review generated source changes before
committing them.

## Install



```bash
npm install @statelyai/sdk
```

## Capabilities

### Embeddable editor



Drop a fully interactive state machine editor into any web app. The embed communicates over `postMessage` and gives you full control over theme, layout, panels, read-only mode, and more.

```ts
import { createStatelyEmbed } from '@statelyai/sdk';

const embed = createStatelyEmbed({
  baseUrl: 'https://editor.stately.ai',
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

Restrict an embed by passing a resolved access policy:



```ts
embed.init({
  machine: myMachineConfig,
  mode: 'viewing',
  readOnly: true,
  readOnlyReason: 'free-plan',
  capabilities: {
    edit: false,
    export: false,
    ai: false,
    simulate: false,
    navigateHierarchy: false,
    maxDepth: 1,
    panels: ['structure', 'details', 'validations'],
  },
});

embed.on('capabilityDenied', (event) => {
  console.warn(event.message);
});
```

`readOnlyReason: 'free-plan'` shows a persistent **Upgrade to edit** action.
Use `access-unverified` when reopening or signing in, rather than upgrading, is
the appropriate recovery action.

Key capabilities:

- **Mount or attach** to any container element or existing iframe
- **Two-way sync** - push machine configs in, get changes and saves back via event callbacks
- **Export** to multiple formats: XState v5, XState JSON, Mermaid, Redux, Zustand, ASL, SCXML, and more
- **Access policies** for read-only, no-export, no-AI, shallow-viewer embeds
- **Comments** via Liveblocks integration (optional)
- **Asset uploads** with built-in S3 and Supabase adapters, or bring your own upload handler
- **Runtime settings** - toggle color mode, grid, snap lines, autolayout, and view mode on the fly

### Self-hosting



The SDK works with both the hosted Stately editor (`editor.stately.ai`) and
self-hosted deployments.

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
| `NEXT_PUBLIC_BASE_URL`      | Public-facing editor URL                     |

### Studio API client

Programmatic access to Stately Studio for managing projects and machines, extracting machine configs from source code, and verifying API keys.

```ts
import { createStatelyClient } from '@statelyai/sdk';

const studio = createStatelyClient({
  credential: {
    type: 'oauth',
    accessToken: process.env.STATELY_ACCESS_TOKEN!,
  },
});

const projects = await studio.projects.list();
const machine = await studio.machines.get('machine-id');
const extracted = await studio.code.extractMachines(sourceCode);
```

Legacy `apiKey` is still accepted as an alias for
`credential: { type: 'api_key', token }`. Use `authMode: 'none'` only for
self-hosted deployments that intentionally accept unauthenticated calls.

### Inspector



Stream live actor-system state to the Stately inspector over WebSockets, with support for automatic XState actor adoption and manual actor registration.

```ts
import { createActor } from 'xstate';
import { createInspector } from '@statelyai/sdk';

const actor = createActor(machine);
const inspector = createInspector({
  url: 'ws://localhost:4242',
});

inspector.inspect(actor);
actor.start();
```

XState v5 and v6 inspection events normalize to actor, transition, and stop
events before crossing the WebSocket protocol.
In Node, the inspector opens in the default browser automatically. The SDK
generates a cryptographically random session capability; hosted inspectors send
signed-out users through OAuth and return them to that same live session. The
Node process does not need a Stately API key.

### CLI and sync



The separate [`statelyai`](https://www.npmjs.com/package/statelyai) CLI syncs
local XState source files with Stately Studio projects: push local machines,
pull remote changes, and open a local file in a browser-backed visual editor
session.

```bash
npx statelyai push
npx statelyai pull
npx statelyai open ./checkout.machine.ts
```

### Graph and codegen helpers

Convert between Studio graph data, XState machine configs, and TypeScript source. Generate types from JSON Schema.

## Support

For pricing and self-hosting details, contact
[team@stately.ai](mailto:team@stately.ai).
