// Walks docs/blog/external-docs MDX files and emits lib/search-index.json
// for the /api/search route to read at cold start, so the route doesn't
// have to compile every MDX file at module load.
import { readFile, writeFile, mkdir, glob } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { structure } from 'fumadocs-core/mdx-plugins';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');

const docsSourcesPath = path.join(REPO, 'docs-sources.json');
const docsSourcesLockPath = path.join(REPO, 'docs-sources.lock.json');
const docsSourceConfigs = existsSync(docsSourcesPath)
  ? JSON.parse(await readFile(docsSourcesPath, 'utf8'))
  : [];
const docsSourceLocks = existsSync(docsSourcesLockPath)
  ? JSON.parse(await readFile(docsSourcesLockPath, 'utf8'))
  : {};
const snapshotPackages = new Set(
  docsSourceConfigs
    .filter((source) => source.mode !== 'workspace')
    .map((source) => source.package),
);

/**
 * Minimal frontmatter parser: handles scalar string fields only (single-line,
 * optionally single/double quoted). Multi-line/array/nested values are skipped
 * because the search index only needs title + description.
 */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, content: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    data[kv[1]] = val;
  }
  return { data, content: raw.slice(m[0].length) };
}

/**
 * Compute the public URL for a content file. Mirrors lib/source.ts conventions:
 *   content/docs/foo.mdx           -> /docs/foo
 *   content/docs/foo/index.mdx     -> /docs/foo
 *   content/docs/index.mdx         -> /docs
 *   content/blog/<slug>/index.mdx  -> /blog/<slug>
 *   external-docs/<pkg>/docs/x.mdx -> /docs/packages/<pkg>/x
 */
function toUrl(rel) {
  rel = rel.replace(/\\/g, '/');
  let prefix, slug;
  if (rel.startsWith('content/docs/')) {
    prefix = '/docs';
    slug = rel.slice('content/docs/'.length);
  } else if (rel.startsWith('content/blog/')) {
    prefix = '/blog';
    slug = rel.slice('content/blog/'.length);
  } else if (rel.startsWith('external-docs/')) {
    const parts = rel.split('/');
    const pkg = parts[1];
    if (!snapshotPackages.has(pkg) || parts[2] !== 'docs') return null;
    prefix = `/docs/packages/${pkg}`;
    slug = parts.slice(3).join('/');
  } else {
    return null;
  }
  slug = slug.replace(/\.(mdx?|md)$/, '');
  if (slug === 'index') slug = '';
  else if (slug.endsWith('/index')) slug = slug.slice(0, -'/index'.length);
  return slug ? `${prefix}/${slug}` : prefix;
}

const patterns = [
  {
    cwd: REPO,
    pattern: 'content/docs/**/*.{md,mdx}',
    tag: 'docs',
    toUrl,
  },
  {
    cwd: REPO,
    pattern: 'content/blog/**/*.{md,mdx}',
    tag: 'blog',
    toUrl,
  },
  {
    cwd: REPO,
    pattern: 'external-docs/*/docs/**/*.{md,mdx}',
    tag: 'docs',
    toUrl,
  },
];

for (const source of docsSourceConfigs) {
  if (source.mode !== 'workspace') continue;

  const [repo, ...subpath] = source.source.replace(/^\/+|\/+$/gu, '').split('/');
  const lock = docsSourceLocks[source.package];
  if (!lock?.commit) {
    throw new Error(
      `Docs source "${source.package}" has no workspace lock. Run pnpm docs:lock.`,
    );
  }
  const cwd = path.join(
    REPO,
    '.cache',
    'docs-sources',
    repo,
    lock.commit,
    ...subpath,
  );
  const includes = source.include ?? [
    'README.md',
    'docs/**/*.md',
    'docs/**/*.mdx',
  ];

  for (const pattern of includes) {
    patterns.push({
      cwd,
      pattern,
      tag: 'docs',
      toUrl(rel) {
        const normalized = rel.replace(/\\/gu, '/');
        const docsPath = /^readme\.(md|mdx)$/iu.test(normalized)
          ? ''
          : normalized.replace(/^docs\//u, '').replace(/\.(md|mdx)$/iu, '');

        return docsPath === 'index' || docsPath === ''
          ? `/docs/packages/${source.package}`
          : `/docs/packages/${source.package}/${docsPath}`;
      },
    });
  }
}

const pages = [];
let skipped = 0;
const seenUrls = new Set();

for (const entry of patterns) {
  for await (const rel of glob(entry.pattern, { cwd: entry.cwd })) {
    const normalizedRel = rel.replace(/\\/gu, '/');
    if (!/[?*\[\]{}]/u.test(entry.pattern) && normalizedRel !== entry.pattern) {
      continue;
    }
    const literalExtension = entry.pattern.match(/\.([a-z0-9]+)$/u)?.[1];
    if (literalExtension && path.extname(normalizedRel) !== `.${literalExtension}`) {
      continue;
    }

    const url = entry.toUrl(rel);
    if (!url) {
      skipped++;
      continue;
    }
    if (seenUrls.has(url)) {
      console.warn(`[search-index] duplicate URL ${url} (${rel}) — skipping`);
      continue;
    }
    seenUrls.add(url);

    const raw = await readFile(path.join(entry.cwd, rel), 'utf8');
    const { data: fm, content } = parseFrontmatter(raw);
    const headingTitle = content.match(/^#\s+(.+)$/mu)?.[1]?.trim();

    let structuredData;
    try {
      structuredData = structure(content);
    } catch (err) {
      console.warn(
        `[search-index] structure() failed for ${rel}: ${err.message?.slice(0, 100)}`,
      );
      structuredData = { headings: [], contents: [] };
    }

    pages.push({
      title: fm.title ?? headingTitle ?? '',
      description: fm.description ?? '',
      url,
      id: url,
      structuredData,
      tag: entry.tag,
    });
  }
}

const outPath = path.join(REPO, 'lib', 'search-index.json');
await mkdir(path.dirname(outPath), { recursive: true });
const json = JSON.stringify(pages);
await writeFile(outPath, json);

console.log(
  `[search-index] wrote ${pages.length} pages (${(json.length / 1024).toFixed(0)} KB) → ${path.relative(REPO, outPath)}` +
    (skipped ? ` (skipped ${skipped} unmapped files)` : ''),
);
