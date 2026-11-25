import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { inlineEmbedURL } from "../content/components/inlineEmbedURL.ts";

function mdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? mdxFiles(path) : path.endsWith(".mdx") ? [path] : [];
  });
}

let inline = 0;
for (const file of mdxFiles("content")) {
  const source = readFileSync(file, "utf8");
  if (source.includes("<EmbedMachine")) throw new Error(`${file}: legacy embed remains`);
  const imports = new Map(
    [...source.matchAll(/import\s+(\w+)\s+from\s+['"]@\/(content\/machines|public\/viz-snapshots)\/([^'"]+\.json)['"]/g)]
      .map((match) => [match[1], `${match[2]}/${match[3]}`]),
  );
  for (const [component] of source.matchAll(/<Embed\b[\s\S]*?\/>/g)) {
    const name = component.match(/\bmachine=\{\s*(\w+)\s*\}/)?.[1];
    if (!name) throw new Error(`${file}: inline embed needs a machine import`);
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
    const mode = component.match(/\bmode=['"](simulate|simulating)['"]/i)?.[1];
    if (mode) {
      const url = inlineEmbedURL(machine, "light", mode);
      if (!url) throw new Error(`${file}: missing simulation embed URL for ${name}`);
      const params = new URLSearchParams(new URL(url).hash.slice(1));
      if (!params.get("canvasSlots")?.split(",").includes("simulationControls")) {
        throw new Error(`${file}: missing simulation controls for ${name}`);
      }
    }
    inline++;
  }
}
console.log(`Checked ${inline} inline Viz embeds.`);
