---
title: "statelyai"
description: "statelyai discovers local machine source files and can connect them to Stately Studio. Use it locally to inventory machines, or connect a project to open, compare, push, and pull machines."
sourcePath: "packages/cli/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/cli/docs/index.md"
---

`statelyai` discovers local machine source files and can connect them to
Stately Studio. Use it locally to inventory machines, or connect a project to
open, compare, push, and pull machines.

## Run the CLI



Run without installing:

```bash
npx statelyai --help
```

Or install it globally:

```bash
npm install --global statelyai
```

## Choose a workflow



| Goal                                | Command                                              | Writes                                                  |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| Process a saved verification report | `statelyai verify --from-report report.json`         | Local report file                                       |
| List local machines                 | `statelyai scan`                                     | Nothing                                                 |
| Edit local machines visually        | `statelyai open [file]`                              | Local source, when you save in the editor               |
| Set up local discovery              | `statelyai init --local --scan`                      | Local `statelyai.json`                                  |
| Set up project sync                 | `statelyai init --scan`                              | Remote project and local `statelyai.json`               |
| Inspect project machines            | `statelyai status`                                   | Nothing                                                 |
| Preview project uploads             | `statelyai push --dry-run`                           | Nothing                                                 |
| Upload local machines               | `statelyai push [file]`                              | Remote machines and local `@statelyai` IDs              |
| Download project machines           | `statelyai pull`                                     | Linked local files and new files under `newMachinesDir` |
| Compare two machines                | `statelyai diff <source> <target>`                   | Nothing                                                 |
| Fail on differences in CI           | `statelyai diff <source> <target> --fail-on-changes` | Nothing                                                 |

## Quick start



For hosted Stately, authenticate once:

```bash
statelyai login
```

Initialize the current repository and scan for XState files:

```bash
statelyai init --scan
```

`--scan` suggests `include` globs and asks before saving them. Without
`--scan`, `init` creates `statelyai.json` with an empty `include` list.
It also lists every discovered machine with its symbol, file, line, and linked
Stately ID when present.

For local discovery without authentication or a Studio project:

```bash
statelyai init --local --scan
statelyai status
```

Run `statelyai init` later to connect the local config to a Studio project
without losing its discovery globs.

To list machines without creating any config:

```bash
statelyai scan
```

Preview the files and remote operations:

```bash
statelyai push --dry-run
```

Then push and pull:

```bash
statelyai push
statelyai pull
```

`push` creates remote machines for unlinked source machines, updates already
linked machines, and writes returned IDs into source comments. Updating a
linked machine preserves Studio layout, colors, and annotations for unchanged
states while applying local structural changes. New states use default layout.
`pull` updates linked files. If `newMachinesDir` is configured, it also creates
local files for machines that exist only in the Studio project.
Push re-reads and retries when it observes a concurrent Studio edit. Registry
updates do not yet expose an atomic revision precondition, so avoid editing the
same machine in Studio during a push.

`open` restores layout, colors, annotations, and canvas assets from Studio for
machines with an `@statelyai id`. Unlinked machines keep only non-inferable
presentation values (canonical coordinates, colors, annotations, and canvas
assets) in `.statelyai/local.json` at the project root; machine structure is
not duplicated. The CLI uses Git's repository-local `.git/info/exclude`
mechanism for this local-only file. It is available to the CLI and VS Code on
this checkout, and file locking preserves both hosts' concurrent updates, but
it is not shared until the machine is linked to Studio. Linked presentation
saves merge into Studio's current structure with an atomic `updatedAt` guard.
Outside a Git repository, run `statelyai open` from the VS Code workspace root
so both hosts use the same sidecar.
Where unambiguous, older CLI sidecars keyed by display name are read and
migrated to the shared machine key on the next save.
New states keep their generated coordinates when clear, or move beside
existing states when they would overlap restored layout.

## Authentication



Browser OAuth is the default:

```bash
statelyai login
```

Use an API key instead:

```bash
statelyai login --api-key
```

Create or manage keys in [Stately API key settings](https://stately.ai/registry/user/my-settings?tab=API+Key).

For noninteractive input:

```bash
printf '%s\n' "$STATELY_API_KEY" | statelyai login --stdin
```

For automation, prefer an environment variable instead of storing a
credential. Resolution order is:

1. `STATELY_ACCESS_TOKEN`
2. `STATELY_API_KEY`
3. `NEXT_PUBLIC_STATELY_API_KEY`
4. the credential stored by `statelyai login`

The CLI loads `.env.local` from the current directory before resolving these
variables.

Use `statelyai status --auth` to report the selected source without printing
the credential. `statelyai logout` removes stored credentials but does not modify
environment variables.

Stored credentials use macOS Keychain or Linux Secret Service when available,
with a private config file as fallback. Set `STATELYAI_CREDENTIALS_BACKEND=file`
to force file storage, or `STATELYAI_CONFIG_DIR` to choose its directory.
Stored OAuth sessions refresh automatically before expiration. If the OAuth
server rejects the refresh token, the CLI removes the unusable credential and
directs you to run `npx statelyai login`. Transient refresh failures preserve
the credential so a later command can retry.

## `statelyai.json`



`push` and `pull` use `statelyai.json` from the current directory unless
`--config` supplies another path.

```json
{
  "$schema": "https://stately.ai/schemas/statelyai.json",
  "version": "1.0.0",
  "projectId": "project_123",
  "studioUrl": "https://stately.ai",
  "defaultXStateVersion": 5,
  "sourceUpdateStrategy": "preserve",
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.*", "**/*.spec.*"],
  "newMachinesDir": "src/machines"
}
```

| Field                  | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `$schema`              | Published JSON Schema URL.                                              |
| `version`              | Config format version. Currently `1.0.0`.                               |
| `projectId`            | Remote Studio project ID. Omitted for local-only projects.              |
| `studioUrl`            | Studio API origin. Omitted for local-only projects.                     |
| `defaultXStateVersion` | XState version used when creating remote machines. Minimum `5`.         |
| `sourceUpdateStrategy` | Visual writeback mode: `preserve` or `rewrite`. Defaults to `preserve`. |
| `include`              | Source globs used by project-wide `push` and `pull`.                    |
| `exclude`              | Globs removed from discovery. Defaults to tests and specs.              |
| `newMachinesDir`       | Destination for remote-only machines created by `pull`.                 |

Project-wide discovery identifies configured JavaScript and TypeScript files
that import XState and call `createMachine(...)` or `.createMachine(...)`.



Remote commands call the server-owned `/api/v1` resource contract on the editor
API server. Existing configs need no change: a `studioUrl` pointing at hosted
Stately (`stately.ai` or `www.stately.ai`) resolves to
`https://editor.stately.ai` at request time, and the file is never rewritten for
this. Any other `studioUrl`, such as a self-hosted origin, is used as-is.

Mutating project commands rewrite legacy configs with one `sources` entry to
the current top-level shape. `status` and `push --dry-run` normalize legacy
config in memory without writing it. Multiple legacy entries cannot be merged
safely and require manual migration.

## Commands



### `login`

Store an OAuth credential or API key.

```bash
statelyai login
statelyai login --api-key
```

Flags: `--api-key`, `--stdin`, `--base-url`.

### `logout`

```bash
statelyai logout
```

`logout` deletes stored credentials. Environment variables are unchanged.

### `status`

Inspect the configured project and classify local and remote machines:

```bash
statelyai status
```

Statuses are `linked`, `local-only`, `remote-only`, and `missing-remote`.
Local-only configs require no credentials and never contact Studio.
Use `--json` for automation or `--auth` to show only credential resolution.
`status` is read-only and never migrates `statelyai.json`.

Flags: `--config <path>`, `--base-url <url>`, `--json`, `--auth`.

### `init`

Create a local config or reuse a Studio project and write `statelyai.json`.

```bash
statelyai init --name "Checkout" --visibility Private --scan
statelyai init --local --scan
```

Flags:

- `--name <name>` sets the remote project name.
- `--visibility Private|Public|Unlisted` defaults to `Private`.
- `--scan` proposes source globs interactively.
- `--local` skips authentication and remote project creation.
- `--force` replaces an existing config.
- `--base-url <url>` overrides the Studio API origin.

### `scan`

List every local XState machine without authentication or `statelyai.json`:

```bash
statelyai scan
statelyai scan --json
```

The output includes the machine symbol, source file, line, and linked Stately
ID when present.

### `open`

Start a local bridge and open every machine in one source file as a workspace:

```bash
statelyai open src/checkout.machine.ts
```

Omit the file to discover every machine in the current worktree:

```bash
statelyai open
```

The workspace sidebar starts collapsed. Select a machine there without opening
a separate browser tab.



Saved file changes refresh the editor. Saving visual edits writes them back to
the source file. Editor Sync loads the opened file, its reachable relative
imports, and ancestor package manifests locally; unrelated sibling files are
excluded. The CLI checks access once per session and verifies the editor
protocol before exchanging machine data. Parsing and writeback run locally.
By default, the CLI loads up to 1,000 reachable files and 64 MiB of source;
`STATELY_SYNC_MAX_FILES` and `STATELY_SYNC_MAX_BYTES` adjust these limits.
If a visual edit cannot be written or a saved source change cannot be parsed,
the editor keeps the current graph visible and offers retry, copy-details, and
diagnostic-download actions. Use `--debug` to include the structured diagnostic
in the CLI's redacted editor protocol log.

Source updates default to `preserve`, which keeps existing formatting and
comments with focused edits. Use `--source-update rewrite` or set
`"sourceUpdateStrategy": "rewrite"` in `statelyai.json` to regenerate the
selected machine from its semantic model. Rewrite may change formatting and
comments inside that machine. When preserve cannot safely apply an edit, the
editor offers `Rewrite machine` without discarding the visual changes.

Flags:

- `--editor-url <url>` selects the editor origin. Default:
  `https://editor.stately.ai`.
- `--host <host>` sets the local bridge host. Default: `127.0.0.1`.
- `--port <port>` selects a port. Default: a random available port.
- `--no-open` starts the bridge without launching a browser.
- `--debug` logs editor protocol messages with credentials redacted.
- `--source-update <preserve|rewrite>` overrides the configured source update strategy.

### `diff`

Compare two locators after normalizing them to graph form:

```bash
statelyai diff src/checkout.machine.ts machine_123 --fail-on-changes
```

Locators may be:

- a local JavaScript or TypeScript machine file
- a local XState JSON, Stately graph JSON, or Studio digraph JSON file
- a Studio machine ID
- a Studio machine URL

`--fail-on-changes` exits with status `1` when machine semantics differ.
Entity IDs and presentation-only layout or color fields do not count as
changes. Use `--base-url` for remote IDs at another Studio origin. `plan`
remains a hidden compatibility alias for `diff`.

### `push`

Push every discovered machine in `statelyai.json`:

```bash
statelyai push
```

Push one file while still using the project and defaults from the config:

```bash
statelyai push src/checkout.machine.ts
```

Preview discovery and link/update decisions without a credential:

```bash
statelyai push --dry-run
```

`--dry-run` does not create or update machines, write `@statelyai` IDs, or
migrate legacy configuration.

For linked machines, `push` reads the current remote definition before updating
it. Local source remains authoritative for structure; Studio presentation for
unchanged states and transitions is preserved.
Push re-reads before writing and retries if it observes a remote change.
Registry updates do not yet expose an atomic revision precondition, so avoid
editing the same machine in Studio during a push.

Flags: `--config <path>`, `--base-url <url>`, `--dry-run`.

### `pull`

Pull all linked files from the configured project:

```bash
statelyai pull
```

Pull a linked file using its `@statelyai` ID:

```bash
statelyai pull src/checkout.machine.ts
```

Pull a machine ID or URL to an explicit target:

```bash
statelyai pull machine_123 src/checkout.machine.ts
```

New targets support JavaScript/TypeScript, `.digraph.json`, and `.graph.json`.
For existing JSON targets, the current file shape determines the output format.
Existing JavaScript and TypeScript targets are updated through surgical graph
patches so surrounding comments, imports, helpers, and implementation bodies
survive. New source files and JSON targets are generated as complete files.

Project-wide pull skips linked files with uncommitted Git changes. Pass
`--force` to overwrite them. If an existing source file cannot be updated
safely, pull leaves it unchanged and exits nonzero; `--force` explicitly allows
complete regeneration, which discards comments, imports, and helper code around
the machine. `--force` enables both behaviors together, so use it only when full
regeneration is acceptable. Every linked machine in a multi-machine source file
is pulled independently. Remote-only machines are skipped until
`newMachinesDir` is set.

Flags: `--config <path>`, `--base-url <url>`, `--force`.

## CI examples



Fail when a local machine differs from Studio:

```bash
npx statelyai diff src/checkout.machine.ts machine_123 --fail-on-changes
```

Provide `STATELY_API_KEY` or `STATELY_ACCESS_TOKEN` through the CI runner's
secret environment.

Check project discovery without network credentials or writes:

```bash
npx statelyai scan
npx statelyai push --dry-run
```

Set `NO_COLOR=1` or `CI=true` for plain output.

## Common problems



- **The server returns `401`:** run `statelyai login`, or set
  `STATELY_ACCESS_TOKEN` or `STATELY_API_KEY`.
- **A remote command says `Not logged in`:** run `statelyai login`, then retry,
  or use `statelyai init --local` for a local-only project. Add `--force` to
  replace an existing config.
- **`push` finds no files:** check `include` and `exclude`; `init` without
  `--scan` intentionally leaves `include` empty.
- **You only need local inventory:** run `statelyai scan` or initialize with
  `statelyai init --local --scan`; neither requires authentication.
- **`push` matches files but finds no machines:** project discovery currently
  requires XState imports plus `createMachine(...)` or
  `setup(...).createMachine(...)`.
- **Remote-only machines are skipped:** set `newMachinesDir`, then run
  `statelyai pull` again.
- **`pull` refuses to overwrite a file:** commit or stash its changes, or pass
  `--force` if overwriting is intentional.
- **A linked remote machine was deleted or is inaccessible:** interactive
  `push` offers to relink it as a new remote machine and replaces the local ID.

Run `statelyai <command> --help` for generated command syntax and flags.

## Verification reports



See [Verification reports](https://github.com/statelyai/viz/blob/main/docs/cli/verify.md) for offline JSON/JUnit
processing and the programmatic executor hook. Live verification requires a host
adapter; no verification engine is bundled.

## Self-hosting



Skip login when the server has authentication disabled. The CLI sends no
authorization header when no credential exists; the server decides whether
authentication is required. `open` checks Editor Sync access once per session,
then parses and applies source edits locally. CI commands use the same credential
policy.

For OAuth, point login at the deployment's protected resource:

```bash
statelyai login --base-url https://editor.example.com/api/mcp
```

Passing only an origin uses its `/api/mcp` resource. The resource must
advertise an authorization server. If that server does not support dynamic
client registration, set `STATELY_OAUTH_CLIENT_ID`.

URL settings are intentionally scoped:

| Setting            | Used by                                  | Meaning                                                    |
| ------------------ | ---------------------------------------- | ---------------------------------------------------------- |
| `--base-url`       | `init`, `status`, `diff`, `push`, `pull` | Studio API origin.                                         |
| `studioUrl`        | `statelyai.json` project sync            | Default Studio API origin for that project.                |
| `login --base-url` | `login` only                             | OAuth protected-resource URL used for discovery.           |
| `--editor-url`     | `open` only                              | Visual editor origin. Default `https://editor.stately.ai`. |

A complete setup may look like:

```bash
statelyai login --base-url https://editor.example.com/api/mcp
statelyai init --base-url https://studio.example.com --scan
statelyai open src/checkout.machine.ts \
  --editor-url https://editor.example.com
```

For enterprise self-hosting options, [see pricing and contact
us](https://stately.ai/pricing).
