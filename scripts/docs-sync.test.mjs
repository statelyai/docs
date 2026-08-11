import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const rootDir = process.cwd();

test('workspace docs use a locked checkout and source-owned navigation', async () => {
  const output = execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  assert.match(output, /agent \(workspace\)/u);

  await assert.rejects(
    access(
      path.join(rootDir, 'external-docs', 'agent', 'docs', 'index.md'),
    ),
  );

  await assert.rejects(
    access(
      path.join(
        rootDir,
        'external-docs',
        'graph',
        'docs',
        '_assets',
        'examples',
      ),
    ),
  );

  const locks = JSON.parse(
    await readFile(path.join(rootDir, 'docs-sources.lock.json'), 'utf8'),
  );
  const workspaceIndex = path.join(
    rootDir,
    '.cache',
    'docs-sources',
    'agent',
    locks.agent.commit,
    'docs',
    'index.md',
  );
  assert.match(await readFile(workspaceIndex, 'utf8'), /^title: Agents$/mu);

  const generatedNav = await readFile(
    path.join(rootDir, 'lib', 'external-docs-nav.generated.ts'),
    'utf8',
  );
  assert.match(generatedNav, /"separator": true/u);
  assert.match(generatedNav, /"title": "Get started"/u);

  const graphIndex = await readFile(
    path.join(rootDir, 'external-docs', 'graph', 'docs', 'index.md'),
    'utf8',
  );
  assert.match(
    graphIndex,
    /https:\/\/github\.com\/statelyai\/graph\/blob\/main\/examples\/flow-based-math\.ts/u,
  );
});

test('an unchanged sync preserves the locked workspace', async () => {
  const locks = JSON.parse(
    await readFile(path.join(rootDir, 'docs-sources.lock.json'), 'utf8'),
  );
  const workspacePage = path.join(
    rootDir,
    '.cache',
    'docs-sources',
    'agent',
    locks.agent.commit,
    'docs',
    'index.md',
  );
  const before = await stat(workspacePage);
  const output = execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  const after = await stat(workspacePage);

  assert.equal(after.mtimeMs, before.mtimeMs);
  assert.doesNotMatch(output, / <= /u);
  assert.match(output, /up to date/u);
});

test('search indexing reads Agent from the workspace once', async () => {
  const output = execFileSync(process.execPath, ['scripts/build-search-index.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  assert.doesNotMatch(output, /duplicate URL \/docs\/packages\/agent/u);

  const searchIndex = JSON.parse(
    await readFile(path.join(rootDir, 'lib', 'search-index.json'), 'utf8'),
  );
  const agentIndexes = searchIndex.filter(
    (page) => page.url === '/docs/packages/agent',
  );
  assert.equal(agentIndexes.length, 1);
  assert.equal(agentIndexes[0].title, 'Agents');
});
