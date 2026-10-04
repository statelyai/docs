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
      'Get Started',
      'Core Concepts',
      'State Machines',
      'Actors',
      'Guides',
      'XState Store',
      'Packages',
      'Developer Tools',
      'Stately Studio',
      'Glossary',
    ],
  );
  const started = tree.children.find((node) => node.name === 'Get Started');
  assert.deepEqual(
    started.children.slice(0, 3).map((node) => [node.name, node.url]),
    [
      ['Quick start', '/docs/quick-start'],
      ['Install XState', '/docs/installation'],
      ['Migrate to XState v5', '/docs/migration'],
    ],
  );
  const store = tree.children.find((node) => node.name === 'XState Store');
  assert.equal(store.index.url, '/docs/xstate-store');
  assert.equal(
    store.children.find((node) => node.name === 'React').url,
    '/docs/xstate-store/react',
  );
  const studio = tree.children.find((node) => node.name === 'Stately Studio');
  const design = studio.children.find((node) => node.name === 'Design mode');
  assert.equal(
    design.children.find((node) => node.name === 'Generate with AI').url,
    '/docs/generate-flow',
  );
});
