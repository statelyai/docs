import assert from 'node:assert/strict';
import test from 'node:test';
import { findProjection } from 'fumadocs-core/page-tree';
import { searchPath } from 'fumadocs-core/breadcrumb';
import { withXStateVersions } from '../lib/xstate-docs-versions.ts';

const page = (url) => ({ type: 'page', name: url, url });
const folder = (id, children) => ({ type: 'folder', name: id, $id: id, children });
const tree = {
  name: 'Docs',
  children: [
    folder('xstate/v6', [page('/docs/xstate/v6/quick-start'), page('/docs/xstate/v6/states')]),
    folder('get-started', [page('/docs/xstate'), page('/docs/quick-start')]),
    folder('state-machines', [page('/docs/states'), page('/docs/input')]),
    folder('actors', [page('/docs/actors')]),
    folder('guides', [page('/docs/testing')]),
    folder('studio', [page('/docs/studio')]),
  ],
};

test('native version roots preserve URLs and project matching pages', () => {
  const result = withXStateVersions(tree);
  const [v6, v5] = result.children;
  assert.equal(v6.root, 'xstate-version');
  assert.equal(v5.root, 'xstate-version');
  const v5Page = searchPath(result.children, '/docs/states').at(-1);
  const v6Page = searchPath(result.children, '/docs/xstate/v6/states').at(-1);
  assert.equal(findProjection(v5, v6, v5Page).url, '/docs/xstate/v6/states');
  assert.equal(findProjection(v6, v5, v6Page).url, '/docs/states');
  assert.equal(findProjection(v5, v6, searchPath(result.children, '/docs/input').at(-1)), undefined);
  assert.equal(v6.index.url, '/docs/xstate/v6/quick-start');
  assert.equal(v5.index.url, '/docs/xstate');
  assert.equal(searchPath(result.children, '/docs/studio').at(-1).url, '/docs/studio');
});

test('keeps the tree unchanged when v6 docs are disabled', () => {
  const withoutV6 = { ...tree, children: tree.children.slice(1) };
  assert.equal(withXStateVersions(withoutV6), withoutV6);
});
