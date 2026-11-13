import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
  /<title>What are statecharts\? Examples and notation \| Stately<\/title>/,
);
assert.match(
  html,
  /rel="canonical" href="https:\/\/stately.ai\/docs\/statecharts"/,
);
assert.match(
  html,
  /Learn what statecharts are, how they extend state machines/,
);
assert.match(html, /name="twitter:card" content="summary_large_image"/);
assert(!/<meta[^>]*name="robots"[^>]*noindex/.test(html));
assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
assert.equal(
  (html.match(/<iframe\b/g) ?? []).length,
  0,
  'Embeds wait for interaction',
);
assert.equal((html.match(/<summary\b/g) ?? []).length, 3);
for (const file of ['coffee-order', 'coffee-nested', 'coffee-donut-parallel']) {
  assert.match(
    html,
    new RegExp(`<img[^>]+src="/assets/statecharts/${file}\\.jpg"`),
  );
  const image = await get(`/assets/statecharts/${file}.jpg`);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/jpeg/);
}
assert.match(html, /data-statechart-actions/);
assert.match(
  html.replaceAll('<!-- -->', ''),
  /Try the sample simulation<\/a> without an account\. Sign in/,
);
const sourceModels = {};
for (const id of ['coffee-order', 'coffee-nested', 'coffee-donut-parallel']) {
  const source = await get(`/assets/statecharts/examples/${id}.json`);
  assert.equal(source.status, 200);
  const model = await source.json();
  assert(model.states);
  assert.deepEqual(
    model,
    JSON.parse(
      await readFile(
        new URL(
          `../public/assets/statecharts/examples/${id}.json`,
          import.meta.url,
        ),
        'utf8',
      ),
    ),
    `${id} downloads the checked-in definition`,
  );
  sourceModels[id] = model;
}
const handoffs = [
  ...html.matchAll(
    /<div data-statechart-handoff="([^"]+)"[^>]*>(.*?)<\/div>/gs,
  ),
];
assert.equal(
  handoffs.length,
  3,
  'All examples expose an edit and download handoff in initial HTML',
);
assert.deepEqual(
  handoffs.map(([, id]) => id).sort(),
  Object.keys(sourceModels).sort(),
  'Each distinct example has a handoff',
);
for (const [, id, content] of handoffs) {
  assert(sourceModels[id], `Known handoff: ${id}`);
  assert(
    !content.includes('<details'),
    'Edit links do not require opening a disclosure',
  );
  assert.match(
    content,
    new RegExp(`href="/assets/statecharts/examples/${id}\\.json" download`),
  );
  assert.match(content, /Changes in this view are not saved to/);
  assert.match(content, /plausible-event-name=Editor\+CTA/);
  const href = content.match(
    /href="(https:\/\/editor\.stately\.ai\/embed[^"]+)"/,
  )[1];
  const edit = new URL(href.replaceAll('&amp;', '&'));
  assert.equal(edit.searchParams.get('mode'), 'editing');
  assert.equal(edit.searchParams.get('format'), 'xstate-json');
  assert.equal(edit.searchParams.get('source'), 'docs-statecharts');
  const editModel = JSON.parse(
    Buffer.from(edit.searchParams.get('machine'), 'base64url').toString('utf8'),
  );
  assert.deepEqual(
    editModel,
    sourceModels[id],
    `${id} edits the downloaded model`,
  );
  const vizHref = [
    ...html.matchAll(/href="(https:\/\/editor\.stately\.ai\/viz[^"]+)"/g),
  ]
    .map((match) => new URL(match[1].replaceAll('&amp;', '&')))
    .find((url) => {
      const fragment = new URLSearchParams(url.hash.slice(1));
      return fragment.get('machine') === edit.searchParams.get('machine');
    });
  assert(vizHref, `${id} read-only and editable links carry identical models`);
}
const overview = await (
  await get('/docs/state-machines-and-statecharts')
).text();
assert.match(
  overview,
  /<title>What are state machines\? States, events, and transitions \| Stately<\/title>/,
);
assert.match(
  overview,
  /name="description" content="Learn state machine basics/,
);
assert.match(
  overview,
  /rel="canonical" href="https:\/\/stately.ai\/docs\/state-machines-and-statecharts"/,
);
const harel = await (await get('/docs/harel-statecharts')).text();
assert.match(
  harel,
  /rel="canonical" href="https:\/\/stately.ai\/docs\/harel-statecharts"/,
);
assert.match(
  harel,
  /practical introduction with editable coffee and donut examples/,
);
assert(
  !harel.includes('data-statechart-handoff'),
  'Paper adaptations retain their existing read-only role',
);
const imports = await (await get('/docs/import-from-code')).text();
assert.match(imports, /id="import-an-example-in-the-stately-editor"/);

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
  'Statecharts guide, page roles, exact-model edit/download handoffs, static diagrams, deferred embeds, discovery links, 308 redirect, sitemap, and Markdown: PASS',
);
