import { execFileSync } from 'node:child_process';
import {
  access,
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, 'docs-sources.json');
const generatedModulePath = path.join(
  rootDir,
  'lib',
  'external-docs.generated.ts',
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

function run(command, args, cwd = rootDir) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  });
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
    package: String(config.package),
    repo: getSourceRepo(config.source),
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

function getGeneratedProjectDir(packageName) {
  return path.resolve(rootDir, '.cache', 'docs-workspaces', packageName);
}

function getProjectRepo(repo) {
  return `statelyai/${repo}`;
}

function getProjectBranch() {
  return 'main';
}

function getProjectDocsDir() {
  return 'docs';
}

function getProjectRoutePrefix(packageName) {
  return path.join('packages', packageName);
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function getProjectDocsUrl(packageName, slug) {
  const prefix = `/docs/${normalizePath(getProjectRoutePrefix(packageName))}`;
  return slug === 'index' ? prefix : `${prefix}/${slug}`;
}

function getSourceUrl(repo, sourcePath) {
  return `https://github.com/${getProjectRepo(repo)}/blob/${getProjectBranch()}/${sourcePath}`;
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
  const normalized = body
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
    if (
      entry.isDirectory() &&
      (ignoredDirectoryNames.has(entry.name) || entry.name.startsWith('.'))
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listProjectFiles(fullPath, base)));
      continue;
    }

    files.push(normalizePath(path.relative(base, fullPath)));
  }

  return files.sort();
}

function isWithinExcludedPrefix(file, excludedPrefixes) {
  return excludedPrefixes.some(
    (prefix) => file === prefix || file.startsWith(`${prefix}/`),
  );
}

async function collectMarkdownSourcePaths(projectDir, excludedPrefixes = []) {
  const files = await listProjectFiles(projectDir);
  const markdownSources = new Set();

  for (const file of files) {
    if (isWithinExcludedPrefix(file, excludedPrefixes)) continue;
    if (!isMarkdownPath(file)) continue;

    if (isReadmePath(file) || file.startsWith('docs/')) {
      markdownSources.add(file);
    }
  }

  return [...markdownSources].sort();
}

async function collectMarkdownEntries(docsSource, sourceRootDir, sourceBaseDir, excludedPrefixes) {
  const sourcePaths = await collectMarkdownSourcePaths(sourceBaseDir, excludedPrefixes);

  if (sourcePaths.length === 0) {
    throw new Error(
      `Docs source "${docsSource.package}" is configured, but no README.md/readme.md or docs/**/*.md(x) files were found in ${sourceBaseDir}.`,
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
      const { heading, body: bodyWithoutHeading } = extractLeadingH1(body);
      const title =
        parseFrontmatterValue(raw, 'title') ??
        deriveTitle(docsSource.name, sourcePath, heading);
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
        sourceUrl: getSourceUrl(docsSource.repo, repoRelativeSourcePath),
        title,
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
  packageName,
  repo,
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

      replacementTarget = `${getProjectDocsUrl(packageName, linkedEntry.slug)}${suffix}`;
      break;
    }

    if (!replacementTarget) {
      if (isMarkdownPath(resolvedPath)) {
        replacementTarget = `${getSourceUrl(repo, resolvedPath)}${suffix}`;
      }
    }

    if (!replacementTarget) {
      const absoluteAssetPath = path.join(sourceRootDir, resolvedPath);
      if (!(await isFile(absoluteAssetPath))) {
        continue;
      }

      const assetTarget = `_assets/${resolvedPath}`;
      generatedAssetPaths.set(resolvedPath, assetTarget);
      replacementTarget = `./${normalizePath(assetTarget)}${suffix}`;
    }

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

  for (const entry of entries) {
    const fileName = `${entry.slug}${entry.extension}`;
    const filePath =
      entry.slug === 'index'
        ? `index${entry.extension}`
        : fileName;
    const finalBody = await rewriteEntryBody(
      entry,
      docsEntriesBySourcePath,
      generatedAssetPaths,
      project.package,
      project.repo,
      sourceRootDir,
    );

    await writeFile(
      path.join(generatedDocsDir, filePath),
      `${buildEntryFrontmatter(entry)}${finalBody}`,
    );

    generatedFiles.push({
      outputPath: normalizePath(path.join(getProjectDocsDir(), filePath)),
      sourcePath: entry.sourcePath,
    });
  }

  for (const [sourcePath, assetTarget] of generatedAssetPaths) {
    const absoluteSourcePath = path.join(sourceRootDir, sourcePath);
    const absoluteTargetPath = path.join(generatedDocsDir, assetTarget);

    await mkdir(path.dirname(absoluteTargetPath), { recursive: true });
    await copyFile(absoluteSourcePath, absoluteTargetPath);

    generatedFiles.push({
      outputPath: normalizePath(path.join(getProjectDocsDir(), assetTarget)),
      sourcePath,
    });
  }

  return generatedFiles.sort((a, b) => a.outputPath.localeCompare(b.outputPath));
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

    seenPackages.set(docsSource.package, docsSource);
    seenSources.set(sourceKey, docsSource);
  }
}

async function assertProjectNamespaceAvailable(project) {
  const contentDir = path.join(rootDir, 'content', 'docs');
  const routePrefix = getProjectRoutePrefix(project.package);
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

  if (await exists(localProjectDir)) {
    sourceRootDir = localProjectDir;
    sourceKind = 'local';
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
    run('git', ['fetch', '--depth', '1', '--no-tags', 'origin', getProjectBranch()], checkoutDir);
    run('git', ['checkout', '--force', 'FETCH_HEAD'], checkoutDir);

    sourceRootDir = checkoutDir;
    sourceKind = 'remote-cache';
  }

  const sourceBaseDir = project.sourceSubpath
    ? path.join(sourceRootDir, project.sourceSubpath)
    : sourceRootDir;

  if (!(await exists(sourceBaseDir))) {
    throw new Error(
      `Docs source "${project.package}" points to "${project.source}", but that path does not exist in ${sourceRootDir}.`,
    );
  }

  const generatedRootDir = getGeneratedProjectDir(project.package);
  const generatedDocsDir = path.join(generatedRootDir, getProjectDocsDir());

  await rm(generatedRootDir, { recursive: true, force: true });
  await mkdir(generatedDocsDir, { recursive: true });

  const files = await writeFlattenedDocs(
    {
      ...project,
      sourceBaseDir,
    },
    sourceRootDir,
    generatedDocsDir,
  );

  return {
    docsDir: generatedDocsDir,
    files,
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

    if (result.files.length === 0) {
      console.log('  - no files found');
      continue;
    }

    for (const file of result.files) {
      console.log(`  - ${file.outputPath} <= ${file.sourcePath}`);
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

  await writeFile(generatedModulePath, content);
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const enabledOverride = parseEnabledSourceOverride(process.env.DOCS_SOURCE_IDS);
  const docsSources = manifest.map(normalizeDocsSourceConfig);
  validateDocsSources(docsSources);

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
    }));

  const results = [];

  for (const project of enabledProjects) {
    await assertProjectNamespaceAvailable(project);
    results.push(await syncProject(project));
  }

  printSyncSummary(results);
  await writeGeneratedModule(enabledProjects);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
