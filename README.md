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
    "include": ["docs/**/*.md", "docs/**/*.mdx"],
    "mode": "workspace",
    "ref": "next"
  },
  {
    "name": "Graph",
    "package": "graph",
    "source": "graph",
    "mode": "workspace",
    "ref": "main"
  },
  {
    "name": "XState v6 alpha",
    "package": "xstate-v6",
    "source": "xstate",
    "notice": {
      "title": "XState v6 is in alpha",
      "description": "APIs and behavior may change before the stable release.",
      "type": "warning"
    },
    "include": [
      "docs/**/*.md",
      "docs/**/*.mdx",
      "packages/xstate-react/docs/**/*.md",
      "packages/xstate-react/docs/**/*.mdx",
      "packages/xstate-vue/docs/**/*.md",
      "packages/xstate-vue/docs/**/*.mdx",
      "packages/xstate-svelte/docs/**/*.md",
      "packages/xstate-svelte/docs/**/*.mdx",
      "packages/xstate-solid/docs/**/*.md",
      "packages/xstate-solid/docs/**/*.mdx",
      "packages/xstate-store/docs/**/*.md",
      "packages/xstate-store/docs/**/*.mdx"
    ],
    "mode": "workspace",
    "mounts": [
      { "source": "docs", "route": "" },
      {
        "source": "packages/xstate-react/docs",
        "route": "react",
        "title": "React"
      },
      {
        "source": "packages/xstate-vue/docs",
        "route": "vue",
        "title": "Vue"
      },
      {
        "source": "packages/xstate-svelte/docs",
        "route": "svelte",
        "title": "Svelte"
      },
      {
        "source": "packages/xstate-solid/docs",
        "route": "solid",
        "title": "Solid"
      },
      {
        "source": "packages/xstate-store/docs",
        "route": "store",
        "title": "Store"
      }
    ],
    "ref": "next",
    "route": "xstate/v6"
  },
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
- `notice`: optional source-wide callout shown on every page
- `ref`: Git branch or tag; defaults to `main`
- `include`: optional Markdown glob allowlist relative to `source`
- `mounts`: optional source-directory to route-directory mappings
- `mode`: optional; `"workspace"` compiles a locked GitHub checkout directly;
  `"snapshot"` commits generated docs for private sources
- `route`: optional public route prefix under `/docs`; defaults to
  `packages/<package>`

### How Sync Works

<!-- docs sync behavior matching scripts/docs-sync.mjs -->

The sync pipeline is implemented in `scripts/docs-sync.mjs`.

For a `"workspace"` source, `pnpm docs:lock` resolves `ref` to an immutable
commit in `docs-sources.lock.json`. Normal syncs check out that commit into
`.cache/docs-sources/<repo>/<commit>`. Fumadocs compiles the allowlisted files
directly as a workspace; the sync does not copy or rewrite Markdown. A clean
checkout already at the locked commit is reused without contacting GitHub.
`pnpm docs:watch` explicitly uses available sibling clones instead, so local
workspace documentation edits appear immediately during development.

Other sources use the compatibility pipeline: resolve `../<repo>` locally,
scan the configured allowlist, flatten pages into a generated workspace, add
missing frontmatter, rewrite links/assets, and derive navigation. The app never
copies external docs into `content/docs`.

Snapshot sources are different: they write to `external-docs/<package>` so the
generated docs can be committed. In CI, if the private local source repo is not
available, the sync step uses the committed snapshot instead of cloning GitHub.

Use `pnpm docs:lock` intentionally to advance workspace sources to the latest
commit on their configured ref. Normal builds only consume the recorded commit,
so a branch update cannot silently change a deployment.

### Flattening Rules

- Root `README.md` becomes `index.md` and maps to `/docs/packages/<package>`.
- Workspace `README.md(x)` files inside mounts map to the mount or nested
  directory index.
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

- `pnpm docs:lock`: update immutable workspace revisions, then sync
- `pnpm docs:sync`: sync external workspaces at their recorded revisions
- `pnpm docs:generate`: sync external workspaces and regenerate Fumadocs output
- `pnpm docs:watch`: use and watch available sibling source repos, then regenerate
- `pnpm dev`: run the app after a sync pass
- `pnpm build`: run sync and then a production build
