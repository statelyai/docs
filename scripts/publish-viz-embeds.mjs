/** Publish Docs-owned embeds and verify owner-published URLs. */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dryRun = process.argv.includes("--dry-run");
const verify = process.argv.includes("--verify");
const siteKey = process.env.NEXT_PUBLIC_STATELY_EMBED_SITE_KEY;
const token = process.env.STATELY_EMBED_OAUTH_TOKEN;
const apiBase = process.env.STATELY_REGISTRY_API_BASE ?? "https://stately.ai/registry/api/v1";
if (!dryRun && (!siteKey || (!verify && !token))) {
  throw new Error(
    "Set NEXT_PUBLIC_STATELY_EMBED_SITE_KEY and, for publishing, STATELY_EMBED_OAUTH_TOKEN.",
  );
}

function mdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? mdxFiles(path) : path.endsWith(".mdx") ? [path] : [];
  });
}

const publications = new Map();
const ownerPublished = new Set();
for (const file of mdxFiles("content")) {
  const source = readFileSync(file, "utf8");
  for (const [component] of source.matchAll(/<EmbedMachine\b[\s\S]*?\/>/g)) {
    const embedURL = component.match(/embedURL="([^"]+)"/)?.[1];
    if (!embedURL) continue;
    const ownerURL = component.match(/publishedURL="([^"]+)"/)?.[1];
    if (ownerURL) {
      ownerPublished.add(ownerURL);
      continue;
    }
    const url = new URL(embedURL);
    const snapshotURL = component.match(/snapshotURL="([^"]+)"/)?.[1];
    const publishedId = component.match(/publishedId="([^"]+)"/)?.[1];
    const snapshotId = snapshotURL?.match(/\/([0-9a-f-]{36})\.json$/i)?.[1];
    const lookupId =
      publishedId ??
      snapshotId ??
      url.searchParams.get("machineId") ??
      url.searchParams.get("projectVersionId") ??
      url.searchParams.get("projectId") ??
      (url.pathname.includes("/registry/editor/embed/") ? url.pathname.split("/").at(-1) : null);
    if (!lookupId || !/^[0-9a-f-]{36}$/i.test(lookupId)) {
      throw new Error(`${file}: embed has no UUID lookup ID`);
    }
    const inline = new URLSearchParams(url.hash.slice(1));
    const snapshot = snapshotURL
      ? JSON.parse(readFileSync(join("public", snapshotURL), "utf8"))
      : null;
    const publication = snapshotURL
      ? {
          lookupId,
          mode: "snapshot",
          format: snapshot.format ?? "xgraph",
          definition: snapshot.definition ?? snapshot,
        }
      : publishedId
        ? {
            lookupId,
            mode: "snapshot",
            format: inline.get("format") ?? "xstate",
            definition: Buffer.from(inline.get("machine") ?? "", "base64url").toString("utf8"),
          }
        : { lookupId, mode: "live" };
    const previous = publications.get(lookupId);
    if (!previous || publication.mode === "snapshot") publications.set(lookupId, publication);
  }
}

console.log(
  `${publications.size} Docs-account publications (${[...publications.values()].filter((item) => item.mode === "snapshot").length} snapshots), ${ownerPublished.size} owner-published URLs.`,
);
if (dryRun) {
  for (const item of publications.values()) console.log(`${item.mode}\t${item.lookupId}`);
  for (const url of ownerPublished) console.log(`owner\t${url}`);
} else {
  const failures = [];
  if (verify) for (const ownerURL of ownerPublished) {
    const url = new URL(ownerURL);
    if (url.origin !== 'https://editor.stately.ai' || url.pathname !== '/viz') {
      failures.push(`${ownerURL}: invalid Viz URL`);
      continue;
    }
    const key = url.searchParams.get('siteKey');
    const id = url.searchParams.get('publishedId');
    if (!key || !id) {
      failures.push(`${ownerURL}: missing publication identity`);
      continue;
    }
    const read = await fetch(`${apiBase}/public/embeds/${encodeURIComponent(key)}/${encodeURIComponent(id)}`);
    if (!read.ok) failures.push(`${ownerURL}: read returned ${read.status}`);
    const frame = await fetch(url);
    const ancestors = frame.headers.get('content-security-policy') ?? '';
    if (!frame.ok || !ancestors.split(/\s+/).includes('https://stately.ai') && ancestors !== 'frame-ancestors *') {
      failures.push(`${ownerURL}: Viz framing denied (${frame.status}, ${ancestors})`);
    }
  }
  for (const item of publications.values()) {
    const response = verify
      ? await fetch(`${apiBase}/public/embeds/${encodeURIComponent(siteKey)}/${item.lookupId}`)
      : await fetch(`${apiBase}/embed-sites/${encodeURIComponent(siteKey)}/publications`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
          body: JSON.stringify(item),
        });
    if (!response.ok)
      failures.push(`${item.lookupId}: ${response.status} ${await response.text()}`);
  }
  if (failures.length)
    throw new Error(`${failures.length} publications failed:\n${failures.join("\n")}`);
  if (verify) {
    const firstId = publications.keys().next().value;
    const viz = new URL("https://editor.stately.ai/viz");
    viz.searchParams.set("siteKey", siteKey);
    viz.searchParams.set("publishedId", firstId);
    const frame = await fetch(viz);
    if (
      !frame.ok ||
      frame.headers.get("content-security-policy") !== "frame-ancestors *"
    ) {
      throw new Error(
        `Viz frame check failed: HTTP ${frame.status}, CSP ${frame.headers.get("content-security-policy")}`,
      );
    }
  }
  console.log(`All Docs publications ${verify ? "are readable" : "are active"}.`);
}
