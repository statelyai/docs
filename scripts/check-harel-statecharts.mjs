import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';

const assets = new URL('../public/assets/harel-statecharts/', import.meta.url);
const readJSON = async (path) => JSON.parse(await readFile(new URL(path, assets), 'utf8'));
const coverage = await readJSON('coverage.json');
const captures = await readJSON('captures.json');
const article = await readFile(new URL('../content/docs/harel-statecharts.mdx', import.meta.url), 'utf8');
const ids = [...article.matchAll(/<StatechartExample\s+example="([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(ids, Object.keys(coverage.examples), 'Every registered adaptation appears in reading order');
assert.equal(new Set(ids).size, ids.length, 'Each diagram appears once');
assert.deepEqual((await readdir(new URL('examples/', assets))).sort(), ids.map((id) => `${id}.json`).sort(), 'No orphan or missing source models');
assert.deepEqual(Object.keys(captures).sort(), [...ids].sort(), 'Every native diagram has a recorded screenshot');
const figures = [...new Set(Object.values(coverage.examples).flatMap((example) => example.figures))].sort((a, b) => a - b);
assert.deepEqual(figures, Array.from({ length: 49 }, (_, i) => i + 1), 'All 49 paper figures accounted for');
assert.deepEqual(coverage.sections.map((section) => section.number), ['1', '2', '3', '4', '4.1', '4.2', '4.3', '5', '6', '6.1', '6.2', '6.3', '6.4', '7', '8', '9', '10']);
for (const section of coverage.sections) {
  assert(article.includes(`${section.number}. ${section.title}`), `${section.number}: source section heading present`);
}
for (const title of ['Acknowledgments and references', 'Figure index']) assert(article.includes(`## ${title}`));
for (const id of ids) {
  const source = await readFile(new URL(`examples/${id}.json`, assets));
  assert.equal(captures[id].sourceSha256, createHash('sha256').update(source).digest('hex'), `${id}: screenshot source unchanged`);
  const png = await readFile(new URL(`screenshots/${id}.png`, assets));
  assert.equal(png.subarray(1, 4).toString(), 'PNG', `${id}: real PNG`);
  assert.equal(png.readUInt32BE(16), captures[id].width * captures[id].deviceScaleFactor, `${id}: captured width`);
  assert.equal(png.readUInt32BE(20), captures[id].height * captures[id].deviceScaleFactor, `${id}: captured height`);
}
const base = process.argv[2];
if (base) {
  const get = (path) => fetch(new URL(path, base));
  const response = await get('/docs/harel-statecharts');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>David Harel&#x27;s statecharts paper, explained \| Stately<\/title>|<title>David Harel's statecharts paper, explained \| Stately<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/stately.ai\/docs\/harel-statecharts"/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/<iframe\b/g) ?? []).length, 0, 'Native editors wait for user interaction');
  assert.equal((html.match(/<summary\b/g) ?? []).length, ids.length);
  const editorLinks = [...html.matchAll(/href="(https:\/\/editor\.stately\.ai\/viz[^"]+)"/g)];
  assert.equal(editorLinks.length, ids.length, 'Every example has a read-only editor link');
  for (const [, href] of editorLinks) {
    const url = new URL(href.replaceAll('&amp;', '&'));
    const params = new URLSearchParams(url.hash.slice(1));
    assert.equal(params.has('chrome'), false, 'Full read-only editor controls are visible');
    assert.equal(params.get('panels'), 'structure,simulation');
    assert.equal(url.searchParams.get('activePanels'), '', 'Panels start closed');
  }
  const anchors = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const section of coverage.sections) assert(anchors.has(section.anchor), `${section.number}: stable section anchor`);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(anchors.has(match[1]), `Fragment target exists: ${match[1]}`);
  for (const id of ids) {
    assert(html.includes(`/assets/harel-statecharts/screenshots/${id}.png`), `${id}: fallback in HTML`);
    const image = await get(`/assets/harel-statecharts/screenshots/${id}.png`);
    assert.equal(image.status, 200);
    assert.match(image.headers.get('content-type'), /image\/png/);
    assert.equal((await get(`/assets/harel-statecharts/examples/${id}.json`)).status, 200);
  }
  assert(!/<meta[^>]*name="robots"[^>]*noindex/.test(html));
  const markdown = await get('/docs/harel-statecharts.mdx');
  assert.equal(markdown.status, 200);
  assert.match(await markdown.text(), /10\. Conclusion/);
  const sitemap = await (await get('/sitemap.xml')).text();
  assert(sitemap.includes('https://stately.ai/docs/harel-statecharts'));
  for (const path of ['/docs/statecharts', '/docs/state-machines-and-statecharts']) {
    const page = await get(path);
    assert.equal(page.status, 200);
    assert((await page.text()).includes('/docs/harel-statecharts'), `${path}: guide discoverable`);
  }
  console.log('Rendered Harel guide: sections, anchors, 28 static diagrams, deferred embeds, sources, canonical, sitemap, discovery, Markdown PASS');
}
console.log('Harel paper coverage: 17 numbered sections/subsections, 49 figures, 28 native model/screenshot pairs PASS');
