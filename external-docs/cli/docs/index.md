---
title: "statelyai"
description: "statelyai connects local machine source files to Stately Studio. Use it to open a file in the visual editor, compare local and remote machines, or sync a project in both directions."
sourcePath: "packages/cli/README.md"
sourceUrl: "https://github.com/statelyai/docs/blob/main/external-docs/cli/docs/index.md"
---

`statelyai` connects local machine source files to Stately Studio. Use it to
open a file in the visual editor, compare local and remote machines, or sync a
project in both directions.

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



| Goal                         | Command                                              | Writes                                                  |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| Edit one local file visually | `statelyai open <file>`                              | Local file, when you save in the editor                 |
| Set up project sync          | `statelyai init [--scan]`                            | Remote project and local `statelyai.json`               |
| Inspect project machines     | `statelyai status`                                   | Nothing                                                 |
| Preview project uploads      | `statelyai push --dry-run`                           | Nothing                                                 |
| Upload local machines        | `statelyai push [file]`                              | Remote machines and local `@statelyai` IDs              |
| Download project machines    | `statelyai pull`                                     | Linked local files and new files under `newMachinesDir` |
| Compare two machines         | `statelyai diff <source> <target>`                   | Nothing                                                 |
| Fail on differences in CI    | `statelyai diff <source> <target> --fail-on-changes` | Nothing                                                 |

## Quick start



For hosted Stately, authenticate once:

```bash
statelyai login
```

Skip login for a self-hosted server with authentication disabled. The CLI
sends no authorization header when no credential exists; the server decides
whether authentication is required.

Initialize the current repository and scan for XState files:

```bash
statelyai init --scan
```

`--scan` suggests `include` globs and asks before saving them. Without
`--scan`, `init` creates `statelyai.json` with an empty `include` list.

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
linked machines, and writes returned IDs into source comments. `pull` updates
linked files. If `newMachinesDir` is configured, it also creates local files
for machines that exist only in the Studio project.

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

### Custom OAuth deployment

Point login at an OAuth protected resource:

```bash
statelyai login --base-url https://editor.example.com/api/mcp
```

Passing only an origin uses its `/api/mcp` resource. The resource must
advertise an authorization server. If that server does not support dynamic
client registration, set `STATELY_OAUTH_CLIENT_ID`.

No login mode is needed for deployments with authentication disabled. Run the
command against that deployment; unauthenticated requests are sent normally.
If the server requires authentication, it returns `401` and you can then log in.

## Hosted and self-hosted URLs



The URL flags are intentionally scoped:

| Setting            | Used by                                  | Meaning                                                    |
| ------------------ | ---------------------------------------- | ---------------------------------------------------------- |
| `--base-url`       | `init`, `status`, `diff`, `push`, `pull` | Studio API origin.                                         |
| `studioUrl`        | `statelyai.json` project sync            | Default Studio API origin for that project.                |
| `login --base-url` | `login` only                             | OAuth protected-resource URL used for discovery.           |
| `--editor-url`     | `open` only                              | Visual editor origin. Default `https://editor.stately.ai`. |

For a custom deployment, the complete setup may look like:

```bash
statelyai login --base-url https://editor.example.com/api/mcp
statelyai init --base-url https://studio.example.com --scan
statelyai open src/checkout.machine.ts \
  --editor-url https://editor.example.com
```

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
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.*", "**/*.spec.*"],
  "newMachinesDir": "src/machines"
}
```

| Field                  | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `$schema`              | Published JSON Schema URL.                                      |
| `version`              | Config format version. Currently `1.0.0`.                       |
| `projectId`            | Remote Studio project ID.                                       |
| `studioUrl`            | Hosted or self-hosted Studio origin.                            |
| `defaultXStateVersion` | XState version used when creating remote machines. Minimum `5`. |
| `include`              | Source globs used by project-wide `push` and `pull`.            |
| `exclude`              | Globs removed from discovery. Defaults to tests and specs.      |
| `newMachinesDir`       | Destination for remote-only machines created by `pull`.         |

Project-wide `push` currently discovers machine-bearing JavaScript and
TypeScript files configured as `xstate` or `auto`. The config schema accepts
other format names, but project discovery does not push them.

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
statelyai login --base-url https://editor.example.com/api/mcp
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
Use `--json` for automation or `--auth` to show only credential resolution.
`status` is read-only and never migrates `statelyai.json`.

Flags: `--config <path>`, `--base-url <url>`, `--json`, `--auth`.

### `init`

Create or reuse a Studio project and write `statelyai.json`.

```bash
statelyai init --name "Checkout" --visibility Private --scan
```

Flags:

- `--name <name>` sets the remote project name.
- `--visibility Private|Public|Unlisted` defaults to `Private`.
- `--scan` proposes source globs interactively.
- `--force` replaces an existing config.
- `--base-url <url>` targets another Studio deployment.

### `open`

Start a local bridge and open one source file in the browser editor:

```bash
statelyai open src/checkout.machine.ts
```

Saved file changes refresh the editor. Saving visual edits writes them back to
the source file.

Flags:

- `--editor-url <url>` selects the hosted or self-hosted editor. Default:
  `https://editor.stately.ai`.
- `--host <host>` sets the local bridge host. Default: `127.0.0.1`.
- `--port <port>` selects a port. Default: a random available port.
- `--no-open` starts the bridge without launching a browser.
- `--debug` logs editor protocol messages.

Without a credential, `open` sends unauthenticated editor-sync requests. This
works automatically when the editor deployment has authentication disabled.

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

`--fail-on-changes` exits with status `1` when the normalized graphs differ.
Use `--base-url` for remote IDs on another Studio deployment. `plan` remains a
hidden compatibility alias for `diff`.

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

Project-wide pull skips linked files with uncommitted Git changes. Pass
`--force` to overwrite them. Remote-only machines are skipped until
`newMachinesDir` is set.

Flags: `--config <path>`, `--base-url <url>`, `--force`.

## CI examples



Fail when a local machine differs from Studio:

```bash
npx statelyai diff src/checkout.machine.ts machine_123 --fail-on-changes
```

For hosted Stately, provide `STATELY_API_KEY` or `STATELY_ACCESS_TOKEN` through
the CI runner's secret environment. No credential is needed for a self-hosted
deployment that disables authentication.

Check project discovery without network credentials or writes:

```bash
npx statelyai push --dry-run
```

Set `NO_COLOR=1` or `CI=true` for plain output.

## Common problems



- **The server returns `401`:** run `statelyai login`, or set
  `STATELY_ACCESS_TOKEN` or `STATELY_API_KEY`.
- **`push` finds no files:** check `include` and `exclude`; `init` without
  `--scan` intentionally leaves `include` empty.
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
