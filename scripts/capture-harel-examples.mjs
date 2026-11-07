import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const assets = new URL('../public/assets/harel-statecharts/', import.meta.url);
const coverage = JSON.parse(await readFile(new URL('coverage.json', assets), 'utf8'));
const selected = process.argv.slice(2);
const examples = Object.keys(coverage.examples).filter((id) => !selected.length || selected.includes(id));
const previous = await readFile(new URL('captures.json', assets), 'utf8').then(JSON.parse).catch(() => ({}));
const viewport = { width: 1800, height: 1400 };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir(new URL('screenshots/', assets), { recursive: true });
try {
  for (const id of examples) {
    const source = await readFile(new URL(`examples/${id}.json`, assets), 'utf8');
    const machine = JSON.parse(source);
    const url = new URL('https://editor.stately.ai/viz');
    url.searchParams.set('source', 'docs-harel-statecharts');
    url.hash = new URLSearchParams({ machine: Buffer.from(JSON.stringify(machine)).toString('base64url'), format: 'xstate-json', chrome: 'plain', theme: 'light', interactive: '1', panels: 'none' }).toString();
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url.href, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-flow-node-id]').first().waitFor({ timeout: 45000 });
    await page.waitForTimeout(1200);
    const bounds = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-flow-node-id], [data-flow-edge-id], [data-entity="edge"], [data-testid^="node-initial-marker:"]');
      const rects = Array.from(elements, (el) => el.getBoundingClientRect()).filter((r) => r.width || r.height);
      const left = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.left)) - 45));
      const top = Math.max(0, Math.floor(Math.min(...rects.map((r) => r.top)) - 35));
      const right = Math.min(innerWidth, Math.ceil(Math.max(...rects.map((r) => r.right)) + 55));
      const bottom = Math.min(innerHeight, Math.ceil(Math.max(...rects.map((r) => r.bottom)) + 35));
      return { x: left, y: top, width: right - left, height: bottom - top, nodes: document.querySelectorAll('[data-flow-node-id]').length };
    });
    assert(bounds.nodes > 1 && bounds.width > 50 && bounds.height > 50, `${id}: native graph rendered`);
    assert.deepEqual(errors, [], `${id}: no browser runtime errors`);
    const { nodes, ...clip } = bounds;
    await page.screenshot({ path: fileURLToPath(new URL(`screenshots/${id}.png`, assets)), clip, animations: 'disabled', timeout: 30000 });
    previous[id] = { width: clip.width, height: clip.height, viewport, clip, deviceScaleFactor: 2, nodes, sourceSha256: createHash('sha256').update(source).digest('hex'), capturedAt: new Date().toISOString(), renderer: 'https://editor.stately.ai/viz' };
    await writeFile(new URL('captures.json', assets), `${JSON.stringify(previous, null, 2)}\n`);
    console.log(`${id}: ${nodes} native nodes; ${clip.width}x${clip.height}; no page errors`);
    await page.close();
  }
} finally {
  await browser.close();
}
