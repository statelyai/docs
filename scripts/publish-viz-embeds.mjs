/** Publish Docs-owned embeds and verify owner-published URLs. */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dryRun = process.argv.includes("--dry-run");
const verify = process.argv.includes("--verify");
const siteId = process.env.STATELY_DOCS_EMBED_SITE_ID;
const token = process.env.STATELY_EMBED_OAUTH_TOKEN;
const apiBase = process.env.STATELY_REGISTRY_API_BASE ?? "https://stately.ai/registry/api/v1";
if (!dryRun && !verify && (!siteId || !token)) {
  throw new Error(
    "Set STATELY_DOCS_EMBED_SITE_ID and STATELY_EMBED_OAUTH_TOKEN to publish.",
  );
}
const manifestPath = "content/components/viz-publications.json";
const publicationIds = JSON.parse(readFileSync(manifestPath, "utf8"));

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
    const explicitLookupId = component.match(/lookupId="([^"]+)"/)?.[1];
    const snapshotId = snapshotURL?.match(/\/([0-9a-f-]{36})\.json$/i)?.[1];
    const lookupId =
      explicitLookupId ??
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
      : explicitLookupId
        ? {
            lookupId,
            mode: "snapshot",
            format: inline.get("format") ?? "xstate",
            definition: Buffer.from(inline.get("machine") ?? "", "base64url").toString("utf8"),
          }
      : { lookupId, mode: "live", directMachineId: Boolean(url.searchParams.get("machineId")) };
    const previous = publications.get(lookupId);
    if (!previous || publication.mode === "snapshot") publications.set(lookupId, publication);
  }
}

const snapshotCount = [...publications.values()].filter((item) => item.mode === "snapshot").length;
console.log(
  `${publications.size - snapshotCount} live lookups, ${snapshotCount} Docs snapshots, ${ownerPublished.size} owner-published URLs.`,
);
if (dryRun) {
  for (const item of publications.values()) console.log(`${item.mode}${item.directMachineId ? '-machine-id' : ''}\t${item.lookupId}`);
  for (const url of ownerPublished) console.log(`owner\t${url}`);
} else {
  const failures = [];
  if (verify) for (const ownerURL of ownerPublished) {
    const url = new URL(ownerURL);
    if (url.origin !== 'https://editor.stately.ai' || url.pathname !== '/viz') {
      failures.push(`${ownerURL}: invalid Viz URL`);
      continue;
    }
    const id = url.searchParams.get('publicationId');
    if (!id) {
      failures.push(`${ownerURL}: missing publication identity`);
      continue;
    }
    const read = await fetch(`${apiBase}/public/embeds/${encodeURIComponent(id)}`);
    if (!read.ok) failures.push(`${ownerURL}: read returned ${read.status}`);
    const frame = await fetch(url);
    const ancestors = frame.headers.get('content-security-policy') ?? '';
    if (!frame.ok || !ancestors.split(/\s+/).includes('https://stately.ai') && ancestors !== 'frame-ancestors *') {
      failures.push(`${ownerURL}: Viz framing denied (${frame.status}, ${ancestors})`);
    }
  }
  for (const item of publications.values()) {
    if (item.mode === 'live' && !verify) continue;
    const publicationId = publicationIds[item.lookupId];
    const readId = item.mode === 'live' && item.directMachineId
      ? item.lookupId
      : publicationId;
    if (verify && !readId) {
      failures.push(`${item.lookupId}: missing publication ID in ${manifestPath}`);
      continue;
    }
    const response = verify
      ? await fetch(`${apiBase}/public/embeds/${encodeURIComponent(readId)}`)
      : await fetch(`${apiBase}/embed-sites/${encodeURIComponent(siteId)}/publications`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
          body: JSON.stringify(item),
        });
    if (!response.ok)
      failures.push(`${item.lookupId}: ${response.status} ${await response.text()}`);
    else if (!verify) {
      const result = await response.json();
      const id = result?.data?.id;
      if (typeof id !== 'string') failures.push(`${item.lookupId}: missing publication ID`);
      else publicationIds[item.lookupId] = id;
    }
  }
  if (failures.length)
    throw new Error(`${failures.length} publications failed:\n${failures.join("\n")}`);
  if (!verify) {
    writeFileSync(manifestPath, `${JSON.stringify(publicationIds, null, 2)}\n`);
  } else {
    const firstItem = [...publications.values()].find((item) => item.mode === 'snapshot');
    const firstId = firstItem ? publicationIds[firstItem.lookupId] : publications.keys().next().value;
    const viz = new URL("https://editor.stately.ai/viz");
    viz.searchParams.set("publicationId", firstId);
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
