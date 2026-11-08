import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const publications = JSON.parse(readFileSync("content/components/viz-publications.json", "utf8"));

function mdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? mdxFiles(path) : path.endsWith(".mdx") ? [path] : [];
  });
}

let checked = 0;
for (const file of mdxFiles("content")) {
  const source = readFileSync(file, "utf8");
  for (const [component] of source.matchAll(/<EmbedMachine\b[\s\S]*?\/>/g)) {
    const embedURL = component.match(/embedURL="([^"]+)"/)?.[1];
    if (!embedURL) continue;
    const ownerURL = component.match(/publishedURL="([^"]+)"/)?.[1];
    if (ownerURL) {
      const url = new URL(ownerURL);
      if (url.origin !== "https://editor.stately.ai" || url.pathname !== "/viz" || !url.searchParams.get("publicationId"))
        throw new Error(`${file}: invalid owner-published Viz URL`);
      continue;
    }
    const sourceURL = new URL(embedURL);
    const snapshotURL = component.match(/snapshotURL="([^"]+)"/)?.[1];
    const id = component.match(/lookupId="([^"]+)"/)?.[1]
      ?? snapshotURL?.match(/\/([0-9a-f-]{36})\.json$/i)?.[1]
      ?? sourceURL.searchParams.get("machineId")
      ?? sourceURL.searchParams.get("projectVersionId")
      ?? sourceURL.searchParams.get("projectId")
      ?? (sourceURL.pathname.includes("/registry/editor/embed/") ? sourceURL.pathname.split("/").at(-1) : null);
    const liveMachineId = !snapshotURL && !component.includes('lookupId=')
      ? sourceURL.searchParams.get("machineId")
      : null;
    if (process.env.VERCEL_ENV === "production" && (!id || (!publications[id] && !liveMachineId)))
      throw new Error(`${file}: published Viz ID missing from manifest`);
  }
  for (const [, url] of source.matchAll(/embedURL="(https?:[^\"]+)"/g)) {
    if (!url.includes("/viz?")) continue;
    if (new URL(url).origin !== "https://editor.stately.ai") {
      throw new Error(`${file}: Viz embed must use editor.stately.ai`);
    }
    checked++;
  }
  for (const [, name] of source.matchAll(/snapshotURL="\/viz-snapshots\/([^\"]+)"/g)) {
    const path = join("public", "viz-snapshots", name);
    if (!existsSync(path)) throw new Error(`${file}: missing ${path}`);
    const graph = JSON.parse(readFileSync(path, "utf8"));
    const definition = graph.definition ?? graph;
    const valid =
      graph.format === "digraph"
        ? definition.rootNode && Array.isArray(definition.edges)
        : Array.isArray(definition.nodes) && Array.isArray(definition.edges);
    if (!valid) {
      throw new Error(`${file}: invalid XGraph snapshot ${path}`);
    }
    checked++;
  }
}
console.log(`Checked ${checked} Viz embeds and snapshots.`);
