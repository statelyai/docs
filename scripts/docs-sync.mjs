import { execFileSync } from 'node:child_process';
import {
  access,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
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

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
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

function getLocalProjectDir(project) {
  return path.resolve(rootDir, '..', project);
}

function getRemoteProjectDir(project) {
  return path.resolve(rootDir, '.cache', 'docs-repos', project);
}

function getGeneratedProjectDir(project) {
  return path.resolve(rootDir, '.cache', 'docs-workspaces', project);
}

function getProjectRepo(project) {
  return `statelyai/${project}`;
}

function getProjectBranch() {
  return 'main';
}

function getProjectDocsDir() {
  return 'docs';
}

function getProjectRoutePrefix(project) {
  return path.join('packages', project);
}

async function listDocsFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listDocsFiles(fullPath, base)));
      continue;
    }

    files.push(path.relative(base, fullPath));
  }

  return files.sort();
}

async function findProjectReadme(projectDir) {
  const entries = await readdir(projectDir, { withFileTypes: true });
  const readmeEntry = entries.find(
    (entry) =>
      entry.isFile() && /^readme\.(md|mdx)$/i.test(entry.name),
  );

  if (!readmeEntry) return null;
  return path.join(projectDir, readmeEntry.name);
}

function toTitleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function hasTitleFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return false;
  return /^title\s*:\s*.+$/m.test(match[1]);
}

function withSyntheticFrontmatter(project, content) {
  if (hasTitleFrontmatter(content)) return content;

  return [
    '---',
    `title: ${toTitleCase(project)}`,
    '---',
    '',
    content,
  ].join('\n');
}

function stripLeadingH1(content) {
  const frontmatterMatch = content.match(/^(---\n[\s\S]*?\n---\n?)([\s\S]*)$/);
  const frontmatter = frontmatterMatch?.[1] ?? '';
  let body = frontmatterMatch?.[2] ?? content;

  body = body.replace(/^\s*\n*/, '');

  body = body.replace(/^#\s+.+\n+/, '');
  body = body.replace(/^(.+)\n(=+)\n+/, '');

  return `${frontmatter}${body}`;
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
        `Docs namespace conflict for project "${project}".`,
        `The external project reserves "/docs/${routePrefix}", but local docs content already occupies that namespace:`,
        ...conflicts.map((conflict) => `- ${conflict}`),
      ].join('\n'),
    );
  }
}

async function syncProject(project) {
  const localProjectDir = getLocalProjectDir(project);
  const localDocsDir = path.join(localProjectDir, getProjectDocsDir());
  let sourceRootDir;
  let sourceKind;

  if (await exists(localProjectDir)) {
    sourceRootDir = localProjectDir;
    sourceKind = 'local';
  } else {
    const checkoutDir = getRemoteProjectDir(project);
  const repoUrl = `https://github.com/${getProjectRepo(project)}.git`;

  await mkdir(path.dirname(checkoutDir), { recursive: true });

  if (!(await exists(path.join(checkoutDir, '.git')))) {
    run('git', ['clone', '--filter=blob:none', '--no-checkout', repoUrl, checkoutDir]);
  } else {
    run('git', ['remote', 'set-url', 'origin', repoUrl], checkoutDir);
  }

  run('git', ['sparse-checkout', 'init', '--cone'], checkoutDir);
  run(
    'git',
    [
      'sparse-checkout',
      'set',
      getProjectDocsDir(),
      'README.md',
      'README.mdx',
      'readme.md',
      'readme.mdx',
    ],
    checkoutDir,
  );
  run('git', ['fetch', '--depth', '1', '--no-tags', 'origin', getProjectBranch()], checkoutDir);
  run('git', ['checkout', '--force', 'FETCH_HEAD'], checkoutDir);

    sourceRootDir = checkoutDir;
    sourceKind = 'remote-cache';
  }
  const sourceDocsDir = path.join(sourceRootDir, getProjectDocsDir());
  const readmePath = await findProjectReadme(sourceRootDir);

  if (!(await exists(sourceDocsDir)) && !readmePath) {
    throw new Error(
      `Docs project "${project}" is configured, but neither "${getProjectDocsDir()}/" nor a root README.md exists in ${sourceKind === 'local' ? sourceRootDir : getProjectRepo(project)}.`,
    );
  }

  const generatedRootDir = getGeneratedProjectDir(project);
  const generatedDocsDir = path.join(generatedRootDir, getProjectDocsDir());

  await rm(generatedRootDir, { recursive: true, force: true });
  await mkdir(generatedDocsDir, { recursive: true });

  if (await exists(sourceDocsDir)) {
    await cp(sourceDocsDir, generatedDocsDir, {
      recursive: true,
      force: true,
    });
  }

  let indexSource = null;
  if (readmePath) {
    await rm(path.join(generatedDocsDir, 'index.md'), { force: true });
    await rm(path.join(generatedDocsDir, 'index.mdx'), { force: true });

    const readmeContent = await readFile(readmePath, 'utf8');
    await writeFile(
      path.join(generatedDocsDir, 'index.md'),
      stripLeadingH1(withSyntheticFrontmatter(project, readmeContent)),
    );
    indexSource = path.relative(sourceRootDir, readmePath);
  }

  return {
    project,
    rootDir: sourceRootDir,
    docsDir: generatedDocsDir,
    source: sourceKind,
    files: await listDocsFiles(generatedDocsDir),
    indexSource,
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

    if (result.indexSource) {
      console.log(`  - docs/index.md <= ${result.indexSource}`);
    }

    if (result.files.length === 0) {
      console.log('  - no files found');
      continue;
    }

    for (const file of result.files) {
      if (file === 'index.md' && result.indexSource) continue;
      console.log(`  - ${path.posix.join(getProjectDocsDir(), file)}`);
    }
  }
}

async function writeGeneratedModule(enabledProjects) {
  const imports = enabledProjects.map(
    (project) => `import { docs as ${project}Docs } from 'collections/${project}/server';`,
  );
  const entries = enabledProjects.map((project) => `  ${project}: ${project}Docs,`);

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
  const enabledProjects = manifest.filter((project) =>
    isDocsSourceEnabled(project, enabledOverride),
  );

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
