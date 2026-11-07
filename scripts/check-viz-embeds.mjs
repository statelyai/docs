import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function mdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? mdxFiles(path) : path.endsWith('.mdx') ? [path] : [];
  });
}

let checked = 0;
for (const file of mdxFiles('content')) {
  const source = readFileSync(file, 'utf8');
  for (const [, url] of source.matchAll(/embedURL="(https?:[^\"]+)"/g)) {
    if (!url.includes('/viz?')) continue;
    if (new URL(url).origin !== 'https://editor.stately.ai') {
      throw new Error(`${file}: Viz embed must use editor.stately.ai`);
    }
    checked++;
  }
  for (const [, name] of source.matchAll(/snapshotURL="\/viz-snapshots\/([^\"]+)"/g)) {
    const path = join('public', 'viz-snapshots', name);
    if (!existsSync(path)) throw new Error(`${file}: missing ${path}`);
    const graph = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
      throw new Error(`${file}: invalid XGraph snapshot ${path}`);
    }
    checked++;
  }
}
console.log(`Checked ${checked} Viz embeds and snapshots.`);
