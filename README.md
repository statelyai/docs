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

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

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
  { "name": "Graph", "package": "graph", "source": "graph" },
  {
    "name": "SDK",
    "package": "sdk",
    "source": "viz/packages/sdk",
    "mode": "snapshot"
  },
  { "name": "Viz", "package": "viz", "source": "viz", "mode": "snapshot" }
]
```

Each entry means:

- `name`: display name in the docs sidebar
- `package`: public route segment under `/docs/packages/<package>`
- `source`: repo root or repo subpath to scan for docs content
- `mode`: optional; use `"snapshot"` to commit generated docs for private
  sources instead of fetching the repo during deployment

### How Sync Works

The sync pipeline is implemented in `scripts/docs-sync.mjs`.

For each manifest entry, it:

1. Resolves the source repo locally from `../<repo>` when available.
2. Falls back to a cached remote checkout in `.cache/docs-repos/<repo>` when
   the local repo is missing.
3. Scans the configured `source` root for:
   - root `README.md` / `readme.md`
   - nested `**/README.md(x)`
   - `docs/**/*.{md,mdx}`
4. Flattens those pages into `.cache/docs-workspaces/<package>/docs`.
5. Generates Fumadocs frontmatter when it is missing.

The generated workspace is what `source.config.ts` points Fumadocs at. The app
never copies external docs into `content/docs`.

Snapshot sources are different: they write to `external-docs/<package>` so the
generated docs can be committed. In CI, if the private local source repo is not
available, the sync step uses the committed snapshot instead of cloning GitHub.

### Flattening Rules

- Root `README.md` becomes `index.md` and maps to `/docs/packages/<package>`.
- Nested `**/README.md(x)` are treated as index-like and flatten to their parent
  path:
  - `src/formats/adjacency-list/README.md` -> `src-formats-adjacency-list.md`
- `docs/**/*.{md,mdx}` also flatten into the same package namespace.
- Optional frontmatter `slug` overrides the flattened route segment.
- Duplicate flattened slugs fail the sync.

For synced external docs, the pipeline also derives:

- `title` if frontmatter is missing
- `description` if frontmatter is missing
- `sourcePath` and `sourceUrl` pointing to the original file in GitHub

The first H1 in synced pages is stripped so the page title only renders once.

### Overlapping Sources

Sources can overlap inside the same repo. More specific sources win.

Example:

- `{ "name": "SDK", "package": "sdk", "source": "viz/packages/sdk" }`
- `{ "name": "Viz", "package": "viz", "source": "viz" }`

In that case, `viz` automatically skips the `packages/sdk` subtree so the SDK
docs are not indexed twice.

### Commands

<!-- docs sync commands matching package.json#scripts -->

- `pnpm docs:sync`: refresh external workspaces only
- `pnpm docs:generate`: sync external workspaces and regenerate Fumadocs output
- `pnpm docs:watch`: watch local source repos and regenerate on changes
- `pnpm dev`: run the app after a sync pass
- `pnpm build`: run sync and then a production build
