import { spawn } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { isDocsSourceWatchPath } from '../lib/docs-watch-path.mjs';

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, 'docs-sources.json');
const isWindows = process.platform === 'win32';

let queued = false;
let running = false;
let watchers = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env,
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`));
    });

    child.on('error', reject);
  });
}

async function generate() {
  if (running) {
    queued = true;
    return;
  }

  running = true;
  console.log(`[docs-watch] regenerate ${new Date().toLocaleTimeString()}`);

  try {
    await run(process.execPath, ['scripts/docs-sync.mjs'], {
      ...process.env,
      DOCS_USE_LOCAL_WORKSPACES: '1',
    });
    await run(isWindows ? 'pnpm.cmd' : 'pnpm', ['exec', 'fumadocs-mdx']);
    console.log('[docs-watch] ready');
  } catch (error) {
    console.error('[docs-watch] generation failed');
    console.error(error);
  } finally {
    running = false;

    if (queued) {
      queued = false;
      generate();
    }
  }
}

function queueGenerate(reason) {
  console.log(`[docs-watch] change detected: ${reason}`);
  queued = true;

  setTimeout(() => {
    if (!running && queued) {
      queued = false;
      generate();
    }
  }, 100);
}

async function readProjects() {
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}

function getSourceRepo(source) {
  return String(source).replace(/^\/+|\/+$/g, '').split('/')[0];
}

function closeWatchers() {
  for (const watcher of watchers) {
    watcher.close();
  }

  watchers = [];
}

function addWatcher(targetPath, options, onChange) {
  const watcher = watch(targetPath, options, onChange);
  watchers.push(watcher);
}

async function reloadWatchers() {
  closeWatchers();

  addWatcher(manifestPath, {}, () => {
    queueGenerate('docs-sources.json');
    reloadWatchers().catch((error) => {
      console.error('[docs-watch] failed to reload watchers');
      console.error(error);
    });
  });

  const projects = await readProjects();
  const repos = new Map();

  for (const project of projects) {
    const repo = getSourceRepo(project.source);
    if (!repo) continue;
    const repoProjects = repos.get(repo) ?? [];
    repoProjects.push(project);
    repos.set(repo, repoProjects);
  }

  let watchedRepos = 0;
  for (const [repo, repoProjects] of repos) {
    const projectDir = path.resolve(rootDir, '..', repo);
    if (!(await exists(projectDir))) continue;
    watchedRepos++;

    addWatcher(
      projectDir,
      { recursive: true },
      (_, filename) => {
        if (!filename) return;
        if (
          !repoProjects.some((project) =>
            isDocsSourceWatchPath(project, filename),
          )
        ) {
          return;
        }
        queueGenerate(`${repo}/${filename}`);
      },
    );
  }

  console.log(
    `[docs-watch] watching ${watchedRepos} project${watchedRepos === 1 ? '' : 's'}`,
  );
}

async function main() {
  await reloadWatchers();
  await generate();
}

main().catch((error) => {
  console.error('[docs-watch] failed to start');
  console.error(error);
  process.exitCode = 1;
});
