---
title: "Stately MCP"
description: "Validate, execute, explore, compare, convert, and visualize state machines from an MCP compatible agent."
sourcePath: "packages/mcp/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/mcp/docs/index.md"
---

Validate, execute, explore, compare, convert, and visualize state machines from
an MCP-compatible agent.

## Verification reports



- `verify` accepts `model: { kind: "source", content: "..." }` or
  `model: { kind: "machine", machineId: "..." }`, optional bindings
  `{ content, name? }`, and an optional baseline report or reference. It returns
  a validated run report through a host-supplied `executeVerification` adapter.
  Without an adapter it returns `verification_unavailable`; there is no HTTP
  fallback or bundled execution engine.
- `generate_test_paths` accepts `{ report }` and returns recorded paths from that
  report. It does not plan or execute new tests. Legacy reports lacking `paths`
  return `verification_paths_unavailable`.
- `coverage_report` accepts `{ report }` and returns model and executed coverage
  plus the verdict. It does not rerun verification.

All three tools use normal tool allowlists and content-free observer events.
Adapters receive an AI-free, network-denied execution policy and must enforce
isolation themselves. Model and baseline IDs are inert references for the host
to resolve. See [CLI verification reports](https://github.com/statelyai/viz/blob/main/docs/cli/verify.md) for report
semantics and JUnit mapping.

## Two ways to run it

**Local (stdio).** `npx @statelyai/mcp` runs the server on your machine. Use it
when you want the server in-process, or when you need to point the tools at your
own Stately deployment.

**Hosted (HTTP).** `https://mcp.stately.ai/mcp` needs no local install and adds
the [hosted resource tools](#hosted-resource-tools) that read your Stately
projects.

**Both use Stately credentials by default.** Only `list_machines` and
`get_machine` run entirely on your machine; every other tool calls the
configured HTTP API. Stately's hosted API rejects unauthenticated calls with
`Missing authentication.` A self-hosted API can define its own auth policy.

## Protocol support

Stately MCP supports both the MCP 2026-07-28 protocol and legacy 2025 clients.
Modern clients use stateless discovery instead of initialization sessions,
receive the MCP Apps extension capability, and may cache the static tool and
resource catalogs for five minutes. The hosted endpoint accepts the modern
`Mcp-Method` and `Mcp-Name` routing headers. The stdio server negotiates the
same modern protocol and falls back for legacy clients automatically.

Tool calls also preserve MCP trace context. Subscription streams are disabled
because Stately's tool and resource catalogs do not change during a request.
Tasks and multi-round-trip input remain available in the SDK for future tools
that need long-running execution or additional client input; current tools are
single-response operations and do not advertise unsupported workflows.

### Local (stdio)

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "stately": {
      "command": "npx",
      "args": ["-y", "@statelyai/mcp"],
      "env": { "STATELY_ACCESS_TOKEN": "..." }
    }
  }
}
```

Or install it and run the `stately-mcp` binary directly:

```bash
npm install -g @statelyai/mcp
stately-mcp
```

Credentials are read from `STATELY_ACCESS_TOKEN`, `STATELY_API_KEY`, or the
config written by `statelyai login`.

The API defaults to `https://editor.stately.ai/api`. Point it at a self-hosted
deployment with `STATELY_API_BASE_URL`:

```json
{
  "mcpServers": {
    "stately": {
      "command": "npx",
      "args": ["-y", "@statelyai/mcp"],
      "env": { "STATELY_API_BASE_URL": "https://stately.internal/api" }
    }
  }
}
```

## Connect to the hosted endpoint



Choose your client and add Stately MCP using one of these methods. Each ends in
a Stately sign-in; to run the server locally instead, see [Local (stdio)](#local-stdio) above.

### Codex

```bash
codex mcp add stately --url https://mcp.stately.ai/mcp
codex mcp login stately
```

### Claude Code

```bash
claude mcp add --transport http stately https://mcp.stately.ai/mcp
```

Then open Claude Code, run `/mcp`, and complete Stately sign-in.

### Cursor

Open **Cursor Settings → MCP → Add new global MCP server**, then add:

```json
{
  "mcpServers": {
    "stately": {
      "url": "https://mcp.stately.ai/mcp"
    }
  }
}
```

Save the configuration and complete Stately sign-in when Cursor connects. To
share the server with a project, put the same configuration in `.cursor/mcp.json`
at the project root.

### VS Code with GitHub Copilot

Create `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "stately": {
      "type": "http",
      "url": "https://mcp.stately.ai/mcp"
    }
  }
}
```

Open the Command Palette and run **MCP: List Servers**, start `stately`, then
complete Stately sign-in. For a personal configuration available in every
workspace, run **MCP: Open User Configuration** instead.

### Other MCP clients

Add a remote server using the Streamable HTTP transport and this URL:

```text
https://mcp.stately.ai/mcp
```

Complete Stately sign-in when the client connects.

## Machine input



Most tools accept a machine config object or a source document. Conversion
accepts XState, SCXML, XGraph, legacy Stately DigraphDef, Mermaid, and D2
sources; target formats exclude DigraphDef and Mermaid. Validation also supports
JSON and YAML.

## `validate_machine`



Checks machine syntax and graph structure deterministically. It does not
typecheck or execute XState source; use `simulate_machine` and
`generate_graph_paths` to verify runtime behavior. A successful response
contains `ok` and an `issues` array.

<details>
<summary>Summary: validate a machine</summary>

```text
Use Stately to validate this machine:

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { PAUSE: 'paused', STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

## `convert_machine`



Converts XState, SCXML, XGraph, legacy Stately DigraphDef, Mermaid, or D2 input
to XState, SCXML, XGraph, or D2. The response contains the target `format`,
converted `content`, and any `warnings`.

<details>
<summary>Summary: convert XState to SCXML</summary>

```text
Use Stately to convert this machine to SCXML:

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

<details>
<summary>Summary: convert SCXML to XState</summary>

```text
Use Stately to convert this SCXML machine to XState:

<scxml xmlns="http://www.w3.org/2005/07/scxml" name="player" initial="paused">
  <state id="paused">
    <transition event="PLAY" target="playing" />
  </state>
  <state id="playing">
    <transition event="STOP" target="stopped" />
  </state>
  <final id="stopped" />
</scxml>
```

</details>

<details>
<summary>Summary: convert XState to D2</summary>

```text
Use Stately to convert this machine to D2:

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

<details>
<summary>Summary: convert XState to XGraph</summary>

```text
Use Stately to convert this machine to XGraph:

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

## `diff_machines`



Compares two machine documents structurally instead of comparing their source
text. It returns a summary, the compatible normalized diff, and versioned
`semanticChanges`; set `includePatches` to request applicable patches.
Corresponding transitions remain paired when their source or target changes,
and changed fields identify `source`, `target`, `label`, `event`, `guard`,
`actions`, and other semantic data without layout or viewer details.
`hasChanges` also covers supported non-structural changes; the node and edge
counts remain structural. Generated patches preserve ordered actions/invokes
and guarded transition priority, including explicit
null/default resets and action parameter clearing.

<details>
<summary>Summary: compare two machine versions</summary>

```text
Use Stately to compare these two versions of a machine and suggest patches:

Before:
createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: {}
  }
});

After:
createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

## `apply_machine_patches`



Applies semantic patches in memory and returns a non-mutating behavioral
proposal: the updated document, the structured patches, and a concise
`behavioralSummary`. It never writes the source file or invokes Git. Use `to`
to choose the returned format; the coding agent remains responsible for its
actual source edit.

Patches use semantic graph operations. For example:

```json
{
  "op": "createTransition",
  "sourceId": "player.playing",
  "targetId": "player.paused",
  "eventType": "STOP"
}
```

Use graph entity IDs; top-level states commonly use `<machine-id>.<state-key>`. Use
camelCase operation names such as `createTransition`, not snake_case names.
State patches preserve initial input, output, timeout, and route; transition
patches preserve input and matches; invoke patches preserve metadata, input, and
output; implementation patches preserve code; schema patches preserve context,
event, input, and output schemas. Use `null` to clear these optional fields,
schemas, or machine context.
Schema-valid sparse XGraphs may omit effect/tag arrays; create patches initialize
those collections when needed.

<details>
<summary>Summary: update a machine</summary>

```text
Use Stately to rename the playing state to active and return the updated XState machine:

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: {}
  }
});
```

</details>

## `review_machine_implementation`



Reviews an agent-edited machine against the original source and proposed
semantic patches. It validates the edited machine, derives the behavior the
edit actually introduced, and reports missing, extra, or divergent changes.
The returned `stately-behavior-review.md` artifact contains the semantic
summary plus before/after Mermaid graphs, ready for the agent to save or paste
into its pull request.

The workflow keeps ownership explicit:

1. Inspect the existing machine.
2. Call `apply_machine_patches` for structured behavioral guidance.
3. Edit the source with the coding agent's normal tools.
4. Call `review_machine_implementation` with the original source, edited
   source, and proposed patches.
5. Let the coding agent create its branch, commit, and pull request normally.

Neither tool writes files, creates branches, commits, pushes, or contacts a Git
provider. The surgical writer remains an optional primitive for an agent that
wants minimal source edits; it does not own the surrounding workflow.

<details>
<summary>Summary: verify an agent-authored behavior change</summary>

```text
Ask Stately for patches that add a verifyingFraud state between processing and
completed. Edit the machine source yourself, then ask Stately to review the
edited machine against the original source and those patches. Save the returned
Markdown behavior review and include it in the pull request you create.
```

</details>

## `generate_graph_paths`



Generates shortest or simple paths through a machine. The response includes
the event steps, state and transition coverage, total path count, truncation,
and execution metadata. Stately MCP returns at most five paths per call.
XState source uses native traversal in an isolated sandbox; other formats are
converted to structural XGraph first.

<details>
<summary>Summary: generate shortest paths</summary>

```text
Use Stately to find up to five shortest paths through this machine:

import { createMachine } from 'xstate';

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { PAUSE: 'paused', STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

## `simulate_machine`



Runs up to 100 events through a machine and returns a step-by-step trace of
states, context, selected action names, and execution metadata. XState source
runs native transition logic in an isolated sandbox. Structural inputs report
normalization explicitly.

<details>
<summary>Summary: simulate events</summary>

```text
Use Stately to simulate PLAY followed by STOP on this machine:

import { createMachine } from 'xstate';

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

## `visualize_machine`



MCP Apps hosts render an interactive, read-only graph with hierarchy drill-in,
breadcrumbs, select/pan/structural-simulation controls, selection utilities,
zoom, viewport recovery, keyboard shortcuts, and a host-mediated link to the
same graph in Stately. It starts in pan mode; AI controls remain hidden.
Pass XState source text (the default for strings), a JSON machine config, SCXML,
XGraph, legacy Stately DigraphDef, Mermaid, or D2; the server converts it once
to canonical XGraph before rendering the app and PNG fallbacks.
Other image-capable clients receive one PNG fallback per parent node. Structured
content uses a required `schemaVersion: "2.0"` envelope with a canonical XGraph
JSON string in `interactive.graphJson`. Every V2 field has a concrete JSON
schema so hosts can persist the result without traversing open XGraph data.
`interactive` and `pngFallback` independently report `ready` or `unavailable`,
so PNG rendering may succeed when the persisted interactive graph is unavailable.
The graph is capped at 500,000 UTF-8 bytes by default and PNG metadata at 100
entries; image bytes remain native MCP content blocks. Use `parentNodeIds` to
limit PNG fallback levels; omit it to render every parent with direct children.

The App reads only this declared structured output. The stable resource URI is
retained: newer bundles decode V2, V1, and the earlier unversioned `graph` /
`graphError` shape. Saved results created before graph fields were declared
cannot be reconstructed and deliberately ask the user to run the tool again.

Each returned image uses the MCP `ImageContent` shape:

```ts
{ type: 'image', data: pngBase64, mimeType: 'image/png' }
```

Use `visualize_stately_machine({ machineId, direction?, parentNodeIds? })` to
fetch and render a hosted machine in one call. It prefers the public `graph`,
then an XGraph-shaped stored `definition`, then legacy DigraphDef compatibility.

<details>
<summary>Summary: visualize a machine</summary>

```text
Use Stately to visualize this machine from left to right:

createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

## `extract_machines_from_code`



Statically extracts every XState machine config from JavaScript or TypeScript.
The parser infers XState v5 or v6 structurally; pass `xstateVersion` only to
override inference. It does not execute source or require a resource provider.

<details>
<summary>Summary: extract a machine from TypeScript</summary>

```text
Use Stately to extract the machine from this TypeScript:

import { createMachine } from 'xstate';

export const player = createMachine({
  id: 'player',
  initial: 'paused',
  states: {
    paused: { on: { PLAY: 'playing' } },
    playing: { on: { STOP: 'stopped' } },
    stopped: { type: 'final' }
  }
});
```

</details>

## Hosted resource tools



These tools read hosted Stately projects and machines through the server-owned
`/api/v1` resource contract. They are separate from the workspace tools
(`list_machines`, `get_machine`), which read local files.

| Tool                            | Reads                                                             |
| ------------------------------- | ----------------------------------------------------------------- |
| `list_stately_projects`         | The hosted projects the caller can access.                        |
| `get_stately_project`           | One project, with its current project version id and machine ids. |
| `list_stately_project_machines` | The machines in a project.                                        |
| `get_stately_machine`           | One machine, with its definition.                                 |
| `visualize_stately_machine`     | Fetch and visualize one hosted machine in one call.               |

Inputs take a `projectId` or `machineId`, never a project version id.

Every call needs a credential: the MCP host supplies it and the bearer token is
forwarded to the resource provider. Calls without one fail with
`unauthenticated`, and deployments with no resource provider fail with
`capability_disabled`. Errors use the canonical resource envelope,
`{ error: { code, message, issues?, retryable? } }`.

These tools are read-only by policy. Create, update, and delete resource tools
are deliberately absent.

<details>
<summary>Summary: list the machines in a hosted project</summary>

```text
Use Stately to list the machines in the project with ID `project-id`.
```

```json
{ "machines": [{ "machineId": "machine-id", "name": "checkout" }] }
```

</details>

All Stately MCP tools are registered as read-only, non-destructive, and
idempotent. Machine tools are closed-world; the hosted resource tools are
open-world.

## Tool-call observation



Hosts can pass `onToolCall` to `registerStatelyMcpTools` or
`createStatelyMcpServer`. It receives a content-free completion event with the
tool name, outcome, duration, and stable error code when available. Arguments,
machine source, and results are never included. Input and output validation
failures are reported as errors. Configure the observer before registering any
other tools on the same `McpServer`.

### Error codes



Tool errors carry a `code` from a closed set. An upstream `code` is only
preserved when it is one of these values; anything else falls back to the
default for the HTTP status class, so clients never see an invented code.

| Code                  | Meaning                                                       |
| --------------------- | ------------------------------------------------------------- |
| `bad_request`         | Malformed request, and the default for unmapped 4xx statuses. |
| `unauthenticated`     | Missing or rejected credentials (HTTP 401).                   |
| `forbidden`           | Authenticated but not allowed (HTTP 403).                     |
| `not_found`           | No such project, machine, or route (HTTP 404).                |
| `conflict`            | Version or state conflict (HTTP 409).                         |
| `payload_too_large`   | Upstream rejected the request size (HTTP 413).                |
| `rate_limited`        | Too many requests (HTTP 429).                                 |
| `capability_disabled` | The operation is not enabled on this deployment.              |
| `upstream_error`      | Server-side HTTP failure, and the default for 5xx statuses.   |
| `internal_error`      | Unhandled failure inside a tool handler.                      |
| `upstream_timeout`    | The Stately API did not answer within `apiTimeoutMs`.         |
| `invalid_input`       | Local input validation failed before any API call.            |
| `input_too_large`     | Input exceeded `maxSourceBytes` before any API call.          |

Migration: 4xx responses that previously surfaced an unrecognized upstream code
verbatim (or `upstream_error` from a proxy) now report the status-class default
listed above. `upstream_error` remains reserved for 5xx responses.

On HTTP 429 the upstream `Retry-After` header is appended to the error message,
for example `Too many requests. Retry after 30 seconds.`

Set `clientId` to label this server's HTTP analysis calls for channel-level
telemetry. It defaults to `stately-mcp/embedded`; the stdio binary uses
`stately-mcp/stdio`. The label carries no user or machine content.

The observer is absent by default. Its failures do not affect tool results, and
its promises are not awaited; serverless hosts should schedule delivery with
their platform lifecycle primitive.

## Self-hosting



Self-host Stately Studio, then replace the hosted URL above with your
deployment's `/api/mcp` endpoint, for example
`https://studio.example.com/api/mcp`.

When the editor runs with `AUTH_PROVIDER=none`, MCP tool calls do not require a
bearer credential. Keep the endpoint behind your own trusted access boundary.

After deployment, run the protocol and MCP App canary with a read-only bearer
credential:

```bash
STATELY_MCP_CANARY_URL=https://studio.example.com/api/mcp \
STATELY_MCP_CANARY_TOKEN=... pnpm verify:mcp:canary
```

It verifies tool discovery, fetches and hashes the advertised app template,
checks compatibility URLs used by previously created visualizations, and runs
a minimal visualization. The scheduled production workflow requires the
`STATELY_MCP_CANARY_TOKEN` repository secret and fails when it is absent.

For enterprise self-hosting options, [see pricing and contact
us](https://stately.ai/pricing).
