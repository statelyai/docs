import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.argv[2];
assert(base, 'Usage: node scripts/check-disabled-xstate-v6.mjs <base-url>');

for (const path of [
  '/docs',
  '/docs/index.mdx',
  '/docs/what-is-xstate',
  '/docs/what-is-xstate.mdx',
]) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} returns 200`);
  const content = await response.text();
  assert(!content.includes('/docs/xstate/v6/quick-start'), `${path} omits the v6 link`);
  assert(!content.includes('npm install xstate@beta'), `${path} omits the beta install`);
  assert(content.includes('/docs/xstate/v5/quick-start'), `${path} links to v5`);
}

const v6 = await fetch(new URL('/docs/xstate/v6/quick-start', base));
assert.equal(v6.status, 404);
const search = JSON.parse(await readFile('lib/search-index.json', 'utf8'));
assert(!search.some((entry) => entry.url.startsWith('/docs/xstate/v6')));
console.log('Disabled v6 pages, Markdown, and search: PASS');
