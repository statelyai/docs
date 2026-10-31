import assert from 'node:assert/strict';

const base = process.argv[2];
assert(base, 'Usage: node scripts/check-statecharts.mjs <base-url>');
const route = '/docs/statecharts';
const canonical = `https://stately.ai${route}`;
const get = (path, options) => fetch(new URL(path, base), options);

const response = await get(route);
assert.equal(response.status, 200);
const html = await response.text();
assert.match(
  html,
  /<title>What are statecharts\? State chart examples \| Stately<\/title>/,
);
assert.match(
  html,
  /rel="canonical" href="https:\/\/stately.ai\/docs\/statecharts"/,
);
assert.match(html, /Statecharts extend state machines with nested states/);
assert.match(html, /name="twitter:card" content="summary_large_image"/);
assert(!/<meta[^>]*name="robots"[^>]*noindex/.test(html));
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert.equal(
  (html.match(/<iframe\b/g) ?? []).length,
  0,
  'Embeds wait for interaction',
);
assert.equal((html.match(/<summary\b/g) ?? []).length, 3);
for (const file of ['dog-states', 'dog-nested-states', 'dog-parallel-states']) {
  assert.match(
    html,
    new RegExp(`<img[^>]+src="/assets/statecharts/${file}\\.svg"`),
  );
  const image = await get(`/assets/statecharts/${file}.svg`);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/svg\+xml/);
}
for (const path of [
  '/docs',
  '/docs/state-machines-and-statecharts',
  '/docs/glossary',
  '/docs/xstate',
  '/',
]) {
  const page = await get(path);
  assert.equal(page.status, 200);
  assert.match(
    await page.text(),
    /href="\/docs\/statecharts"/,
    `${path} links to the guide`,
  );
}
for (const suffix of ['', '?source=historical-link']) {
  const redirect = await get(
    `/docs/xstate/basics/what-is-a-statechart${suffix}`,
    { redirect: 'manual' },
  );
  assert.equal(redirect.status, 308);
  const destination = new URL(redirect.headers.get('location'), base);
  assert.equal(destination.pathname, route);
  assert.equal(destination.search, suffix);
}
const sitemap = await (await get('/sitemap.xml')).text();
assert.equal(
  (sitemap.match(new RegExp(`<loc>${canonical}</loc>`, 'g')) ?? []).length,
  1,
);
assert(!sitemap.includes('/docs/xstate/basics/what-is-a-statechart'));
const markdown = await get(`${route}.mdx`);
assert.equal(markdown.status, 200);
assert.match(
  markdown.headers.get('link'),
  /https:\/\/stately.ai\/docs\/statecharts/,
);
assert.match(await markdown.text(), /Nested states/);
const announcement = await get('/blog/2023-01-19-introducing-the-stately-docs');
assert.equal(announcement.status, 200);
assert.match(
  await announcement.text(),
  /href="https:\/\/stately.ai\/docs\/xstate"[^>]*>jump straight into XState/,
  'The coding invitation still links to XState documentation',
);
console.log(
  'Statecharts guide, static diagrams, deferred embeds, discovery links, 308 redirect, sitemap, and Markdown: PASS',
);
