import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const rootDir = process.cwd();

test('remote docs use locked source URLs and source-owned navigation', async () => {
  execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    stdio: 'pipe',
  });

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

  const agentIndex = await readFile(
    path.join(rootDir, '.cache', 'docs-workspaces', 'agent', 'docs', 'index.md'),
    'utf8',
  );
  assert.match(
    agentIndex,
    /sourceUrl: "https:\/\/github\.com\/statelyai\/agent\/blob\/[0-9a-f]{40}\/docs\/index\.md"/u,
  );

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

test('an unchanged sync does not rewrite generated files', async () => {
  const generatedPage = path.join(
    rootDir,
    '.cache',
    'docs-workspaces',
    'agent',
    'docs',
    'index.md',
  );
  const before = await stat(generatedPage);
  const output = execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  const after = await stat(generatedPage);

  assert.equal(after.mtimeMs, before.mtimeMs);
  assert.doesNotMatch(output, / <= /u);
  assert.match(output, /up to date/u);
});
