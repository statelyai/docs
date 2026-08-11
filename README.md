# fumadocs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

<!-- public routes matching app route handlers -->

| Route                   | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `app/(home)`            | The route group for the landing page and other pages.    |
| `app/docs`              | The documentation layout and pages.                      |
| `/api/search`           | Public documentation search.                             |
| `/api/docs/chat`        | Public documentation AI chat.                             |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs

## Multi-Repo Docs Sync

This repo can ingest docs content from other `statelyai/*` repos and mount it
under `stately.ai/docs/packages/...`.

The external docs manifest lives in `docs-sources.json`:

<!-- docs source manifest matching docs-sources.json -->

```json
[
  {
    "name": "Agent",
    "package": "agent",
    "source": "agent",
    "include": ["README.md", "docs/**/*.md", "docs/**/*.mdx"],
    "mode": "remote",
    "ref": "next"
  },
  { "name": "Graph", "package": "graph", "source": "graph" },
  {
    "name": "SDK",
    "package": "sdk",
    "source": "viz/packages/sdk",
    "mode": "snapshot"
  },
  {
    "name": "CLI",
    "package": "cli",
    "source": "viz/packages/cli",
    "mode": "snapshot"
  },
  {
    "name": "MCP",
    "package": "mcp",
    "source": "viz/packages/mcp",
    "mode": "snapshot"
  }
]
```

Each entry means:

- `name`: display name in the docs sidebar
- `package`: public route segment under `/docs/packages/<package>`
- `source`: repo root or repo subpath to scan for docs content
- `ref`: Git branch or tag; defaults to `main`
- `include`: optional Markdown glob allowlist relative to `source`
- `mode`: optional; `"remote"` always reads a locked GitHub revision;
  `"snapshot"` commits generated docs for private sources

### How Sync Works

<!-- docs sync behavior matching scripts/docs-sync.mjs -->

The sync pipeline is implemented in `scripts/docs-sync.mjs`.

For each manifest entry, it:

1. For `"remote"` sources, reads the immutable commit recorded in
   `docs-sources.lock.json`. Other sources resolve locally from `../<repo>` and
   fall back to a cached GitHub checkout when unavailable.
2. Scans the configured `source` root using its `include` allowlist. Without
   one, it includes only the root `README.md` / `readme.md` and
   `docs/**/*.{md,mdx}`.
3. Flattens those pages into `.cache/docs-workspaces/<package>/docs`.
4. Generates Fumadocs frontmatter when it is missing.
5. Uses the source repo's optional `docs/meta.json` to order and select
   navigation pages.
6. Writes only changed outputs and removes stale generated files.

The generated workspace is what `source.config.ts` points Fumadocs at. The app
never copies external docs into `content/docs`.

Snapshot sources are different: they write to `external-docs/<package>` so the
generated docs can be committed. In CI, if the private local source repo is not
available, the sync step uses the committed snapshot instead of cloning GitHub.

Use `pnpm docs:lock` intentionally to advance remote sources to the latest
commit on their configured ref. Normal builds only consume the recorded commit,
so a branch update cannot silently change a deployment.

### Flattening Rules

- Root `README.md` becomes `index.md` and maps to `/docs/packages/<package>`.
- Included nested `**/README.md(x)` are treated as index-like and flatten to
  their parent path:
  - `src/formats/adjacency-list/README.md` -> `src-formats-adjacency-list.md`
- `docs/**/*.{md,mdx}` also flatten into the same package namespace.
- Optional frontmatter `slug` overrides the flattened route segment.
- Duplicate flattened slugs fail the sync.
- A Fumadocs `docs/meta.json` `pages` array controls navigation order and
  visibility using the flattened page slugs.

For synced external docs, the pipeline also derives:

- `title` if frontmatter is missing
- `description` if frontmatter is missing
- `sourcePath` and `sourceUrl` pointing to the original file in GitHub

The first H1 in synced pages is stripped so the page title only renders once.
Linked source files and directories stay on GitHub. Only embedded local images
are copied into `_assets`.

### Overlapping Sources

Sources can overlap inside the same repo. More specific sources win.

Example:

- `{ "name": "SDK", "package": "sdk", "source": "viz/packages/sdk" }`
- `{ "name": "Viz", "package": "viz", "source": "viz" }`

In that case, `viz` automatically skips the `packages/sdk` subtree so the SDK
docs are not indexed twice.

### Commands

<!-- docs sync commands matching package.json#scripts -->

- `pnpm docs:lock`: update immutable remote-source revisions, then sync
- `pnpm docs:sync`: sync external workspaces at their recorded revisions
- `pnpm docs:generate`: sync external workspaces and regenerate Fumadocs output
- `pnpm docs:watch`: watch local source repos and regenerate on changes
- `pnpm dev`: run the app after a sync pass
- `pnpm build`: run sync and then a production build
