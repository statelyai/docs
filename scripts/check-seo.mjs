import assert from 'node:assert/strict';
import { blogAliases } from '../lib/blog-aliases.mjs';

const baseUrl = process.argv[2];
assert(baseUrl, 'Usage: node scripts/check-seo.mjs <base-url>');
const canonicalOrigin = 'https://stately.ai';

async function get(path, headers = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(60_000),
  });
  assert.equal(response.status, 200, `${path} returns 200`);
  return { response, body: await response.text() };
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1].toLowerCase(),
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
const stateMachineArticle = '/blog/2023-10-02-what-is-a-state-machine';
const aliasSources = new Set(blogAliases.map(({ source }) => source));
assert.equal(
  aliasSources.size,
  blogAliases.length,
  'Blog alias sources are unique',
);
for (const { source, destination } of blogAliases) {
  for (const path of [source, destination]) {
    assert.match(
      path,
      /^\/blog\/[a-z0-9/-]+$/,
      `${path} is a literal blog path`,
    );
  }
  assert(
    !aliasSources.has(destination),
    `${source} does not redirect to an alias`,
  );
  assert(
    !urls.includes(`${canonicalOrigin}${source}`),
    `${source} alias is absent from sitemap`,
  );
  assert(
    urls.includes(`${canonicalOrigin}${destination}`),
    `${destination} is in sitemap`,
  );
  const response = await fetch(new URL(source, baseUrl), {
    redirect: 'manual',
    signal: AbortSignal.timeout(60_000),
  });
  assert.equal(response.status, 308, `${source} redirects permanently`);
  const location = response.headers.get('location');
  assert(location, `${source} has a redirect destination`);
  assert.equal(
    new URL(location, baseUrl).href,
    new URL(destination, baseUrl).href,
    `${source} redirects to ${destination}`,
  );
  console.log(`PASS redirect ${source} -> ${destination}`);
}
for (const path of ['/docs/privacy', '/docs/xstate-graph', '/docs/mcp']) {
  assert(
    !urls.includes(`${canonicalOrigin}${path}`),
    `${path} redirect is absent`,
  );
}

const blogUrl = urls.find((url) => new URL(url).pathname.startsWith('/blog/'));
assert(blogUrl, 'Sitemap has an article');
const paths = new Set([
  '/',
  '/pricing',
  '/privacy',
  '/terms',
  '/blog',
  '/docs',
  '/docs/xstate',
  '/docs/packages/mcp',
  '/docs/state-machines-and-statecharts',
  '/docs/actor-model',
  stateMachineArticle,
  new URL(blogUrl).pathname,
  ...blogAliases.map(({ destination }) => destination),
]);

for (const path of paths) {
  const { response, body } = await get(path);
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
  const contents = (name) =>
    meta
      .filter(
        (item) =>
          item.name?.toLowerCase() === name ||
          item.property?.toLowerCase() === name,
      )
      .map((item) => item.content)
      .filter((value) => value !== undefined);
  const content = (name) => contents(name)[0];
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
  for (const directive of [
    ...contents('robots'),
    ...contents('googlebot'),
    response.headers.get('x-robots-tag'),
  ]) {
    assert(
      !/\b(noindex|none)\b/i.test(directive ?? ''),
      `${path} remains indexable`,
    );
  }
  if (path === '/') {
    assert(
      /state machine editor/i.test(title),
      'Homepage title identifies the product category',
    );
    assert(
      !links.some(
        (link) =>
          link.rel === 'alternate' &&
          link.type === 'text/markdown' &&
          new URL(link.href, baseUrl).pathname === '/llms.txt',
      ),
      'Homepage does not advertise the Docs index as equivalent Markdown',
    );
    const anchors = [...body.matchAll(/<a\b[^>]*>/g)].map(([tag]) =>
      attributes(tag),
    );
    for (const href of [
      stateMachineArticle,
      '/docs/state-machines-and-statecharts',
      '/docs/actor-model',
    ]) {
      assert(
        anchors.some((anchor) => anchor.href === href),
        `Homepage links to ${href}`,
      );
    }
    const schema = [
      ...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g),
    ]
      .flatMap((match) => JSON.parse(match[1])['@graph'] ?? [])
      .find((item) => item['@type'] === 'FAQPage');
    assert(schema?.mainEntity.length > 0, 'Homepage has FAQ structured data');
    const visibleFaq = [
      ...body.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g),
    ]
      .map(([, detail]) => [
        detail.match(/<summary\b[^>]*>\s*<span\b[^>]*>([\s\S]*?)<\/span>/)?.[1],
        detail.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1],
      ])
      .map((pair) =>
        pair.map((text) =>
          text
            ?.replace(/<[^>]*>/g, '')
            .replace(/&#x([\da-f]+);/gi, (_, hex) =>
              String.fromCodePoint(parseInt(hex, 16)),
            )
            .replace(/&#(\d+);/g, (_, decimal) =>
              String.fromCodePoint(Number(decimal)),
            )
            .replaceAll('&quot;', '"')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('&amp;', '&')
            .trim(),
        ),
      );
    for (const question of schema.mainEntity) {
      assert(
        visibleFaq.some(
          ([q, a]) => q === question.name && a === question.acceptedAnswer.text,
        ),
        `FAQ structured data matches the visible answer for ${question.name}`,
      );
    }
    assert.equal(
      schema.mainEntity.length,
      visibleFaq.length,
      'Every visible FAQ has structured data',
    );
  }
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
