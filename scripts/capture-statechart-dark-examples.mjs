import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE ?? 'playwright'
);
const assets = new URL('../public/assets/', import.meta.url);
const output = new URL('statecharts/dark/', assets);
const manifest = new URL('statecharts/dark-captures.json', assets);
const captures = await readFile(manifest, 'utf8')
  .then(JSON.parse)
  .catch(() => ({}));
const selected = process.argv.slice(2);
const viewport = { width: 1800, height: 1400 };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
await mkdir(output, { recursive: true });
try {
  for (const directory of ['statecharts', 'harel-statecharts']) {
    const files = (await readdir(new URL(`${directory}/examples/`, assets)))
      .filter((file) => file.endsWith('.json'))
      .sort();
    for (const file of files) {
      const id = file.slice(0, -5);
      if (selected.length && !selected.includes(id)) continue;
      const source = await readFile(
        new URL(`${directory}/examples/${file}`, assets),
        'utf8',
      );
      const url = new URL('https://editor.stately.ai/viz');
      url.searchParams.set('source', `docs-${directory}`);
      url.hash = new URLSearchParams({
        machine: Buffer.from(JSON.stringify(JSON.parse(source))).toString(
          'base64url',
        ),
        format: 'xstate-json',
        chrome: 'plain',
        theme: 'dark',
        interactive: '1',
        panels: 'none',
      }).toString();
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(url.href, { waitUntil: 'domcontentloaded' });
      await page
        .locator('html.dark [data-flow-node-id]')
        .first()
        .waitFor({ timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const bounds = await page.evaluate(() => {
        const elements = document.querySelectorAll(
          '[data-flow-node-id], [data-flow-edge-id], [data-entity="edge"], [data-testid^="node-initial-marker:"]',
        );
        const rects = Array.from(elements, (element) =>
          element.getBoundingClientRect(),
        ).filter((rect) => rect.width || rect.height);
        const x = Math.max(
          0,
          Math.floor(Math.min(...rects.map((rect) => rect.left)) - 45),
        );
        const y = Math.max(
          0,
          Math.floor(Math.min(...rects.map((rect) => rect.top)) - 35),
        );
        const right = Math.min(
          innerWidth,
          Math.ceil(Math.max(...rects.map((rect) => rect.right)) + 55),
        );
        const bottom = Math.min(
          innerHeight,
          Math.ceil(Math.max(...rects.map((rect) => rect.bottom)) + 35),
        );
        return {
          x,
          y,
          width: right - x,
          height: bottom - y,
          nodes: document.querySelectorAll('[data-flow-node-id]').length,
        };
      });
      assert(
        bounds.nodes > 1 && bounds.width > 50 && bounds.height > 50,
        `${id}: native dark graph rendered`,
      );
      assert.deepEqual(errors, [], `${id}: no browser errors`);
      const { nodes, ...clip } = bounds;
      await page.screenshot({
        path: fileURLToPath(new URL(`${id}.png`, output)),
        clip,
        omitBackground: true,
        animations: 'disabled',
      });
      captures[id] = {
        theme: 'dark',
        width: clip.width,
        height: clip.height,
        viewport,
        clip,
        deviceScaleFactor: 2,
        nodes,
        sourceSha256: createHash('sha256').update(source).digest('hex'),
        capturedAt: new Date().toISOString(),
        renderer: url.origin + url.pathname,
      };
      await writeFile(manifest, `${JSON.stringify(captures, null, 2)}\n`);
      console.log(`${id}: native dark capture ${clip.width}x${clip.height}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
