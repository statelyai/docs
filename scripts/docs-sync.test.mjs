import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const rootDir = process.cwd();

test('workspace route mapping collapses mounted README pages', async () => {
  const { resolveDocsSourceRoutePath } = await import(
    '../lib/docs-source-route.mjs'
  );
  const source = {
    mounts: [
      {
        source: 'packages/xstate-react/docs',
        route: 'react',
      },
    ],
  };

  assert.equal(
    resolveDocsSourceRoutePath(
      source,
      'packages/xstate-react/docs/README.md',
    ),
    'react/index.md',
  );
  assert.equal(
    resolveDocsSourceRoutePath(
      source,
      'packages/xstate-react/docs/guides/README.mdx',
    ),
    'react/guides/index.mdx',
  );
  assert.equal(resolveDocsSourceRoutePath(source, 'docs/start.md'), null);
  assert.equal(resolveDocsSourceRoutePath({}, 'README.md'), 'index.md');
  assert.equal(
    resolveDocsSourceRoutePath({}, 'docs/guides/README.md'),
    'guides/index.md',
  );
});

test('workspace title fallback only reads a leading heading', async () => {
  const { deriveMarkdownTitle, extractLeadingMarkdownTitle } = await import(
    '../lib/markdown-title.mjs'
  );

  assert.equal(
    extractLeadingMarkdownTitle('---\ndescription: Test\n---\n# Actual title\n'),
    'Actual title',
  );
  assert.equal(
    extractLeadingMarkdownTitle('<!-- note -->\n\nSetext title\n===\n'),
    'Setext title',
  );
  assert.equal(
    extractLeadingMarkdownTitle(
      '<p align="center"><img src="logo.svg" /></p>\n\n# Real title\n',
    ),
    'Real title',
  );
  assert.equal(
    extractLeadingMarkdownTitle('```bash\n# Install deps\n```\n'),
    undefined,
  );
  assert.equal(deriveMarkdownTitle('> Important\n', 'README.md'), 'Overview');
  assert.equal(
    deriveMarkdownTitle('No heading\n', 'guides/get_started.mdx'),
    'get started',
  );
  assert.equal(
    extractLeadingMarkdownTitle('Intro paragraph.\n\n# Later heading\n'),
    undefined,
  );
});

test('workspace links include bare relative targets', async () => {
  const { parseWorkspaceRelativeHref } = await import(
    '../lib/workspace-link.mjs'
  );

  assert.deepEqual(parseWorkspaceRelativeHref('docs/layout.md#usage'), {
    target: 'docs/layout.md',
    suffix: '#usage',
  });
  assert.deepEqual(parseWorkspaceRelativeHref('examples/foo.ts?raw=1'), {
    target: 'examples/foo.ts',
    suffix: '?raw=1',
  });
  assert.deepEqual(parseWorkspaceRelativeHref('../CONTRIBUTING.md'), {
    target: '../CONTRIBUTING.md',
    suffix: '',
  });
  assert.deepEqual(parseWorkspaceRelativeHref('./README.md'), {
    target: './README.md',
    suffix: '',
  });
  assert.equal(parseWorkspaceRelativeHref('/docs/layout'), undefined);
  assert.equal(
    parseWorkspaceRelativeHref('//cdn.example.com/file.js'),
    undefined,
  );
  assert.equal(parseWorkspaceRelativeHref('#usage'), undefined);
  assert.equal(parseWorkspaceRelativeHref('?raw=1'), undefined);
  assert.equal(parseWorkspaceRelativeHref('https://example.com'), undefined);
  assert.equal(parseWorkspaceRelativeHref('mailto:docs@example.com'), undefined);
});

test('workspace docs use locked checkouts and available source-owned navigation', async () => {
  const output = execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  assert.match(output, /agent \(workspace\)/u);
  assert.match(output, /graph \(workspace\)/u);
  assert.match(output, /xstate-v6 \(workspace\)/u);

  for (const source of ['agent', 'graph', 'xstate-v6']) {
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

  const xstateQuickStart = path.join(
    rootDir,
    '.cache',
    'docs-sources',
    'xstate',
    locks['xstate-v6'].commit,
    'docs',
    'start',
    'quick-start.md',
  );
  assert.match(await readFile(xstateQuickStart, 'utf8'), /^title: Quick start$/mu);

  const generatedNav = await readFile(
    path.join(rootDir, 'lib', 'external-docs-nav.generated.ts'),
    'utf8',
  );
  assert.match(generatedNav, /"separator": true/u);
  assert.match(generatedNav, /"title": "Get started"/u);
  assert.match(generatedNav, /"route": "xstate\/v6"/u);
  assert.match(generatedNav, /\/docs\/xstate\/v6\/build\/async-requests/u);
  assert.match(generatedNav, /\/docs\/xstate\/v6\/react\/use-machine/u);
  assert.ok(
    generatedNav.indexOf('/docs/xstate/v6/start/quick-start') <
      generatedNav.indexOf('/docs/xstate/v6/learn/why-state-machines'),
  );
});

test('an unchanged sync preserves locked workspaces', async () => {
  const locks = JSON.parse(
    await readFile(path.join(rootDir, 'docs-sources.lock.json'), 'utf8'),
  );
  const workspacePages = [
    path.join(
      rootDir,
      '.cache',
      'docs-sources',
      'agent',
      locks.agent.commit,
      'docs',
      'index.md',
    ),
    path.join(
      rootDir,
      '.cache',
      'docs-sources',
      'graph',
      locks.graph.commit,
      'README.md',
    ),
    path.join(
      rootDir,
      '.cache',
      'docs-sources',
      'xstate',
      locks['xstate-v6'].commit,
      'docs',
      'start',
      'quick-start.md',
    ),
  ];
  const before = await Promise.all(workspacePages.map((page) => stat(page)));
  const output = execFileSync(process.execPath, ['scripts/docs-sync.mjs'], {
    cwd: rootDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'url.file:///definitely-missing/.insteadOf',
      GIT_CONFIG_VALUE_0: 'https://github.com/',
    },
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
  assert.doesNotMatch(output, /duplicate URL \/docs\/xstate\/v6/u);

  const searchIndex = JSON.parse(
    await readFile(path.join(rootDir, 'lib', 'search-index.json'), 'utf8'),
  );
  assert.equal(
    searchIndex.filter((page) => page.title === '').length,
    0,
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

  const xstateQuickStarts = searchIndex.filter(
    (page) => page.url === '/docs/xstate/v6/start/quick-start',
  );
  assert.equal(xstateQuickStarts.length, 1);
  assert.equal(xstateQuickStarts[0].title, 'Quick start');

  assert.equal(
    searchIndex.filter(
      (page) => page.url === '/docs/xstate/v6/build/async-requests',
    ).length,
    1,
  );
});
