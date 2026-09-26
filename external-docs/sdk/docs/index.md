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
import { createStatelyEmbed } from "@statelyai/sdk";

const embed = createStatelyEmbed({
  baseUrl: "https://editor.stately.ai",
  apiKey: "your-api-key",
});

embed.mount(document.getElementById("editor")!);

embed.init({
  machine: myMachineConfig,
  format: "xstate",
  mode: "editing",
  theme: "dark",
  settings: { canvas: { viewMode: "list" } },
  documents: [
    { path: "README.md", content: "# How this workflow works" },
    { path: "src/machine.ts", content: machineSource },
  ],
  panels: [
    { id: "structure", position: "left", tab: true },
    { id: "details", position: "right", tab: true },
  ],
});
```

The embed `apiKey` is sent to the iframe over `postMessage` after the editor
handshake; it is not included in the iframe URL. Call `embed.setApiKey(token)`
when the host refreshes the access token.



For a Git-backed XState JSON or JSONC file, keep the exact blob text in the host.
On save, pass the edited graph and original blob text to the configured editor:

```ts
const plan = await embed.planSourceUpdate({
  source: { fileName: 'machines/checkout.jsonc', text: originalBlobText },
  nextGraph: savedGraph,
});
if (plan.status === 'changed') {
  // Commit plan.text only if the Git blob revision still matches the one read.
  // Advance originalBlobText and the host's graph baseline after commit succeeds.
}
if (plan.status === 'unsupported') console.warn(plan.reason);
```

JSON and JSONC contain one machine; omit `source.machineIndex` for this method.
The call returns the complete updated text, focused zero-based UTF-16
`edits`, and a semantic graph `diff`. The graph diff is not a Git patch; GitLab
constructs its merge-request diff from the committed text. The call does not
read or write Git. It requires the editor-sync endpoint on the editor at
`baseUrl`, an allowed API origin, and editor-sync write access. This one-file
method supports XState `.json` and `.jsonc` sources; imported TypeScript
definitions require the document-based Editor Sync parse/apply APIs.

Use `viewMode: 'list'` on `createStatelyEmbed` to add `?view=list` to the
iframe URL, or subscribe to `viewModeChanged` when the user switches views.

Custom profiles and formats can be supplied when the embed is created. Their
serializable manifests are sent to the iframe; detector, importer, exporter,
and validator implementations remain in the host and are called asynchronously.
RPC methods and payloads are validated before host code runs, and malformed
graphs returned by custom importers are rejected.
Use `defaultProfile` and `defaultFormat` to choose the initial custom pair.
Profile namespaced-data adaptation and migration hooks are in-process React
editor extensions and are intentionally omitted from iframe manifests.

The Get started launchpad is host-configurable. Pass serializable `examples` to
`embed.init()` (or the project equivalent) to show the Examples section; omit
the option or pass an empty array to keep it hidden. The editor does not ship a
default catalog, so self-hosted deployments can provide their own examples.



Automatic version capture is opt-in. Pass `versionAutoSave: { intervalMs }` to
the embed and handle `versionSaveRequested` to persist immutable snapshots in
the host, or omit it to keep versioning manual. Hosts with server-side
auto-versioning should choose one capture path per save.

Restrict an embed by passing a resolved access policy:



```ts
embed.init({
  machine: myMachineConfig,
  mode: "viewing",
  readOnly: true,
  readOnlyReason: "free-plan",
  capabilities: {
    edit: false,
    export: false,
    ai: false,
    simulate: false,
    maxDepth: 1,
    panels: ["structure", "details", "validations"],
  },
});

embed.on("capabilityDenied", (event) => {
  console.warn(event.message);
});
```

Hierarchy navigation is always available, including in read-only and
restricted embeds.

`readOnlyReason: 'free-plan'` shows a persistent **Upgrade to edit** action.
Use `access-unverified` when reopening or signing in, rather than upgrading, is
the appropriate recovery action.

### Editor host protocol



`@statelyai/sdk/editor-host-protocol` provides the versioned messages and types
used by editor hosts. The private `@statelyai/editor-sync` package coordinates
CLI and VS Code source editing. Application developers use the embed API below
without a TypeScript compiler or source writeback dependency.



Key capabilities:

- **Mount or attach** to any container element or existing iframe
- **Two-way sync** - push machine configs in, get changes and saves back via event callbacks
- **Draft-aware events** - change callbacks report the visible graph, even when a retained draft has a separate source baseline
- **Export** to multiple formats: XState v5, XState v6 alpha, XState JSON, Mermaid, Redux, Zustand, ASL, SCXML, and more
- **Access policies** for read-only, no-export, no-AI, shallow-viewer embeds
- **Reference documents** supplied as ordered, read-only Markdown, code, or text
- **Comments** via Liveblocks integration (optional)
- **Asset uploads** with built-in S3 and Supabase adapters, or bring your own upload handler
- **Runtime settings** - toggle color mode, grid, snap lines, and view mode on the fly
- **Automatic versions** - optionally request host-owned immutable snapshots at a configured interval

### Resource API client



Programmatic access to hosted Stately resources, credential verification, and
deterministic machine-config extraction.

```ts
import { createStatelyClient } from "@statelyai/sdk";

const studio = createStatelyClient({
  credential: {
    type: "oauth",
    accessToken: process.env.STATELY_ACCESS_TOKEN!,
  },
});

const projects = await studio.projects.list();
const machine = await studio.machines.get("machine-id");
const extracted = await studio.code.extractMachines({
  code: sourceCode,
});
```

Each extracted machine includes `machineIndex`, its zero-based source ordinal.
The ordinal remains stable when an earlier `createMachine` call cannot be
extracted.

The client namespaces map one-to-one onto the server-owned `/api/v1` contract:

| Method                                      | Operation                                             |
| ------------------------------------------- | ----------------------------------------------------- |
| `auth.verify()`                             | `GET /api/v1/auth/verify`                             |
| `projects.list()`                           | `GET /api/v1/projects`                                |
| `projects.create(input)`                    | `POST /api/v1/projects`                               |
| `projects.get(projectId)`                   | `GET /api/v1/projects/:projectId`                     |
| `projects.update(projectId, input)`         | `PATCH /api/v1/projects/:projectId`                   |
| `projects.delete(projectId)`                | `DELETE /api/v1/projects/:projectId`                  |
| `projects.listMachines(projectId)`          | `GET /api/v1/projects/:projectId/machines`            |
| `machines.create(input)`                    | `POST /api/v1/machines`                               |
| `machines.get(machineId)`                   | `GET /api/v1/machines/:machineId`                     |
| `machines.getVersion(machineId, versionId)` | `GET /api/v1/machines/:machineId/versions/:versionId` |
| `machines.update(machineId, input)`         | `PATCH /api/v1/machines/:machineId`                   |
| `code.extractMachines(input)`               | `POST /api/v1/code/extract-machines`                  |

`projects.ensure(input)` is a client workflow composed of `projects.list`,
`projects.get`, and `projects.create`, not a route.

`machines.get(machineId)` preserves the stored `definition` and also exposes a
public `graph` property when the server can provide a canonical XGraph.
Pass that record's `updatedAt` as `expectedUpdatedAt` to reject a stale machine
update atomically.

`baseUrl` defaults to `https://editor.stately.ai`. Do not target
`stately.ai/registry` directly: Registry URLs are deprecated for clients, and
the server reaches the Registry itself when it is configured to.

Failed requests reject with `StudioApiError`, carrying `status` plus the
canonical `code`, optional `issues`, and optional `retryable` flag. Codes are
`bad_request`, `unauthenticated`, `forbidden`, `not_found`, `conflict`,
`payload_too_large`, `rate_limited`, `capability_disabled`, `upstream_error`,
and `internal_error`. Deployments with no resource provider answer resource
calls with `capability_disabled`; code extraction remains available and infers
XState v5 or v6 structurally when the version is omitted.

Deprecated inputs from earlier versions still work and normalize before the
request is sent: `{ id }` update inputs, capitalized `visibility`, an omitted
or `4` machine-create `xstateVersion` (defaulting to `5`), `machines.get(id, { version })`,
`machines.createMany` (singular semantics: one machine in a single-element
array), and `code.extractMachines(code, options)`.

Legacy `apiKey` is still accepted as an alias for
`credential: { type: 'api_key', token }`. The default `authMode: 'auto'` sends
a credential when present and otherwise lets the server accept or reject an
unauthenticated request. Use `authMode: 'bearer'` to require a credential before
making requests, or `authMode: 'none'` to ignore a configured credential.
Resource operations always require a credential.

### Inspector



Stream live actor-system state to the hosted Stately inspector. Zero-config
inspection needs no API key or local relay.

Install `@statelyai/sdk` for inspection. Source editing and the TypeScript
compiler are confined to the private Editor Sync package. The Node relay's `ws`
peer is optional for other SDK users.

`selectedSessionId` takes the exact session id: `actor.sessionId` for runtime
actors (or your `resolveSessionId` result), and `${producerId}:${id}` for manual
actors. For example, with `producerId: 'demo'`, select `inspector.actor('root')`
using `selectedSessionId: 'demo:root'`. Do not add the viewer's room namespace.

```ts
import { createActor } from "xstate";
import { createInspector } from "@statelyai/sdk";

const inspector = createInspector();
const { inspect } = inspector;

const actor = createActor(machine, { inspect });
// With XState v6, the inspector shows this actor's graph before start().
actor.start();
```

Before `start()`, the XState v6 actor view has no active-state highlight. The
first runtime transition updates that same actor view. An initial error is
shown immediately, even if `start()` produces no transition.

The inspector also accepts read-only `documents`, panel configuration, initial
`viewMode`, and typed display `settings`. Use `selectActor(sessionId)`,
`setTheme(theme)`, `setViewMode(mode)`, and `setSettings(settings)` to control the
viewer without restarting inspection. `on('loaded', ...)` reports a usable
viewer separately from relay `ready`; `on('capabilityDenied', ...)` reports
blocked viewer actions. See [inspector controls](https://github.com/statelyai/viz/blob/main/docs/sdk/inspector.md#viewer-configuration-and-controls).

If you already have the actor reference, `inspector.attach(actor)` subscribes to
its system and backfills actors that are already running.

When authored source is available, return it from `extractMachine` so the
visualizer preserves executable guards, inputs, and outputs instead of only a
JSON-safe machine structure:

```ts
const inspector = createInspector({
  extractMachine: (actor) =>
    actor.logic === machine ? machineSource : actor.logic?.config,
});
```

Declare source or config before its first actor exists to pre-render the graph
and warm source conversion. The declaration is a hint; an actor's payload wins
when it differs. `inspector.machine()` replaces a declaration after init.

```ts
const inspector = createInspector({ machines: { root: machineSource } });
inspector.machine('root', updatedMachineSource);
```

Actor IDs are preserved exactly. Unnamed invocations can carry a separate
`displayName`, derived from the parent machine's resolved invocation declaration
(for example, `fetchPolicies · account.loading`). Explicit invocation IDs take
precedence. This is tested against XState v5 and v6; no generated-ID syntax is
assumed. Older producers and runtimes without matching metadata display their
original IDs. Hover an actor label in the viewer to see its runtime ID.
Actors without a machine state value show their snapshot status (Active, Done,
Error, or Stopped); “Awaiting snapshot” means no snapshot has arrived.



The default snapshot serializer includes state value, status, and active tags
when the runtime supplies them. Custom serializers should preserve `tags` as
a string array to show them in actor details.

For persisted actors, `resolveSessionId` can keep one producer-local identity
across sequential restore/resume incarnations. Generate a new id for a new
logical invocation, persist it beside the actor snapshot, and reuse it after
the previous incarnation has stopped. The same inspector may observe the
replacement runtime actor:

```ts
const inspector = createInspector({
  roomId: persistedInspectionRoomId,
  producerId: persistedInspectionProducerId,
  resolveSessionId: (actor, defaultSessionId, parentSessionId) =>
    parentSessionId ? `${parentSessionId}/${actor.id}` : persistedInspectionId,
});
```

A resume must reuse the same room id, producer id, and resolved session id. Keep
the room id private because it is the room's bearer capability. A new logical
invocation keeps the producer id but receives a new resolved session id. Active
owners reject collisions unless `sessionIdReuse: "always"` explicitly permits
replacement; late observations from a displaced actor are ignored.

The resolver's third argument is the parent's resolved id, so recreated child
actors can use stable paths instead of accumulating runtime session ids. IDs
must be unique along each parent-child path. Sibling actors may reuse one id
after its previous owner reaches `done`, `stopped`, or `error`; setting
`sessionIdReuse: "always"` also permits explicit replacement of an active
sibling. The displaced actor's later observations are ignored. Inspector
callback errors emit `on('error', ...)` with code `inspection_failed` and do not
interrupt the actor system.

To present a stopped request-scoped runtime as waiting for its next resume, map
its serialized status to a non-terminal value such as `suspended` in
`serializeSnapshot`. The raw terminal status still permits the next runtime
actor to rebind automatically.

Stopped actors remain in `inspector.actors` and in reconnect checkpoints, so
completed request-scoped runs stay available for inspection.

XState v5 and v6 inspection events normalize to independent actor, event,
snapshot, and stop observations before crossing the WebSocket protocol.
`actorId` is system-local. `sessionId` defaults to XState's runtime value and
may be producer-resolved. A room uses `producerId + sessionId` as the global
actor identity.
Observations captured before the first transport registration replay in order
after the initial actor-tree baseline. Reconnects use the latest checkpoint.
The SDK connects to `wss://sky.stately.ai`, logs the inspector URL, and does not
open a browser by default. Pass `launch: 'browser'` to open it explicitly from
Node. It generates a UUID v4 `?r=` room bearer capability. Multiple producers
and viewers can share that room. Anyone with the URL can inspect its data, so
keep it private. Hosted replay expires after 24
hours without activity. Only actor checkpoints and observations are replayed;
export traffic is live-only, and auth/upload/embed-control messages are rejected.
AI-backed features remain separately authenticated.
The relay keeps a complete current actor checkpoint while bounding recent
observation history, so joining after many actor registrations still initializes
the viewer.

After successful registration, hosted Sky records coarse connection analytics:
role, normalized browser origin or `unknown`, localhost status, runtime,
SDK/protocol versions, Cloudflare country, ASN organization, and colo, plus an
opaque room identifier. The analytics event excludes raw room capabilities, IP
addresses, actor/session ids, machine names, inspection messages, and payloads.
Cloudflare operational logs may separately contain the request URL, IP address,
and request metadata. A source origin can identify a site or customer, so this
is operational telemetry rather than anonymous data. Pass a self-hosted `url`
to opt out of Stately-hosted collection.

`inspector.inspectorUrl` is available immediately. Await `inspector.ready` when
the next step depends on successful relay registration, or listen for the
`connected` event when reconnects matter. The default `launch: 'none'` is safe
for test runners, automation, and CI; pass `launch: 'browser'` only when the SDK
should open the default browser from Node.
`inspectorBaseUrl` targets an inspector UI hosted separately from the WebSocket
relay. An explicit `url` wins over `STATELY_INSPECT_URL`, which wins over the
hosted default. See `@statelyai/sdk/protocol` for the versioned message and
`?r=` query contract. SDK producer registration also reports its SDK version
and coarse browser, Node, or unknown runtime; it never adds inspection payloads
to registration metadata. Protocol mismatches and registration errors reject
`ready` and close the connection without retrying. Browser transports use
application close code `4002`, with a fixed reason that stays within the
WebSocket UTF-8 length limit.

### CLI and sync




The separate [`statelyai`](https://www.npmjs.com/package/statelyai) CLI lists
local XState machines without authentication and can connect them to Stately
Studio projects for push, pull, comparison, and browser-backed visual editing.

```bash
npx statelyai scan
npx statelyai init --local --scan
npx statelyai status
npx statelyai push
npx statelyai pull
npx statelyai diff ./checkout.machine.ts machine-id
npx statelyai open ./checkout.machine.ts
npx statelyai open
```

`open <file>` shows every machine in that file in one collapsed workspace;
`open` discovers machines across the current worktree.

`statelyai diff` ignores entity IDs and presentation-only layout or color
fields, so `--fail-on-changes` can gate CI on machine semantics.

Pushing a linked machine reads its remote definition first. Local source wins
for structure, while presentation attached to unchanged entities—including
layout, colors, and annotations—is preserved.
The sync helpers re-read before writing and abort if remote edits keep changing.

Pulling into an existing JavaScript or TypeScript machine uses surgical source
patches. Comments, imports, helpers, and implementation bodies outside the
changed machine regions remain intact. `force: true` on `pullSync` allows full
regeneration when the source cannot be reconciled safely.

### Graph conversion



`fromStudioMachine` and `toStudioMachine` convert Studio machine records to and
from graph data. Source generation is part of the private Editor Sync workflow.

## Support

For pricing and support, contact
[team@stately.ai](mailto:team@stately.ai).

## Self-hosting



The SDK works with both the hosted Stately editor (`editor.stately.ai`) and
self-hosted deployments.

When self-hosting, authentication is handled by your editor server, not by this
npm package. The editor host supports configurable auth strategies, and you can
disable API-key checks for editor-sync endpoints when running behind your own
auth layer.

A fully self-contained deployment with no external auth looks like:

```ts
const embed = createStatelyEmbed({
  baseUrl: "https://your-editor.example.com",
});
```

For inspection, run your own relay and pass its URL explicitly:

```bash
npx @statelyai/sdk relay
```

```ts
const inspector = createInspector({
  url: "ws://localhost:4242",
  inspectorBaseUrl: "http://localhost:3000/inspect",
});
```

This repository's `packages/sky` is an optional Cloudflare Durable Object
reference deployment.

Key environment variables for self-hosted deployments:

| Variable                    | Purpose                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `AUTH_PROVIDER`             | Auth strategy used by the editor host                                                              |
| `RESOURCE_PROVIDER`         | Set to `stately` to enable project and machine resource operations; `none` (default) disables them |
| `EDITOR_SYNC_AUTH_REQUIRED` | Set to `false` to skip editor-sync API-key checks                                                  |
| `NEXT_PUBLIC_BASE_URL`      | Public-facing editor URL                                                                           |

For enterprise self-hosting options, [see pricing and contact
us](https://stately.ai/pricing).
