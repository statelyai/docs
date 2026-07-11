---
title: 'Stately MCP'
description: "Use Stately's machine tools from an MCP compatible agent."
sourcePath: 'packages/mcp/README.md'
sourceUrl: 'https://github.com/statelyai/docs/blob/main/external-docs/mcp/docs/index.md'
---

Use Stately's machine tools from an MCP-compatible agent.

## Connect

Choose your client and add Stately MCP using one of these methods.

### Codex

```bash
codex mcp add stately --url https://stately.ai/mcp
codex mcp login stately
```

### Claude Code

```bash
claude mcp add --transport http stately https://stately.ai/mcp
```

Then open Claude Code, run `/mcp`, and complete Stately sign-in.

### Cursor

Open **Cursor Settings → MCP → Add new global MCP server**, then add:

```json
{
  "mcpServers": {
    "stately": {
      "url": "https://stately.ai/mcp"
    }
  }
}
```

Save the configuration and complete Stately sign-in when Cursor connects. To
share the server with a project, put the same configuration in
`.cursor/mcp.json` at the project root.

### VS Code with GitHub Copilot

Create `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "stately": {
      "type": "http",
      "url": "https://stately.ai/mcp"
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
https://stately.ai/mcp
```

Complete Stately sign-in when the client connects.

## Machine input

Most tools accept a machine config object or a source document. Conversion
supports XState, SCXML, XGraph, and D2. Validation also supports JSON, YAML, and
Mermaid.

## `validate_machine`

Checks whether a machine can be parsed and reports structural issues such as
unreachable states. A successful response contains `ok` and an `issues` array.

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

Converts a machine between XState, SCXML, XGraph, and D2. The response contains
the target `format`, converted `content`, and any `warnings`.

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
text. It returns a summary and semantic diff; set `includePatches` to request
applicable patches.

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

Applies semantic patches to a machine and returns the updated document. Use
`to` to choose the returned format.

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

## `generate_graph_paths`

Generates shortest or simple paths through a machine. The response includes
the event steps for each path plus state and transition coverage. Stately MCP
returns at most five paths per call.

<details>
<summary>Summary: generate shortest paths</summary>

```text
Use Stately to find up to five shortest paths through this machine:

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
states, context, and executed action names. Guards are stubbed during this
deterministic simulation.

<details>
<summary>Summary: simulate events</summary>

```text
Use Stately to simulate PLAY followed by STOP on this machine:

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

Renders a machine as an SVG diagram. The response contains the SVG string,
its width and height, and any warnings.

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

## `analyze_machine`

Combines deterministic checks with AI review. Provide optional intent to assess
the machine against its expected behavior. The response contains issues and may
include suggested fixes. Use `validate_machine` when only deterministic checks
are needed.

<details>
<summary>Summary: analyze intended behavior</summary>

```text
Use Stately to check that STOP reaches a final state and playback cannot restart:

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

## `generate_test_code`

Generates a runnable Vitest file with one test per generated path. Each test
sends the path's events and asserts its final state. Guards and actions are
stubbed.

<details>
<summary>Summary: generate Vitest tests</summary>

```text
Use Stately to generate Vitest tests for the shortest paths through this machine:

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

Parses XState source code and returns the extracted machine as an XGraph
document.

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

All Stately MCP tools are registered as read-only, non-destructive, idempotent,
and closed-world.
