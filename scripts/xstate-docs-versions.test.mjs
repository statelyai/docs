import assert from 'node:assert/strict';
import test from 'node:test';
import { findProjection } from 'fumadocs-core/page-tree';
import { searchPath } from 'fumadocs-core/breadcrumb';
import { withXStateVersions, xstateVersionPagePairs } from '../lib/xstate-docs-versions.ts';
import { externalDocsNav } from '../lib/external-docs-nav.generated.ts';
import { xstateV5Slugs, getXStateV5Path } from '../lib/xstate-v5-routes.mjs';
import { filterDocsSourceGates, isDocsSourceEnabled } from '../lib/docs-source-enabled.mjs';
import { resolveXStateV5Href, resolveXStateV5RelativeHref } from '../lib/xstate-v5-routes.mjs';

const page = (url) => ({ type: 'page', name: url, url });
const folder = (id, children) => ({ type: 'folder', name: id, $id: id, children });
const tree = {
  name: 'Docs',
  children: [
    folder('xstate/v6', [page('/docs/xstate/v6/quick-start'), page('/docs/xstate/v6/states')]),
    folder('get-started', [page('/docs/xstate/v5'), page('/docs/xstate/v5/quick-start')]),
    folder('state-machines', [page('/docs/xstate/v5/states'), page('/docs/xstate/v5/input')]),
    folder('actors', [page('/docs/xstate/v5/actors')]),
    folder('guides', [page('/docs/xstate/v5/testing')]),
    folder('studio', [page('/docs/studio')]),
  ],
};

test('native version roots preserve URLs and project matching pages', () => {
  const result = withXStateVersions(tree, true);
  const [v6, v5] = result.children;
  assert.equal(v6.root, 'xstate-version');
  assert.equal(v5.root, 'xstate-version');
  const v5Page = searchPath(result.children, '/docs/xstate/v5/states').at(-1);
  const v6Page = searchPath(result.children, '/docs/xstate/v6/states').at(-1);
  assert.equal(findProjection(v5, v6, v5Page).url, '/docs/xstate/v6/states');
  assert.equal(findProjection(v6, v5, v6Page).url, '/docs/xstate/v5/states');
  assert.equal(findProjection(v5, v6, searchPath(result.children, '/docs/xstate/v5/input').at(-1)), undefined);
  assert.equal(v6.index.url, '/docs/xstate/v6/quick-start');
  assert.equal(v5.index.url, '/docs/xstate/v5');
  const reactPath = searchPath(result.children, '/docs/xstate/v5/xstate-react');
  assert.equal(reactPath[0], v5);
  assert.equal(searchPath(result.children, '/docs/studio').at(-1).url, '/docs/studio');
});

test('keeps the tree unchanged when v6 docs are disabled', () => {
  const withoutV6 = { ...tree, children: tree.children.slice(1) };
  assert.equal(withXStateVersions(withoutV6, false), withoutV6);
});

test('rewrites legacy links without losing fragments or query strings', () => {
  assert.equal(resolveXStateV5Href('/docs/states#state-object'), '/docs/xstate/v5/states#state-object');
  assert.equal(resolveXStateV5Href('/docs/actions.mdx?source=docs#assign-action'), '/docs/xstate/v5/actions.mdx?source=docs#assign-action');
  assert.equal(resolveXStateV5Href('/docs/statecharts'), '/docs/statecharts');
});

test('resolves v5 relative links against their original location', () => {
  assert.equal(resolveXStateV5RelativeHref('actor-model#intro', 'states'), '/docs/actor-model#intro');
  assert.equal(resolveXStateV5RelativeHref('context', 'states'), '/docs/xstate/v5/context');
  assert.equal(resolveXStateV5RelativeHref('../../blog/example', 'xstate'), '/blog/example');
  assert.equal(resolveXStateV5RelativeHref('#state-object', 'states'), '#state-object');
  assert.equal(resolveXStateV5RelativeHref('https://example.com', 'states'), 'https://example.com');
});

test('fails when enabled version navigation is incomplete', () => {
  const withoutV6 = { ...tree, children: tree.children.slice(1) };
  assert.throws(() => withXStateVersions(withoutV6, true), /v6.*navigation is missing/i);
  const withoutV5Section = { ...tree, children: tree.children.filter((node) => node.$id !== 'actors') };
  assert.throws(() => withXStateVersions(withoutV5Section, true), /v5.*navigation is incomplete/i);
  const withoutQuickStart = { ...tree, children: [folder('xstate/v6', [page('/docs/xstate/v6/states')]), ...tree.children.slice(1)] };
  assert.throws(() => withXStateVersions(withoutQuickStart, true), /quick start is missing/i);
});

test('version pairs match the synced v6 navigation and v5 routes', {
  skip: !isDocsSourceEnabled('xstate-v6', process.env.DOCS_SOURCE_IDS),
}, () => {
  const v6 = externalDocsNav.find((item) => item.package === 'xstate-v6');
  assert(v6, 'XState v6 must be synced for this test');
  const v6Urls = new Set(v6.pages.flatMap((item) => 'url' in item ? [item.url] : []));
  const v5Urls = new Set(xstateV5Slugs.map(getXStateV5Path));
  for (const [v5Url, v6Url] of xstateVersionPagePairs) {
    assert(v5Urls.has(v5Url), `${v5Url} is a v5 route`);
    assert(v6Urls.has(v6Url), `${v6Url} is in the synced v6 navigation`);
  }
});

test('source selection enables all sources by default and honors overrides', () => {
  assert.equal(isDocsSourceEnabled('xstate-v6', undefined), true);
  assert.equal(isDocsSourceEnabled('xstate-v6', 'agent'), false);
  assert.equal(isDocsSourceEnabled('xstate-v6', 'agent, xstate-v6'), true);
  assert.equal(isDocsSourceEnabled('xstate-v6', '*'), true);
});

test('source-gated Markdown follows the source selection', () => {
  const source = '<DocsSourceGate sourceId="xstate-v6">beta</DocsSourceGate><DocsSourceGate sourceId="xstate-v6" enabled={false}>stable</DocsSourceGate>';
  assert.equal(filterDocsSourceGates(source, undefined), 'beta');
  assert.equal(filterDocsSourceGates(source, 'agent'), 'stable');
});
