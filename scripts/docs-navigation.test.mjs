import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { loader } from 'fumadocs-core/source';

async function metadataFiles(dir, prefix = '') {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(
        ...(await metadataFiles(path.join(dir, entry.name), relative)),
      );
    } else if (entry.name === 'meta.json') {
      files.push({
        type: 'meta',
        path: relative,
        data: JSON.parse(await readFile(path.join(dir, entry.name), 'utf8')),
      });
    }
  }
  return files;
}

test('native navigation preserves grouping and flat documentation URLs', async () => {
  const source = loader(
    { files: await metadataFiles('content/docs') },
    { baseUrl: '/docs' },
  );
  const tree = source.getPageTree();
  assert.deepEqual(
    tree.children.map((node) => node.name),
    [
      'XState v5',
      'Core Concepts',
      'State Machines (v5)',
      'Actors (v5)',
      'Agents',
      'Guides (v5)',
      'XState Store',
      'Packages',
      'Developer Tools',
      'Stately Studio',
      'Glossary',
      'Self-hosting',
    ],
  );
  const started = tree.children.find((node) => node.name === 'XState v5');
  assert.deepEqual(
    started.children.slice(0, 4).map((node) => [node.name, node.url]),
    [
      ['XState v5 overview', '/docs/xstate/v5'],
      ['Quick start', '/docs/xstate/v5/quick-start'],
      ['Install XState', '/docs/xstate/v5/installation'],
      ['Migrate to XState v5', '/docs/xstate/v5/migration'],
    ],
  );
  const store = tree.children.find((node) => node.name === 'XState Store');
  assert.equal(store.index.url, '/docs/xstate-store');
  assert.equal(
    store.children.filter((node) => node.url === '/docs/xstate-store').length,
    0,
  );
  assert.equal(
    store.children.find((node) => node.name === 'React').url,
    '/docs/xstate-store/react',
  );
  assert.deepEqual(
    store.children
      .filter((node) => node.name.startsWith('Compare to '))
      .map((node) => node.url),
    [
      '/docs/xstate-store/compare-zustand',
      '/docs/xstate-store/compare-jotai',
      '/docs/xstate-store/compare-recoil',
      '/docs/xstate-store/compare-redux',
      '/docs/xstate-store/compare-pinia',
    ],
  );
  const studio = tree.children.find((node) => node.name === 'Stately Studio');
  const design = studio.children.find((node) => node.name === 'Design mode');
  assert.equal(
    design.children.find((node) => node.name === 'Generate with AI').url,
    '/docs/generate-flow',
  );
});
