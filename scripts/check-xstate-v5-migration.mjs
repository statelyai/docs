import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getXStateV5Path, xstateV5Slugs } from '../lib/xstate-v5-routes.mjs';

const base = process.argv[2];
assert(base, 'Usage: node scripts/check-xstate-v5-migration.mjs <base-url>');
const get = (path, options) => fetch(new URL(path, base), options);
const search = JSON.parse(await readFile('lib/search-index.json', 'utf8'));
const sitemap = await (await get('/sitemap.xml')).text();
let headingCount = 0;
const versionedLinks = new Set();

for (const slug of xstateV5Slugs) {
  const destination = getXStateV5Path(slug);
  for (const suffix of ['', '.mdx']) {
    const response = await get(`/docs/${slug}${suffix}?source=legacy`, {
      redirect: 'manual',
    });
    assert.equal(response.status, 308, `${slug}${suffix} redirects permanently`);
    const location = new URL(response.headers.get('location'), base);
    assert.equal(location.pathname, `${destination}${suffix}`);
    assert.equal(location.search, '?source=legacy');
  }

  const response = await get(destination);
  assert.equal(response.status, 200, `${destination} returns 200`);
  const html = await response.text();
  assert.match(html, new RegExp(`rel="canonical" href="https://stately\\.ai${destination}"`));
  assert(sitemap.includes(`https://stately.ai${destination}</loc>`));
  assert(!sitemap.includes(`https://stately.ai/docs/${slug}</loc>`));

  for (const match of html.matchAll(/href="(\/docs\/xstate\/v5\/[^"#?]+)(?:[?#][^"]*)?"/gu)) {
    versionedLinks.add(match[1]);
  }

  const entry = search.find((item) => item.url === destination);
  assert(entry, `${destination} appears in search`);
  for (const heading of entry.structuredData.headings) {
    headingCount++;
    assert(html.includes(`id="${heading.id}"`), `${destination}#${heading.id} exists`);
  }
}

const states = await (await get('/docs/xstate/v5/states')).text();
for (const path of [
  '/docs/actor-model',
  '/docs/editor-states-and-transitions',
  '/docs/xstate/v5/context',
]) {
  assert(states.includes(`href="${path}"`), `${path} is linked directly`);
}

for (const path of versionedLinks) {
  assert.equal((await get(path, { redirect: 'manual' })).status, 200, `${path} resolves`);
}

console.log(`Verified ${xstateV5Slugs.length} v5 routes, ${headingCount} heading anchors, and ${versionedLinks.size} internal links.`);
