import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const knownLegacyIds = new Set([
  "68b835cc-49fc-4b9c-972e-a63c01465c1f",
  "afa23e5f-11c7-460d-bd98-ff7de694a41d",
  "afde01f8-1314-4590-b9be-2fd5dafe90d2",
  "de091123-5634-481b-aa18-ff9d254403ae",
]);

function mdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? mdxFiles(path) : path.endsWith(".mdx") ? [path] : [];
  });
}

let inline = 0;
let legacy = 0;
for (const file of mdxFiles("content")) {
  const source = readFileSync(file, "utf8");
  const imports = new Map(
    [...source.matchAll(/import\s+(\w+)\s+from\s+['"]@\/(content\/machines|public\/viz-snapshots)\/([^'"]+\.json)['"]/g)]
      .map((match) => [match[1], `${match[2]}/${match[3]}`]),
  );
  for (const [, name] of source.matchAll(/<Embed\s+machine=\{(\w+)\}/g)) {
    const path = imports.get(name);
    if (!path || !existsSync(path)) throw new Error(`${file}: missing inline machine ${name}`);
    const machine = JSON.parse(readFileSync(path, "utf8"));
    const definition = machine.definition ?? machine;
    const format = machine.format ?? (machine.nodes ? "xgraph" : undefined);
    const valid = format === "xstate"
      ? typeof definition === "string" && definition.length > 0
      : format === "digraph"
        ? !!definition.rootNode && Array.isArray(definition.edges)
        : format === "xgraph"
          ? Array.isArray(definition.nodes) && Array.isArray(definition.edges)
          : false;
    if (!valid) throw new Error(`${file}: invalid ${format ?? "unknown"} machine ${path}`);
    inline++;
  }
  for (const [component] of source.matchAll(/<EmbedMachine\b[\s\S]*?\/>/g)) {
    const embedURL = component.match(/embedURL="([^"]+)"/)?.[1];
    const id = embedURL && new URL(embedURL).searchParams.get("machineId");
    if (!id || !knownLegacyIds.has(id)) throw new Error(`${file}: unexpected legacy embed`);
    legacy++;
  }
}
console.log(`Checked ${inline} inline Viz embeds; ${legacy} legacy embeds await owner exports.`);
