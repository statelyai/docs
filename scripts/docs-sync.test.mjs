import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const rootDir = process.cwd();

test('workspace docs use locked checkouts and available source-owned navigation', async () => {
  const output = execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  assert.match(output, /agent \(workspace\)/u);
  assert.match(output, /graph \(workspace\)/u);

  for (const source of ['agent', 'graph']) {
    await assert.rejects(
      access(path.join(rootDir, 'external-docs', source, 'docs', 'index.md')),
    );
  }

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

  const graphIndex = path.join(
    rootDir,
    '.cache',
    'docs-sources',
    'graph',
    locks.graph.commit,
    'README.md',
  );
  assert.match(await readFile(graphIndex, 'utf8'), /^# @statelyai\/graph$/mu);

  const generatedNav = await readFile(
    path.join(rootDir, 'lib', 'external-docs-nav.generated.ts'),
    'utf8',
  );
  assert.match(generatedNav, /"separator": true/u);
  assert.match(generatedNav, /"title": "Get started"/u);
});

test('an unchanged sync preserves locked workspaces', async () => {
  const locks = JSON.parse(
    await readFile(path.join(rootDir, 'docs-sources.lock.json'), 'utf8'),
  );
  const workspacePages = ['agent', 'graph'].map((source) =>
    path.join(
      rootDir,
      '.cache',
      'docs-sources',
      source,
      locks[source].commit,
      source === 'graph' ? 'README.md' : path.join('docs', 'index.md'),
    ),
  );
  const before = await Promise.all(workspacePages.map((page) => stat(page)));
  const output = execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  const after = await Promise.all(workspacePages.map((page) => stat(page)));

  assert.deepEqual(
    after.map((entry) => entry.mtimeMs),
    before.map((entry) => entry.mtimeMs),
  );
  assert.doesNotMatch(output, / <= /u);
  assert.match(output, /up to date/u);
});

test('search indexing reads public workspaces once', async () => {
  const output = execFileSync(process.execPath, ['scripts/build-search-index.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  assert.doesNotMatch(output, /duplicate URL \/docs\/packages\/agent/u);
  assert.doesNotMatch(output, /duplicate URL \/docs\/packages\/graph/u);

  const searchIndex = JSON.parse(
    await readFile(path.join(rootDir, 'lib', 'search-index.json'), 'utf8'),
  );
  const agentIndexes = searchIndex.filter(
    (page) => page.url === '/docs/packages/agent',
  );
  assert.equal(agentIndexes.length, 1);
  assert.equal(agentIndexes[0].title, 'Agents');

  const graphIndexes = searchIndex.filter(
    (page) => page.url === '/docs/packages/graph',
  );
  assert.equal(graphIndexes.length, 1);
  assert.equal(graphIndexes[0].title, '@statelyai/graph');
});
