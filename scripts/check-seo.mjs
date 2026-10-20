import assert from 'node:assert/strict';

const baseUrl = process.argv[2];
assert(baseUrl, 'Usage: node scripts/check-seo.mjs <base-url>');
const canonicalOrigin = 'https://stately.ai';

async function get(path, headers = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    headers,
    signal: AbortSignal.timeout(60_000),
  });
  assert.equal(response.status, 200, `${path} returns 200`);
  return { response, body: await response.text() };
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1],
      match[2].replaceAll('&amp;', '&'),
    ]),
  );
}

const { body: sitemap } = await get('/sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
assert(urls.length > 0, 'Sitemap has URLs');
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs are unique');
assert(
  !sitemap.includes('<lastmod>'),
  'Sitemap omits unverified modification dates',
);
for (const url of urls) {
  assert.equal(
    new URL(url).origin,
    canonicalOrigin,
    'Sitemap uses canonical origin',
  );
}
for (const path of ['/', '/pricing', '/privacy', '/terms', '/blog', '/docs']) {
  assert(urls.includes(`${canonicalOrigin}${path}`), `${path} is in sitemap`);
}
for (const path of ['/docs/privacy', '/docs/xstate-graph', '/docs/mcp']) {
  assert(
    !urls.includes(`${canonicalOrigin}${path}`),
    `${path} redirect is absent`,
  );
}

const blogUrl = urls.find((url) => new URL(url).pathname.startsWith('/blog/'));
assert(blogUrl, 'Sitemap has an article');
const paths = [
  '/',
  '/pricing',
  '/privacy',
  '/terms',
  '/blog',
  '/docs',
  '/docs/xstate',
  '/docs/packages/mcp',
  new URL(blogUrl).pathname,
];

for (const path of paths) {
  const { body } = await get(path);
  const title = body.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title?.includes('Stately'), `${path} has a branded title`);
  const links = [...body.matchAll(/<link\b[^>]*>/g)].map(([tag]) =>
    attributes(tag),
  );
  const canonicals = links.filter((link) => link.rel === 'canonical');
  assert.equal(canonicals.length, 1, `${path} has one canonical`);
  assert.equal(
    new URL(canonicals[0].href).href,
    `${canonicalOrigin}${path}`,
    `${path} canonical`,
  );
  const meta = [...body.matchAll(/<meta\b[^>]*>/g)].map(([tag]) =>
    attributes(tag),
  );
  const content = (name) =>
    meta.find((item) => item.name === name || item.property === name)?.content;
  assert(content('description'), `${path} has a description`);
  assert.equal(
    new URL(content('og:url')).href,
    `${canonicalOrigin}${path}`,
    `${path} social URL`,
  );
  assert.equal(
    content('twitter:card'),
    'summary_large_image',
    `${path} Twitter card`,
  );
  for (const name of ['og:image', 'twitter:image']) {
    assert(
      content(name)?.startsWith(`${canonicalOrigin}/`),
      `${path} absolute ${name}`,
    );
  }
  assert(!content('robots')?.includes('noindex'), `${path} remains indexable`);
  if (path === new URL(blogUrl).pathname) {
    assert.equal(content('og:type'), 'article', `${path} is an article`);
    const schema = [
      ...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
    ]
      .map((match) => JSON.parse(match[1]))
      .find((item) => item['@type'] === 'BlogPosting');
    assert(schema, 'Blog has BlogPosting structured data');
    assert.equal(schema.url, blogUrl, 'Article schema URL matches canonical');
    assert.equal(
      schema.datePublished,
      content('article:published_time'),
      'Article dates agree',
    );
  }
  console.log(`PASS ${path}`);
}

const { response: markdown } = await get('/docs/xstate.mdx');
assert.equal(
  markdown.headers.get('link'),
  `<${canonicalOrigin}/docs/xstate>; rel="canonical"`,
);
assert(markdown.headers.get('content-type')?.startsWith('text/markdown'));
console.log(`PASS sitemap (${urls.length} unique URLs) and Markdown canonical`);
