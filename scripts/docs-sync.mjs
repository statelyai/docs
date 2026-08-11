import { execFileSync } from 'node:child_process';
import {
  access,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { resolveDocsSourceRoutePath } from '../lib/docs-source-route.mjs';
import { deriveMarkdownTitle } from '../lib/markdown-title.mjs';

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, 'docs-sources.json');
const lockPath = path.join(rootDir, 'docs-sources.lock.json');
const updateLock = process.argv.includes('--update-lock');
const generatedModulePath = path.join(
  rootDir,
  'lib',
  'external-docs.generated.ts',
);
const generatedNavPath = path.join(
  rootDir,
  'lib',
  'external-docs-nav.generated.ts',
);

const markdownExtensions = new Set(['.md', '.mdx']);
const ignoredDirectoryNames = new Set([
  '.git',
  '.github',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'build',
  'node_modules',
]);
const preparedWorkspaceDirs = new Set();

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function isDirectory(filePath) {
  try {
    return (await stat(filePath)).isDirectory();
  } catch {
    return false;
  }
}

async function writeFileIfChanged(filePath, content) {
  const nextContent = Buffer.isBuffer(content) ? content : Buffer.from(content);

  try {
    const currentContent = await readFile(filePath);
    if (currentContent.equals(nextContent)) return false;
  } catch {
    // Missing files are created below.
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, nextContent);
  return true;
}

async function copyFileIfChanged(sourcePath, targetPath) {
  return writeFileIfChanged(targetPath, await readFile(sourcePath));
}

function run(command, args, cwd = rootDir) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
}

function runCapture(command, args, cwd = rootDir) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function tryRun(command, args, cwd = rootDir) {
  try {
    execFileSync(command, args, {
      cwd,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

async function isReusableLockedWorkspace(checkoutDir, expectedCommit) {
  if (!(await exists(path.join(checkoutDir, '.git')))) return false;

  try {
    const head = runCapture('git', ['rev-parse', 'HEAD'], checkoutDir);
    const status = runCapture(
      'git',
      ['status', '--porcelain', '--untracked-files=normal'],
      checkoutDir,
    );
    return head === expectedCommit && status === '';
  } catch {
    return false;
  }
}

function parseEnabledSourceOverride(value) {
  if (!value) return new Set();

  const ids = value
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  return ids.includes('*') ? 'all' : new Set(ids);
}

function isDocsSourceEnabled(sourceId, override) {
  if (override === 'all') return true;
  if (override.size > 0) {
    return override.has(sourceId);
  }

  return true;
}

function normalizeSourcePath(source) {
  return String(source).replace(/^\/+|\/+$/g, '');
}

function getSourceRepo(source) {
  return normalizeSourcePath(source).split('/')[0];
}

function getSourceSubpath(source) {
  return normalizeSourcePath(source).split('/').slice(1).join('/');
}

function normalizeDocsSourceConfig(config) {
  return {
    ...config,
    include: config.include,
    mode: config.mode,
    mounts: config.mounts?.map((mount) => ({
      ...mount,
      route: normalizePath(String(mount.route ?? '')).replace(/^\/+|\/+$/gu, ''),
      source: normalizePath(String(mount.source)).replace(/^\/+|\/+$/gu, ''),
    })),
    package: String(config.package),
    ref: String(config.ref ?? 'main'),
    repo: getSourceRepo(config.source),
    route: normalizePath(String(config.route ?? '')).replace(/^\/+|\/+$/gu, ''),
    source: normalizeSourcePath(config.source),
    sourceSubpath: getSourceSubpath(config.source),
  };
}

function getLocalProjectDir(repo) {
  return path.resolve(rootDir, '..', repo);
}

function getRemoteProjectDir(repo) {
  return path.resolve(rootDir, '.cache', 'docs-repos', repo);
}

function getWorkspaceProjectDir(repo, commit) {
  return path.resolve(rootDir, '.cache', 'docs-sources', repo, commit);
}

function getGeneratedProjectDir(packageName) {
  return path.resolve(rootDir, '.cache', 'docs-workspaces', packageName);
}

function getSnapshotProjectDir(packageName) {
  return path.resolve(rootDir, 'external-docs', packageName);
}

function getOutputProjectDir(project) {
  if (project.mode === 'snapshot') {
    return getSnapshotProjectDir(project.package);
  }

  return getGeneratedProjectDir(project.package);
}

function getProjectRepo(repo) {
  return `statelyai/${repo}`;
}

function getProjectDocsDir() {
  return 'docs';
}

function getProjectRoutePrefix(project) {
  return project.route || path.join('packages', project.package);
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function getProjectDocsUrl(project, slug) {
  const prefix = `/docs/${normalizePath(getProjectRoutePrefix(project))}`;
  return slug === 'index' ? prefix : `${prefix}/${slug}`;
}

function getSourceUrl(repo, sourcePath, ref, view = 'blob') {
  return `https://github.com/${getProjectRepo(repo)}/${view}/${ref}/${sourcePath}`;
}

function getSnapshotSourceUrl(packageName, outputPath) {
  return `https://github.com/statelyai/docs/blob/main/external-docs/${packageName}/${outputPath}`;
}

function isMarkdownPath(filePath) {
  return markdownExtensions.has(path.extname(filePath).toLowerCase());
}

function isReadmePath(filePath) {
  return /^readme\.(md|mdx)$/i.test(path.basename(filePath));
}

function yamlString(value) {
  return JSON.stringify(value);
}

function toTitleCase(value) {
  return value
    .split(/[-_\s/]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeSlugSegment(value) {
  return value
    .trim()
    .replace(/\.[^.]+$/u, '')
    .replace(/[^a-zA-Z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .toLowerCase();
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return {
      body: content,
      raw: null,
    };
  }

  return {
    body: match[2],
    raw: match[1],
  };
}

function parseFrontmatterValue(rawFrontmatter, key) {
  if (!rawFrontmatter) return undefined;

  const match = rawFrontmatter.match(
    new RegExp(`^${key}\\s*:\\s*(.+)$`, 'm'),
  );

  if (!match) return undefined;

  const value = match[1].trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function stripManagedFrontmatter(rawFrontmatter) {
  if (!rawFrontmatter) return '';

  const lines = rawFrontmatter.split('\n');
  const output = [];
  let skipIndentedBlock = false;

  for (const line of lines) {
    if (/^(title|description|slug|sourcePath|sourceUrl)\s*:/u.test(line)) {
      skipIndentedBlock = true;
      continue;
    }

    if (skipIndentedBlock) {
      if (/^\s+/u.test(line)) {
        continue;
      }

      skipIndentedBlock = false;
    }

    output.push(line);
  }

  return output.join('\n').trim();
}

function extractLeadingH1(body) {
  const trimmed = body.replace(/^\s*\n*/u, '');

  const atxMatch = trimmed.match(/^#\s+(.+?)\n+(.*)$/su);
  if (atxMatch) {
    return {
      heading: atxMatch[1].trim(),
      body: atxMatch[2],
    };
  }

  const setextMatch = trimmed.match(/^(.+?)\n=+\n+(.*)$/su);
  if (setextMatch) {
    return {
      heading: setextMatch[1].trim(),
      body: setextMatch[2],
    };
  }

  return {
    heading: undefined,
    body: trimmed,
  };
}

function deriveTitle(defaultTitle, sourcePath, extractedHeading) {
  if (extractedHeading) return extractedHeading;

  const normalized = normalizePath(sourcePath);
  if (/^readme\.(md|mdx)$/i.test(normalized)) {
    return defaultTitle;
  }

  const withoutDocsPrefix = normalized.startsWith('docs/')
    ? normalized.slice('docs/'.length)
    : normalized;
  const segmentSource = withoutDocsPrefix.replace(/\.[^.]+$/u, '');
  const segments = segmentSource.split('/');
  const lastSegment = segments.at(-1) ?? defaultTitle;

  return toTitleCase(lastSegment);
}

function deriveSlug(sourcePath, slugOverride) {
  if (slugOverride) {
    if (slugOverride.includes('/') || slugOverride.includes('\\')) {
      throw new Error(
        `Invalid slug "${slugOverride}". Flattened docs slugs must not contain path separators.`,
      );
    }

    const normalizedOverride = normalizeSlugSegment(slugOverride);
    if (!normalizedOverride) {
      throw new Error(`Invalid slug "${slugOverride}".`);
    }

    return normalizedOverride;
  }

  const normalized = normalizePath(sourcePath);
  if (/^readme\.(md|mdx)$/i.test(normalized)) {
    return 'index';
  }

  const withoutDocsPrefix = normalized.startsWith('docs/')
    ? normalized.slice('docs/'.length)
    : normalized;
  const withoutExtension = withoutDocsPrefix.replace(/\.[^.]+$/u, '');
  const rawSegments = withoutExtension
    .split('/')
    .filter(Boolean);

  if (rawSegments.length > 1 && /^readme$/i.test(rawSegments.at(-1) ?? '')) {
    rawSegments.pop();
  }

  const segments = rawSegments
    .map((segment) => normalizeSlugSegment(segment))
    .filter(Boolean);

  const derived = segments.join('-');

  if (!derived) {
    throw new Error(`Unable to derive a slug from "${sourcePath}".`);
  }

  return derived;
}

function deriveDescription(body) {
  const normalized = stripHtmlComments(body)
    .replace(/```[\s\S]*?```/gu, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/`([^`]+)`/gu, '$1')
    .replace(/[*_~>#-]+/gu, ' ')
    .replace(/^\s+/u, '');

  const paragraphs = normalized
    .split(/\n\s*\n/gu)
    .map((paragraph) => paragraph.replace(/\s+/gu, ' ').trim())
    .filter(Boolean)
    .filter((paragraph) => !paragraph.startsWith('#'));

  const description = paragraphs[0];
  if (!description) return undefined;

  return description.slice(0, 220);
}

function stripHtmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/gu, '');
}

function replaceMarkdownLinks(content, replacer) {
  return content.replace(/(!?\[[^\]]*?\]\()([^)\s][^)]*?)(\))/gu, (_, open, target, close) => {
    const replacement = replacer(target);
    return `${open}${replacement ?? target}${close}`;
  });
}

function resolveRelativeFilePath(sourcePath, targetPath) {
  const normalizedTarget = normalizePath(targetPath);
  if (
    normalizedTarget.startsWith('/') ||
    normalizedTarget.startsWith('#') ||
    /^[a-zA-Z][a-zA-Z\d+.-]*:/u.test(normalizedTarget)
  ) {
    return null;
  }

  const resolved = normalizePath(
    path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), normalizedTarget)),
  );

  if (resolved.startsWith('../')) return null;

  return resolved;
}

function getMarkdownLookupCandidates(sourcePath) {
  const normalized = normalizePath(sourcePath);

  if (isMarkdownPath(normalized)) {
    return [normalized];
  }

  const candidates = [
    `${normalized}.md`,
    `${normalized}.mdx`,
    `${normalized}/README.md`,
    `${normalized}/README.mdx`,
    `${normalized}/readme.md`,
    `${normalized}/readme.mdx`,
    `${normalized}/index.md`,
    `${normalized}/index.mdx`,
  ];

  return candidates;
}

async function listProjectFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativeParts = normalizePath(path.relative(base, fullPath)).split('/');
    const isInsideDocsDirectory = relativeParts.slice(0, -1).includes('docs');
    if (
      entry.isDirectory() &&
      ((ignoredDirectoryNames.has(entry.name) && !isInsideDocsDirectory) ||
        entry.name.startsWith('.'))
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...(await listProjectFiles(fullPath, base)));
      continue;
    }

    files.push(normalizePath(path.relative(base, fullPath)));
  }

  return files.sort();
}

async function listGeneratedFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listGeneratedFiles(fullPath, base)));
      continue;
    }

    files.push(normalizePath(path.relative(base, fullPath)));
  }

  return files.sort();
}

async function removeEmptyDirectories(dir, removeCurrent = false) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    await removeEmptyDirectories(path.join(dir, entry.name), true);
  }

  if (removeCurrent && (await readdir(dir)).length === 0) {
    await rm(dir, { recursive: true });
  }
}

function isWithinExcludedPrefix(file, excludedPrefixes) {
  return excludedPrefixes.some(
    (prefix) => file === prefix || file.startsWith(`${prefix}/`),
  );
}

function matchesDefaultDocsInclude(file) {
  return (isReadmePath(file) && !file.includes('/')) || file.startsWith('docs/');
}

function matchesDocsInclude(file, include) {
  if (!include) return matchesDefaultDocsInclude(file);
  return include.some((pattern) => path.matchesGlob(file, pattern));
}

async function collectMarkdownSourcePaths(projectDir, include, excludedPrefixes = []) {
  const files = await listProjectFiles(projectDir);
  const markdownSources = new Set();

  for (const file of files) {
    if (isWithinExcludedPrefix(file, excludedPrefixes)) continue;
    if (!isMarkdownPath(file)) continue;

    if (matchesDocsInclude(file, include)) {
      markdownSources.add(file);
    }
  }

  return [...markdownSources].sort();
}

async function collectMarkdownEntries(docsSource, sourceRootDir, sourceBaseDir, excludedPrefixes) {
  const sourcePaths = await collectMarkdownSourcePaths(
    sourceBaseDir,
    docsSource.include,
    excludedPrefixes,
  );

  if (sourcePaths.length === 0) {
    throw new Error(
      `Docs source "${docsSource.package}" is configured, but no included Markdown files were found in ${sourceBaseDir}.`,
    );
  }

  return Promise.all(
    sourcePaths.map(async (sourcePath) => {
      const absolutePath = path.join(sourceBaseDir, sourcePath);
      const repoRelativeSourcePath = normalizePath(
        docsSource.sourceSubpath
          ? path.posix.join(docsSource.sourceSubpath, sourcePath)
          : sourcePath,
      );
      const original = await readFile(absolutePath, 'utf8');
      const { raw, body } = parseFrontmatter(original);
      const bodyWithoutComments = stripHtmlComments(body);
      const { heading, body: bodyWithoutHeading } =
        extractLeadingH1(bodyWithoutComments);
      const title =
        parseFrontmatterValue(raw, 'title') ??
        (docsSource.mode === 'workspace'
          ? deriveMarkdownTitle(original, sourcePath)
          : deriveTitle(docsSource.name, sourcePath, heading));
      const description =
        parseFrontmatterValue(raw, 'description') ??
        deriveDescription(bodyWithoutHeading);
      const slug = deriveSlug(sourcePath, parseFrontmatterValue(raw, 'slug'));
      const extension = path.extname(sourcePath).toLowerCase() === '.mdx' ? '.mdx' : '.md';

      return {
        body: bodyWithoutHeading,
        description,
        extension,
        rawFrontmatter: raw,
        slug,
        sourcePath: repoRelativeSourcePath,
        sourceUrl: getSourceUrl(
          docsSource.repo,
          repoRelativeSourcePath,
          docsSource.sourceRef,
        ),
        title,
        workspacePath: sourcePath,
      };
    }),
  );
}

function buildEntryFrontmatter(entry) {
  const lines = [`title: ${yamlString(entry.title)}`];

  if (entry.description) {
    lines.push(`description: ${yamlString(entry.description)}`);
  }

  lines.push(`sourcePath: ${yamlString(entry.sourcePath)}`);
  lines.push(`sourceUrl: ${yamlString(entry.sourceUrl)}`);

  const remaining = stripManagedFrontmatter(entry.rawFrontmatter);
  if (remaining) {
    lines.push(remaining);
  }

  return `---\n${lines.join('\n')}\n---\n\n`;
}

async function rewriteEntryBody(
  entry,
  docsEntriesBySourcePath,
  generatedAssetPaths,
  project,
  repo,
  sourceRef,
  sourceRootDir,
) {
  let rewritten = entry.body;
  const linkMatches = [...entry.body.matchAll(/(!?\[[^\]]*?\]\()([^)\s][^)]*?)(\))/gu)];

  for (const match of linkMatches) {
    const [fullMatch, open, target, close] = match;
    const [pathPart, suffix = ''] = target.split(/(?=[#?])/u, 2);
    const resolvedPath = resolveRelativeFilePath(entry.sourcePath, pathPart);

    if (!resolvedPath) continue;

    let replacementTarget = null;

    for (const candidate of getMarkdownLookupCandidates(resolvedPath)) {
      const linkedEntry = docsEntriesBySourcePath.get(candidate);
      if (!linkedEntry) continue;

      replacementTarget = `${getProjectDocsUrl(project, linkedEntry.slug)}${suffix}`;
      break;
    }

    if (!replacementTarget) {
      if (isMarkdownPath(resolvedPath)) {
        replacementTarget = `${getSourceUrl(repo, resolvedPath, sourceRef)}${suffix}`;
      }
    }

    if (!replacementTarget) {
      const absoluteLinkedPath = path.join(sourceRootDir, resolvedPath);

      if (open.startsWith('![') && (await isFile(absoluteLinkedPath))) {
        const assetTarget = `_assets/${resolvedPath}`;
        generatedAssetPaths.set(resolvedPath, assetTarget);
        replacementTarget = `./${normalizePath(assetTarget)}${suffix}`;
      } else if (await isFile(absoluteLinkedPath)) {
        replacementTarget = `${getSourceUrl(repo, resolvedPath, sourceRef)}${suffix}`;
      } else if (await isDirectory(absoluteLinkedPath)) {
        replacementTarget = `${getSourceUrl(repo, resolvedPath, sourceRef, 'tree')}${suffix}`;
      }
    }

    if (!replacementTarget) continue;

    rewritten = rewritten.replace(
      fullMatch,
      `${open}${replacementTarget}${close}`,
    );
  }

  return rewritten;
}

async function writeFlattenedDocs(project, sourceRootDir, generatedDocsDir) {
  const entries = await collectMarkdownEntries(
    project,
    sourceRootDir,
    project.sourceBaseDir,
    project.excludedSourcePrefixes,
  );
  const docsEntriesBySourcePath = new Map(
    entries.map((entry) => [entry.sourcePath, entry]),
  );
  const docsEntriesBySlug = new Map();

  for (const entry of entries) {
    const existing = docsEntriesBySlug.get(entry.slug);
    if (existing) {
      throw new Error(
        [
          `Duplicate flattened docs slug "${entry.slug}" for package "${project.package}".`,
          `- ${existing.sourcePath}`,
          `- ${entry.sourcePath}`,
          'Add unique `slug` frontmatter to resolve the collision.',
        ].join('\n'),
      );
    }

    docsEntriesBySlug.set(entry.slug, entry);
  }

  const generatedAssetPaths = new Map();
  const generatedFiles = [];
  const navPages = [];

  for (const entry of entries) {
    const fileName = `${entry.slug}${entry.extension}`;
    const filePath =
      entry.slug === 'index'
        ? `index${entry.extension}`
        : fileName;
    const outputPath = normalizePath(path.join(getProjectDocsDir(), filePath));
    const outputEntry = {
      ...entry,
      sourceUrl:
        project.mode === 'snapshot'
          ? getSnapshotSourceUrl(project.package, outputPath)
          : entry.sourceUrl,
    };
    const finalBody = await rewriteEntryBody(
      entry,
      docsEntriesBySourcePath,
      generatedAssetPaths,
      project,
      project.repo,
      project.sourceRef,
      sourceRootDir,
    );

    const changed = await writeFileIfChanged(
      path.join(generatedDocsDir, filePath),
      `${buildEntryFrontmatter(outputEntry)}${finalBody}`,
    );

    generatedFiles.push({
      changed,
      outputPath,
      sourcePath: entry.sourcePath,
    });

    navPages.push({
      title: entry.title,
      url: getProjectDocsUrl(project, entry.slug),
    });
  }

  for (const [sourcePath, assetTarget] of generatedAssetPaths) {
    const absoluteSourcePath = path.join(sourceRootDir, sourcePath);
    const absoluteTargetPath = path.join(generatedDocsDir, assetTarget);

    const changed = await copyFileIfChanged(
      absoluteSourcePath,
      absoluteTargetPath,
    );

    generatedFiles.push({
      changed,
      outputPath: normalizePath(path.join(getProjectDocsDir(), assetTarget)),
      sourcePath,
    });
  }

  const metaPath = path.join(project.sourceBaseDir, 'docs', 'meta.json');
  let orderedNavPages = navPages.sort((a, b) => {
    if (a.url === getProjectDocsUrl(project, 'index')) return -1;
    if (b.url === getProjectDocsUrl(project, 'index')) return 1;
    return a.url.localeCompare(b.url);
  });

  if (await isFile(metaPath)) {
    const meta = JSON.parse(await readFile(metaPath, 'utf8'));
    if (!Array.isArray(meta.pages) || meta.pages.some((page) => typeof page !== 'string')) {
      throw new Error(
        `Docs metadata for "${project.package}" must define "pages" as an array of flattened page slugs.`,
      );
    }

    const navBySlug = new Map(
      navPages.map((page) => [page.url.split('/').at(-1) ?? 'index', page]),
    );
    navBySlug.set('index', navPages.find(
      (page) => page.url === getProjectDocsUrl(project, 'index'),
    ));

    orderedNavPages = meta.pages.map((slug) => {
      const separator = slug.match(/^---(.+)---$/u);
      if (separator) {
        return { separator: true, title: separator[1] };
      }

      const page = navBySlug.get(slug);
      if (!page) {
        throw new Error(
          `Docs metadata for "${project.package}" references unknown page "${slug}".`,
        );
      }
      return page;
    });

    const changed = await copyFileIfChanged(
      metaPath,
      path.join(generatedDocsDir, 'meta.json'),
    );
    generatedFiles.push({
      changed,
      outputPath: `${getProjectDocsDir()}/meta.json`,
      sourcePath: normalizePath(path.relative(sourceRootDir, metaPath)),
    });
  }

  return {
    files: generatedFiles.sort((a, b) => a.outputPath.localeCompare(b.outputPath)),
    navPages: orderedNavPages,
  };
}

async function collectSnapshotNavPages(project, generatedDocsDir) {
  const files = await listProjectFiles(generatedDocsDir);
  const navPages = [];

  for (const file of files) {
    if (file.startsWith('_assets/')) continue;
    if (!isMarkdownPath(file)) continue;

    const content = await readFile(path.join(generatedDocsDir, file), 'utf8');
    const { raw } = parseFrontmatter(content);
    const title = parseFrontmatterValue(raw, 'title');
    if (!title) continue;

    const slug = file.replace(/\.(md|mdx)$/iu, '');
    navPages.push({
      title,
      url: getProjectDocsUrl(project, slug === 'index' ? 'index' : slug),
    });
  }

  return navPages.sort((a, b) => {
    if (a.url === getProjectDocsUrl(project, 'index')) return -1;
    if (b.url === getProjectDocsUrl(project, 'index')) return 1;
    return a.url.localeCompare(b.url);
  });
}

function getWorkspaceRoutePath(project, workspacePath) {
  const routePath = resolveDocsSourceRoutePath(project, workspacePath);
  if (routePath === null) {
    throw new Error(
      `Workspace path "${workspacePath}" is not covered by a mount for source "${project.package}".`,
    );
  }

  const withoutExtension = routePath.replace(/\.(md|mdx)$/iu, '');
  const publicRoute = withoutExtension.replace(/(^|\/)index$/iu, '');
  return publicRoute || 'index';
}

async function collectMountedWorkspaceNavPages(
  project,
  sourceBaseDir,
  entries,
  navBySourcePath,
) {
  const output = [];

  async function readMeta(directoryPath) {
    const metaPath = path.join(sourceBaseDir, directoryPath, 'meta.json');
    if (!(await isFile(metaPath))) return undefined;

    const meta = JSON.parse(await readFile(metaPath, 'utf8'));
    if (!Array.isArray(meta.pages) || meta.pages.some((page) => typeof page !== 'string')) {
      throw new Error(
        `Docs metadata for "${project.package}" must define "pages" as an array of page routes.`,
      );
    }

    return meta;
  }

  async function collectDirectory(directoryPath) {
    const meta = await readMeta(directoryPath);
    if (!meta) {
      return entries
        .filter((entry) => {
          const entryDirectory = path.posix.dirname(entry.workspacePath);
          return (
            entry.workspacePath.startsWith(`${directoryPath}/`) &&
            entryDirectory === directoryPath
          );
        })
        .sort((left, right) => left.workspacePath.localeCompare(right.workspacePath))
        .map((entry) =>
          navBySourcePath.get(entry.workspacePath.replace(/\.(md|mdx)$/iu, '')),
        );
    }

    const pages = [];
    for (const route of meta.pages) {
      const separator = route.match(/^---(.+)---$/u);
      if (separator) {
        pages.push({ separator: true, title: separator[1] });
        continue;
      }

      const normalizedRoute = route.replace(/\.(md|mdx)$/iu, '');
      const sourcePathPrefix = path.posix.join(directoryPath, normalizedRoute);
      const entry = navBySourcePath.get(sourcePathPrefix);
      if (entry) {
        pages.push(entry);
        continue;
      }

      const childMeta = await readMeta(sourcePathPrefix);
      if (childMeta) {
        pages.push({ separator: true, title: childMeta.title ?? toTitleCase(route) });
        pages.push(...(await collectDirectory(sourcePathPrefix)));
        continue;
      }

      throw new Error(
        `Docs metadata for "${project.package}" references unknown page or folder "${route}" in "${directoryPath}".`,
      );
    }

    return pages;
  }

  for (const mount of project.mounts) {
    if (mount.title) output.push({ separator: true, title: mount.title });
    output.push(...(await collectDirectory(mount.source)));
  }

  return output;
}

async function collectWorkspaceNavPages(project, sourceRootDir, sourceBaseDir) {
  const entries = await collectMarkdownEntries(
    project,
    sourceRootDir,
    sourceBaseDir,
    project.excludedSourcePrefixes,
  );
  const navByRoute = new Map();
  const navBySourcePath = new Map();

  for (const entry of entries) {
    const route = getWorkspaceRoutePath(project, entry.workspacePath);
    if (navByRoute.has(route)) {
      throw new Error(
        `Duplicate workspace docs route "${route}" for source "${project.package}".`,
      );
    }

    const page = {
      title: entry.title,
      url: getProjectDocsUrl(project, route),
    };
    navByRoute.set(route, page);
    navBySourcePath.set(
      entry.workspacePath.replace(/\.(md|mdx)$/iu, ''),
      page,
    );
  }

  if (project.mounts) {
    return collectMountedWorkspaceNavPages(
      project,
      sourceBaseDir,
      entries,
      navBySourcePath,
    );
  }

  const metaPath = path.join(sourceBaseDir, 'docs', 'meta.json');
  if (await isFile(metaPath)) {
    const meta = JSON.parse(await readFile(metaPath, 'utf8'));
    if (!Array.isArray(meta.pages) || meta.pages.some((page) => typeof page !== 'string')) {
      throw new Error(
        `Docs metadata for "${project.package}" must define "pages" as an array of page routes.`,
      );
    }

    return meta.pages.map((route) => {
      const separator = route.match(/^---(.+)---$/u);
      if (separator) return { separator: true, title: separator[1] };

      const page = navByRoute.get(route.replace(/\.(md|mdx)$/iu, ''));
      if (!page) {
        throw new Error(
          `Docs metadata for "${project.package}" references unknown page "${route}".`,
        );
      }
      return page;
    });
  }

  return [...navByRoute.entries()]
    .sort(([left], [right]) => {
      if (left === 'index') return -1;
      if (right === 'index') return 1;
      return left.localeCompare(right);
    })
    .map(([, page]) => page);
}

function getExcludedSourcePrefixes(docsSource, allSources) {
  return allSources
    .filter(
      (candidate) =>
        candidate.package !== docsSource.package &&
        candidate.repo === docsSource.repo &&
        candidate.sourceSubpath &&
        (docsSource.sourceSubpath
          ? candidate.sourceSubpath.startsWith(`${docsSource.sourceSubpath}/`)
          : true),
    )
    .map((candidate) =>
      docsSource.sourceSubpath
        ? normalizePath(
            path.posix.relative(docsSource.sourceSubpath, candidate.sourceSubpath),
          )
        : candidate.sourceSubpath,
    )
    .filter(Boolean);
}

function validateDocsSources(docsSources) {
  const seenPackages = new Map();
  const seenSources = new Map();
  const seenRoutes = new Map();

  for (const docsSource of docsSources) {
    if (!docsSource.package) {
      throw new Error('Each docs source must define a non-empty "package" field.');
    }

    if (!docsSource.name) {
      throw new Error(
        `Docs source "${docsSource.package}" must define a non-empty "name" field.`,
      );
    }

    if (!docsSource.repo) {
      throw new Error(
        `Docs source "${docsSource.package}" must define a valid "source" field.`,
      );
    }

    if (
      docsSource.mode &&
      docsSource.mode !== 'workspace' &&
      docsSource.mode !== 'snapshot'
    ) {
      throw new Error(
        `Unsupported docs source mode "${docsSource.mode}" for package "${docsSource.package}".`,
      );
    }

    if (!docsSource.ref) {
      throw new Error(
        `Docs source "${docsSource.package}" must define a non-empty "ref" field.`,
      );
    }

    if (
      docsSource.include !== undefined &&
      (!Array.isArray(docsSource.include) ||
        docsSource.include.length === 0 ||
        docsSource.include.some(
          (pattern) => typeof pattern !== 'string' || pattern.length === 0,
        ))
    ) {
      throw new Error(
        `Docs source "${docsSource.package}" must define "include" as a non-empty array of glob patterns.`,
      );
    }

    if (
      docsSource.mounts !== undefined &&
      (!Array.isArray(docsSource.mounts) ||
        docsSource.mounts.length === 0 ||
        docsSource.mounts.some((mount) => !mount.source))
    ) {
      throw new Error(
        `Docs source "${docsSource.package}" must define "mounts" as a non-empty array with source paths.`,
      );
    }

    const existingPackage = seenPackages.get(docsSource.package);
    if (existingPackage) {
      throw new Error(
        `Duplicate docs package "${docsSource.package}" in docs-sources.json.`,
      );
    }

    const sourceKey = `${docsSource.repo}:${docsSource.sourceSubpath}`;
    const existingSource = seenSources.get(sourceKey);
    if (existingSource) {
      throw new Error(
        `Duplicate docs source "${docsSource.source}" shared by "${existingSource.package}" and "${docsSource.package}".`,
      );
    }

    const routeKey = getProjectRoutePrefix(docsSource);
    const existingRoute = seenRoutes.get(routeKey);
    if (existingRoute) {
      throw new Error(
        `Duplicate docs route "${routeKey}" shared by "${existingRoute.package}" and "${docsSource.package}".`,
      );
    }

    seenPackages.set(docsSource.package, docsSource);
    seenSources.set(sourceKey, docsSource);
    seenRoutes.set(routeKey, docsSource);
  }
}

async function readDocsSourceLocks() {
  if (!(await exists(lockPath))) return {};
  return JSON.parse(await readFile(lockPath, 'utf8'));
}

function resolveRemoteRef(project) {
  const repoUrl = `https://github.com/${getProjectRepo(project.repo)}.git`;
  const output = runCapture('git', [
    'ls-remote',
    repoUrl,
    `refs/heads/${project.ref}`,
    `refs/tags/${project.ref}^{}`,
    `refs/tags/${project.ref}`,
  ]);
  const refs = new Map(
    output
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split(/\s+/u).reverse()),
  );
  const commit =
    refs.get(`refs/tags/${project.ref}^{}`) ??
    refs.get(`refs/heads/${project.ref}`) ??
    refs.get(`refs/tags/${project.ref}`);

  if (!commit) {
    throw new Error(
      `Unable to resolve ref "${project.ref}" for workspace docs source "${project.package}".`,
    );
  }

  return commit;
}

async function resolveWorkspaceLocks(docsSources) {
  const locks = await readDocsSourceLocks();

  if (updateLock) {
    for (const project of docsSources) {
      if (project.mode !== 'workspace') continue;
      locks[project.package] = {
        commit: resolveRemoteRef(project),
        ref: project.ref,
        source: project.source,
      };
    }

    await writeFileIfChanged(lockPath, `${JSON.stringify(locks, null, 2)}\n`);
  }

  for (const project of docsSources) {
    if (project.mode !== 'workspace') continue;
    const lock = locks[project.package];

    if (
      !lock ||
      lock.source !== project.source ||
      lock.ref !== project.ref ||
      !/^[0-9a-f]{40}$/u.test(lock.commit)
    ) {
      throw new Error(
        `Docs source "${project.package}" has no matching workspace lock. Run pnpm docs:lock.`,
      );
    }
  }

  return locks;
}

async function assertProjectNamespaceAvailable(project) {
  const contentDir = path.join(rootDir, 'content', 'docs');
  const routePrefix = getProjectRoutePrefix(project);
  const reservedPaths = [
    path.join(contentDir, routePrefix),
    path.join(contentDir, `${routePrefix}.md`),
    path.join(contentDir, `${routePrefix}.mdx`),
  ];

  const conflicts = [];

  for (const reservedPath of reservedPaths) {
    if (await exists(reservedPath)) {
      conflicts.push(path.relative(rootDir, reservedPath));
    }
  }

  if (conflicts.length > 0) {
    throw new Error(
      [
        `Docs namespace conflict for package "${project.package}".`,
        `The external project reserves "/docs/${routePrefix}", but local docs content already occupies that namespace:`,
        ...conflicts.map((conflict) => `- ${conflict}`),
      ].join('\n'),
    );
  }
}

async function syncProject(project) {
  const localProjectDir = getLocalProjectDir(project.repo);
  let sourceRootDir;
  let sourceKind;
  let useExistingSnapshot = false;

  if (project.mode === 'workspace') {
    const checkoutDir = getWorkspaceProjectDir(project.repo, project.sourceRef);
    const repoUrl = `https://github.com/${getProjectRepo(project.repo)}.git`;

    if (!preparedWorkspaceDirs.has(checkoutDir)) {
      if (!(await isReusableLockedWorkspace(checkoutDir, project.sourceRef))) {
        await mkdir(path.dirname(checkoutDir), { recursive: true });

        if (!(await exists(path.join(checkoutDir, '.git')))) {
          run('git', [
            'clone',
            '--filter=blob:none',
            '--no-checkout',
            repoUrl,
            checkoutDir,
          ]);
        } else {
          run('git', ['remote', 'set-url', 'origin', repoUrl], checkoutDir);
        }

        tryRun('git', ['sparse-checkout', 'disable'], checkoutDir);
        run(
          'git',
          ['fetch', '--depth', '1', '--no-tags', 'origin', project.sourceRef],
          checkoutDir,
        );
        const fetchedCommit = runCapture(
          'git',
          ['rev-parse', 'FETCH_HEAD'],
          checkoutDir,
        );
        if (fetchedCommit !== project.sourceRef) {
          throw new Error(
            `Workspace lock mismatch for "${project.package}": expected ${project.sourceRef}, fetched ${fetchedCommit}.`,
          );
        }
        run('git', ['checkout', '--force', project.sourceRef], checkoutDir);
      }

      preparedWorkspaceDirs.add(checkoutDir);
    }

    sourceRootDir = checkoutDir;
    sourceKind = 'workspace';
  } else if (await exists(localProjectDir)) {
    sourceRootDir = localProjectDir;
    sourceKind = 'local';
  } else if (project.mode === 'snapshot') {
    useExistingSnapshot = true;
    sourceKind = 'snapshot';
  } else {
    const checkoutDir = getRemoteProjectDir(project.repo);
    const repoUrl = `https://github.com/${getProjectRepo(project.repo)}.git`;

    await mkdir(path.dirname(checkoutDir), { recursive: true });

    if (!(await exists(path.join(checkoutDir, '.git')))) {
      run('git', ['clone', '--filter=blob:none', '--no-checkout', repoUrl, checkoutDir]);
    } else {
      run('git', ['remote', 'set-url', 'origin', repoUrl], checkoutDir);
    }

    tryRun('git', ['sparse-checkout', 'disable'], checkoutDir);
    run('git', ['fetch', '--depth', '1', '--no-tags', 'origin', project.sourceRef], checkoutDir);
    run('git', ['checkout', '--force', 'FETCH_HEAD'], checkoutDir);

    sourceRootDir = checkoutDir;
    sourceKind = 'remote-cache';
  }

  const sourceBaseDir = sourceRootDir
    ? project.sourceSubpath
      ? path.join(sourceRootDir, project.sourceSubpath)
      : sourceRootDir
    : undefined;

  if (project.mode === 'workspace') {
    if (!sourceBaseDir || !(await exists(sourceBaseDir))) {
      throw new Error(
        `Docs source "${project.package}" points to "${project.source}", but that path does not exist in ${sourceRootDir}.`,
      );
    }

    return {
      docsDir: sourceBaseDir,
      files: [],
      navPages: await collectWorkspaceNavPages(
        project,
        sourceRootDir,
        sourceBaseDir,
      ),
      project: project.package,
      source: sourceKind,
    };
  }

  const generatedRootDir = getOutputProjectDir(project);
  const generatedDocsDir = path.join(generatedRootDir, getProjectDocsDir());

  if (useExistingSnapshot) {
    if (!(await exists(generatedDocsDir))) {
      throw new Error(
        `Docs source "${project.package}" is snapshot mode, but no local source repo or committed snapshot exists at ${path.relative(rootDir, generatedDocsDir)}.`,
      );
    }

    return {
      docsDir: generatedDocsDir,
      files: [],
      navPages: await collectSnapshotNavPages(project, generatedDocsDir),
      project: project.package,
      source: sourceKind,
    };
  }

  if (!sourceBaseDir || !(await exists(sourceBaseDir))) {
    throw new Error(
      `Docs source "${project.package}" points to "${project.source}", but that path does not exist in ${sourceRootDir}.`,
    );
  }

  await mkdir(generatedDocsDir, { recursive: true });

  const { files, navPages } = await writeFlattenedDocs(
    {
      ...project,
      sourceBaseDir,
    },
    sourceRootDir,
    generatedDocsDir,
  );

  const expectedFiles = new Set(files.map((file) => file.outputPath));
  const existingFiles = await listGeneratedFiles(generatedRootDir);

  for (const outputPath of existingFiles) {
    if (expectedFiles.has(outputPath)) continue;

    await rm(path.join(generatedRootDir, outputPath));
    files.push({
      changed: true,
      deleted: true,
      outputPath,
    });
  }

  await removeEmptyDirectories(generatedRootDir);

  return {
    docsDir: generatedDocsDir,
    files,
    navPages,
    project: project.package,
    source: sourceKind,
  };
}

function printSyncSummary(results) {
  if (results.length === 0) {
    console.log('[docs-sync] no external docs projects configured');
    return;
  }

  for (const result of results) {
    console.log(
      `[docs-sync] ${result.project} (${result.source}): ${path.relative(rootDir, result.docsDir)}`,
    );

    const changedFiles = result.files.filter((file) => file.changed);

    if (changedFiles.length === 0) {
      const unit = result.files.length === 1 ? 'file' : 'files';
      console.log(`  - up to date (${result.files.length} ${unit})`);
      continue;
    }

    for (const file of changedFiles) {
      console.log(
        file.deleted
          ? `  - removed ${file.outputPath}`
          : `  - ${file.outputPath} <= ${file.sourcePath}`,
      );
    }
  }
}

async function writeGeneratedModule(enabledProjects) {
  const imports = enabledProjects.map(
    (project, index) =>
      `import { docs as docsSource${index} } from 'collections/${project.package}/server';`,
  );
  const entries = enabledProjects.map(
    (project, index) => `  ${JSON.stringify(project.package)}: docsSource${index},`,
  );

  const content = `/**
 * Generated by \`scripts/docs-sync.mjs\`.
 * Do not edit manually.
 */
${imports.join('\n')}${imports.length > 0 ? '\n\n' : ''}
export const externalDocsCollections = {
${entries.join('\n')}
} as const;
`;

  await writeFileIfChanged(generatedModulePath, content);
}

async function writeGeneratedNav(results, enabledProjects) {
  const navByPackage = new Map(
    results.map((result) => [result.project, result.navPages ?? []]),
  );

  const entries = enabledProjects.map((project) => ({
    name: project.name,
    package: project.package,
    pages: navByPackage.get(project.package) ?? [],
    route: getProjectRoutePrefix(project),
  }));

  const content = `/**
 * Generated by \`scripts/docs-sync.mjs\`.
 * Do not edit manually.
 */
export const externalDocsNav = ${JSON.stringify(entries, null, 2)} as const;
`;

  await writeFileIfChanged(generatedNavPath, content);
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const enabledOverride = parseEnabledSourceOverride(process.env.DOCS_SOURCE_IDS);
  const docsSources = manifest.map(normalizeDocsSourceConfig);
  validateDocsSources(docsSources);
  const workspaceLocks = await resolveWorkspaceLocks(docsSources);

  const enabledProjects = docsSources
    .filter((project) =>
      enabledOverride === 'all'
        ? true
        : enabledOverride.size > 0
          ? enabledOverride.has(project.package)
          : true,
    )
    .map((project) => ({
      ...project,
      excludedSourcePrefixes: getExcludedSourcePrefixes(project, docsSources),
      sourceRef: workspaceLocks[project.package]?.commit ?? project.ref,
    }));

  const results = [];

  for (const project of enabledProjects) {
    await assertProjectNamespaceAvailable(project);
    results.push(await syncProject(project));
  }

  printSyncSummary(results);
  await writeGeneratedModule(enabledProjects);
  await writeGeneratedNav(results, enabledProjects);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
