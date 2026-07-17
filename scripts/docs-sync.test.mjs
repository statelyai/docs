import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const rootDir = process.cwd();

test('source-code links stay in the source repo instead of _assets', async () => {
  execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    stdio: 'pipe',
  });

  for (const packageName of ['agent', 'graph']) {
    await assert.rejects(
      access(
        path.join(
          rootDir,
          'external-docs',
          packageName,
          'docs',
          '_assets',
          'examples',
        ),
      ),
    );
  }

  const agentExamples = await readFile(
    path.join(rootDir, 'external-docs', 'agent', 'docs', 'examples.md'),
    'utf8',
  );
  assert.match(
    agentExamples,
    /https:\/\/github\.com\/statelyai\/agent\/blob\/main\/examples\/twenty-questions\/index\.ts/u,
  );

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
    'external-docs',
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
