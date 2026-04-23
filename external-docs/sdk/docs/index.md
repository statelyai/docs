---
title: "@statelyai/sdk"
description: "Embed the Stately editor, inspect running actor systems over WebSockets, talk to the Stately Studio API, and convert between Studio graph data and code. Fully typed."
sourcePath: "packages/sdk/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/sdk/docs/index.md"
---

<!-- package.json#name and #description — top-level summary -->

Embed the [Stately editor](https://stately.ai), inspect running actor systems over WebSockets, talk to the Stately Studio API, and convert between Studio graph data and code. Fully typed.

## Install

<!-- install command derived from package.json#name -->

```bash
npm install @statelyai/sdk
```

## What It Includes

<!-- top-level runtime exports from src/index.ts and CLI bin from package.json#bin -->

- `createStatelyEmbed()` for browser embeds backed by `postMessage`
- `createStatelyInspector()` for inspecting live actor systems over WebSockets
- `createStatelyClient()` for Stately Studio API access
- graph conversion and codegen helpers such as `fromStudioMachine()`, `toStudioMachine()`, `graphToMachineConfig()`, and `graphToXStateTS()`
- sync helpers under `@statelyai/sdk/sync` and a `statelyai` CLI binary

## Authentication

The embed supports three common deployment models:

- Hosted Stately: pass an API key to `createStatelyEmbed()`
- Same-origin deployments: rely on the host application's session/cookie auth
- Self-hosted deployments: configure auth in the editor server and omit `apiKey` when no token is required

### With Stately (default)

An API key is required. To get one:

1. Go to your [Stately settings](https://stately.ai/settings)
2. Select the **API Key** tab
3. Click **Create API Key** (Project or Account scope)
4. Copy and store it securely

See the [Studio API docs](https://stately.ai/docs/studio-api) for more details.

Pass the key to the SDK:

```ts
const embed = createStatelyEmbed({
  baseUrl: 'https://stately.ai',
  apiKey: 'your-api-key',
});
```

### Same-origin embed (cookie auth)

When the embed host and the editor share a domain, you can omit `apiKey` and rely on the host application's auth/session layer:

```ts
const embed = createStatelyEmbed({
  baseUrl: process.env.NEXT_PUBLIC_BETA_EDITOR_URL ?? window.location.origin,
});
```

### Self-hosting

When self-hosting the editor, authentication is enforced by the editor server, not by this npm package.

The common environment variables are:

| Variable | Purpose |
| --- | --- |
| `AUTH_PROVIDER` | Auth strategy used by the editor host |
| `EDITOR_SYNC_AUTH_REQUIRED` | Set to `false` to disable API-key checks for editor-sync endpoints only |
| `STATELY_API_KEY` | Server-side API key for Stately data fetching |
| `STATELY_API_URL` | Stately API base URL override |
| `NEXT_PUBLIC_BASE_URL` | Public-facing editor URL |

For a fully self-contained deployment with no auth, omit `apiKey` in the SDK and configure the host/editor to allow unauthenticated access:

```ts
const embed = createStatelyEmbed({
  baseUrl: 'https://your-editor.example.com',
});
```

## Quick Start

### Third-party embed (with API key)

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

### Comments

Comments are optional and integrator-configured. Pass a `comments` object to `embed.init()` when you want Liveblocks-backed commenting enabled.

```ts
embed.init({
  machine: machineConfig,
  mode: 'editing',
  comments: {
    roomId: 'machine:checkout',
    publicApiKey: 'pk_live_...',
    userId: currentUserId ?? null,
  },
});
```

You can also use a custom auth endpoint instead of a public key:

```ts
embed.init({
  machine: machineConfig,
  comments: {
    roomId: 'machine:checkout',
    authEndpoint: '/api/liveblocks-auth',
    userId: currentUserId ?? null,
  },
});
```

`roomId` is required when comments are enabled. `userId` is optional and only used for comment identity metadata.

## Module Layout

<!-- subpath imports derived from package.json#exports -->

The SDK ships root exports for the most common entry points and helpers:

```ts
import {
  createStatelyClient,
  createStatelyEmbed,
  createStatelyInspector,
  fromStudioMachine,
  graphToMachineConfig,
  graphToXStateTS,
  toStudioMachine,
} from '@statelyai/sdk';
```

It also supports narrower subpath imports:

```ts
import { createStatelyClient } from '@statelyai/sdk/studio';
import { createStatelyInspector } from '@statelyai/sdk/inspect';
import { createStatelyEmbed } from '@statelyai/sdk/embed';
import { fromStudioMachine, toStudioMachine } from '@statelyai/sdk/graph';
import { planSync, pullSync } from '@statelyai/sdk/sync';
import type { GraphPatch } from '@statelyai/sdk/patchTypes';
```

## Studio API Client

```ts
import { createStatelyClient } from '@statelyai/sdk';

const studio = createStatelyClient({
  apiKey: process.env.STATELY_API_KEY,
});

const project = await studio.projects.get('project-id');
const machine = await studio.machines.get('machine-id', { version: '42' });
const extracted = await studio.code.extractMachines(sourceCode);
```

<!-- public methods of StudioClient from src/studio.ts -->

Available client methods:

| Method | Description |
| --- | --- |
| `studio.auth.verify(apiKey?)` | Verify an API key against the registry API |
| `studio.projects.get(projectId)` | Fetch a project and its machines |
| `studio.machines.get(machineId, { version? })` | Fetch a machine, optionally pinned to a version |
| `studio.code.extractMachines(code, { apiKey? })` | Extract machine configs from source text |

## Inspector

<!-- public API of createStatelyInspector from src/inspect.ts -->

`createStatelyInspector()` streams actor-system state to the Stately inspector over WebSockets. It supports both automatic XState actor adoption and manual actor registration.

```ts
import { createActor } from 'xstate';
import { createStatelyInspector } from '@statelyai/sdk';

const actor = createActor(machine);
const inspector = createStatelyInspector({
  actor,
  url: 'ws://localhost:4242',
  autoOpen: true,
});

actor.start();
```

Key options:

| Option | Description |
| --- | --- |
| `actor` | Root actor to adopt and inspect automatically |
| `url` | Devtools relay URL. Defaults to `ws://localhost:4242` |
| `autoOpen` | Whether to ask the relay to open the inspector UI |
| `sessionId` | Override the relay session id |
| `name` | Display name shown to the inspector |
| `serializeSnapshot` | Customize snapshot serialization before sending it over the wire |
| `extractMachineConfig` | Customize how machine config is derived from an actor |
| `selectedActorId` | Focus a specific actor first |
| `panels`, `theme`, `readOnly`, `depth` | Initial inspector UI options |
| `transport` | Inject an existing transport instead of opening a new WebSocket |

Key methods:

- `inspector.export(format, options?)`
- `inspector.actor(id, options?)`
- `inspector.snapshot(actorId, snapshot, event?)`
- `inspector.event(actorId, event, { source? })`
- `inspector.stop(actorId)`
- `inspector.destroy()`

## Embed API

### `createStatelyEmbed(options)`

Creates an embed instance.

<!-- public options of StatelyEmbedOptions from src/embed.ts -->

| Option | Type | Description |
| --- | --- | --- |
| `baseUrl` | `string` | **Required.** Base URL of the Stately app |
| `apiKey` | `string` | API key for hosted Stately deployments |
| `origin` | `string` | Optional strict target origin for `postMessage`; defaults to permissive wildcard messaging for local/self-hosted testing |
| `assets` | `AssetConfig` | Asset upload configuration |
| `onReady` | `() => void` | Called when the embed is ready |
| `onLoaded` | `(graph) => void` | Called when a machine is loaded |
| `onChange` | `(graph, machineConfig) => void` | Called on every change |
| `onSave` | `(graph, machineConfig) => void` | Called on save |
| `onError` | `({ code, message }) => void` | Called when the embed reports an error |

### Embed methods

#### `embed.mount(container)` / `embed.attach(iframe)`

`mount()` creates an iframe inside a container element. `attach()` connects to an existing iframe.

```ts
const iframe = embed.mount(document.getElementById('editor')!);

embed.attach(document.querySelector('iframe')!);
```

#### `embed.init(options)`

Initialize the embed with a machine and display options.

```ts
embed.init({
  machine: machineConfig,
  format: 'xstate',
  mode: 'editing',
  theme: 'dark',
  readOnly: false,
  depth: 3,
  panels: {
    leftPanels: ['code'],
    rightPanels: ['events'],
    activePanels: ['code'],
  },
  unsavedIndicator: {
    enabled: true,
    mode: 'structural',
  },
  comments: {
    roomId: 'machine:checkout',
    publicApiKey: 'pk_live_...',
  },
});
```

`comments` accepts:

| Field | Type | Description |
| --- | --- | --- |
| `roomId` | `string` | **Required.** Liveblocks room identifier |
| `publicApiKey` | `string` | Liveblocks public key |
| `authEndpoint` | `string` | Custom Liveblocks auth endpoint |
| `baseUrl` | `string` | Custom Liveblocks base URL for self-hosting |
| `userId` | `string \| null` | Optional user identity metadata |

`unsavedIndicator` accepts:

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | `boolean` | Show the persistent "Save to apply" pill |
| `mode` | `'structural' \| 'all'` | Track only structural graph edits or all edits |

#### `embed.updateMachine(machine, format?)`

Update the displayed machine.

#### `embed.setMode(mode)` / `embed.setTheme(theme)`

Change the embed mode or theme at runtime.

#### `embed.setSettings(settings)`

Update editor settings at runtime. Settings are merged with the existing editor settings.

```ts
embed.setSettings({
  appearance: { colorMode: 'light' },
  canvas: { showGrid: false },
});
```

Available core settings:

| Path | Type | Default |
| --- | --- | --- |
| `appearance.colorMode` | `'light' \| 'dark' \| 'system'` | `'dark'` |
| `canvas.showGrid` | `boolean` | `true` |
| `canvas.viewMode` | `'graph' \| 'list'` | `'graph'` |
| `canvas.enableSnapLines` | `boolean` | `true` |
| `canvas.dimUnselected` | `boolean` | `true` |
| `validation.showValidations` | `boolean` | `true` |
| `autolayout.autoEnabled` | `boolean` | `false` |
| `developer.devMode` | `boolean` | `false` |

#### `embed.export(format, options?)`

Export the current machine. Returns a promise.

```ts
const xstateCode = await embed.export('xstate', { version: 5 });
const digraph = await embed.export('digraph');
const rtk = await embed.export('rtk');
const aslYaml = await embed.export('asl-yaml');
```

<!-- supported export formats from ExportFormatMap in src/protocol.ts -->

Supported formats: `xstate`, `json`, `digraph`, `mermaid`, `rtk`, `zustand`, `asl-json`, `asl-yaml`, `scxml`

#### `embed.on(event, handler)` / `embed.off(event, handler)`

<!-- keys of EmbedEventMap in src/protocol.ts -->

Event names are `ready`, `loaded`, `change`, `save`, `error`, and `snapshot`.

`createStatelyEmbed()` emits `ready`, `loaded`, `change`, `save`, and `error` for browser embeds:

```ts
embed.on('change', ({ graph, machineConfig, patches }) => {
  console.log('Machine changed', graph, machineConfig, patches);
});

embed.on('save', ({ validations }) => {
  console.log('Save validations', validations);
});
```

#### `embed.toast(message, type?)`

Show a toast notification in the embed. Type: `'success' | 'error' | 'info' | 'warning'`

#### `embed.destroy()`

Tear down the embed. Removes listeners, rejects pending promises, and removes the iframe if it was created via `mount()`.

### Asset uploads

By default, dropped files are stored as base64 data URLs. To upload assets to your own storage, pass an `assets` config:

```ts
const embed = createStatelyEmbed({
  baseUrl: 'https://stately.ai',
  assets: {
    onUploadRequest: async (file, { stateNodeId }) => {
      return { url: await uploadToStorage(file, stateNodeId) };
    },
    accept: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
  },
});
```

| Option | Type | Description |
| --- | --- | --- |
| `onUploadRequest` | `(file: File, context: { stateNodeId: string }) => Promise<UploadResult>` | **Required.** Called when the editor needs to upload a file |
| `accept` | `string[]` | Accepted MIME types. Supports wildcards like `image/*` |
| `maxFileSize` | `number` | Max file size in bytes. Defaults to `10_485_760` |

`UploadResult`:

```ts
interface UploadResult {
  url: string;
  name?: string;
  metadata?: Record<string, unknown>;
}
```

If `onUploadRequest` throws or rejects, the editor shows an error toast. If no `assets` config is provided, files are stored inline and no upload request is sent.

## Graph And Codegen Helpers

<!-- root helper exports from src/index.ts -->

Use the conversion helpers to move between Studio digraph data, generic Stately graphs, machine config objects, and XState TypeScript source.

```ts
import {
  fromStudioMachine,
  graphToMachineConfig,
  graphToXStateTS,
  toStudioMachine,
} from '@statelyai/sdk';

const graph = fromStudioMachine(studioMachine);
const machineConfig = graphToMachineConfig(graph, {
  showDescriptions: true,
  showMeta: true,
});
const source = graphToXStateTS(graph, {
  exportStyle: 'named',
});
const digraph = toStudioMachine(graph);
```

Other exported helpers:

- `studioMachineConverter` for reusable format conversion
- `serializeJS()`, `raw()`, and `RawCode` for emitting JavaScript source
- `jsonSchemaToTSType()`, `contextSchemaToTSType()`, and `eventsSchemaToTSType()` for generating inline TypeScript types from JSON Schema
- `GraphPatch` and `ActionLocation` types from `@statelyai/sdk/patchTypes`

## Sync Helpers And CLI

<!-- sync helpers from src/sync.ts and CLI commands from src/cli.ts#COMMANDS -->

The sync helpers compare or materialize machines across local files, Stately machine IDs, and Stately URLs.

Programmatic usage:

```ts
import { planSync, pullSync } from '@statelyai/sdk/sync';

const plan = await planSync({
  source: './checkout.machine.ts',
  target: 'machine-id',
  apiKey: process.env.STATELY_API_KEY,
});

if (plan.summary.hasChanges) {
  console.log(plan.summary);
}

await pullSync({
  source: 'machine-id',
  target: './checkout.machine.ts',
  apiKey: process.env.STATELY_API_KEY,
});
```

Supported locators:

- local files
- Stately machine IDs
- full Stately machine URLs

Installing the package also exposes a `statelyai` binary:

```bash
npx statelyai open ./checkout.machine.ts

statelyai plan ./checkout.machine.ts machine-id
statelyai diff ./checkout.machine.ts machine-id --fail-on-changes
statelyai pull machine-id ./checkout.machine.ts
statelyai open ./checkout.machine.ts
```

For one-off use, `npx statelyai ...` installs the small `statelyai` CLI package, which delegates to this SDK CLI.

Available commands:

| Command | Description |
| --- | --- |
| `statelyai plan <source> <target>` | Print a semantic sync summary |
| `statelyai diff <source> <target>` | Diff two locators and optionally fail on changes |
| `statelyai pull <source> <target>` | Materialize a source into a local target file |
| `statelyai open <file>` | Open a local file in a browser-backed visual editor session |

Common flags:

- `--api-key` for remote machine resolution or editor servers that require auth
- `--base-url` for self-hosted or non-default Stately deployments
- `--fail-on-changes` to return a nonzero exit code when a diff is detected

`statelyai open` also supports `--api-key`, `--editor-url`, `--host`, `--port`, `--no-open`, and `--debug`. It watches the local file on disk and sends source snapshots to `/api/editor-sync/*` endpoints, which return the text replacements to apply locally. Pass `--api-key` or set `STATELY_API_KEY` when the editor server requires auth. Self-hosted servers can disable editor-sync API-key checks with `EDITOR_SYNC_AUTH_REQUIRED=false`. The private source reconciliation engine is not bundled into the published CLI.

## Transport Helpers

<!-- transport helpers exported from src/index.ts -->

For advanced integrations, the root package also exports:

- `createPostMessageTransport()` for iframe-based clients
- `createWebSocketTransport()` for relay-based integrations

These power the embed and inspector internals, but they are also available when you need lower-level control over the `@statelyai.*` protocol.
