"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import publicationMap from "./viz-publications.json";

type Embed = {
  name?: string;
  embedURL: string;
  snapshotURL?: string;
  lookupId?: string;
  publishedURL?: string;
};

const publications: Record<string, string> = publicationMap;

export function EmbedMachine({ name = "State", embedURL, snapshotURL, lookupId, publishedURL }: Embed) {
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!isActive) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isActive]);

  const src = publishedEmbedURL(
    embedURL,
    snapshotURL,
    lookupId,
    resolvedTheme === "dark" ? "dark" : "light",
    publishedURL,
  );
  return (
    <div ref={containerRef} className="relative my-4">
      {mounted && src ? (
        <iframe
          loading="lazy"
          src={src}
          title={`${name} machine`}
          className="block w-full aspect-video"
        >
          <a href={src}>
            View the <em>{name}</em> machine in Stately Viz
          </a>
          .
        </iframe>
      ) : (
        <div className="block w-full aspect-video flex items-center justify-center">
          <span>Machine preview unavailable</span>
        </div>
      )}
      {src && !isActive && (
        <div
          className="absolute inset-0 cursor-pointer bg-transparent hover:bg-black/5 flex items-center justify-center group"
          onClick={() => setIsActive(true)}
        >
          <span className="opacity-0 group-hover:opacity-100 bg-black/70 text-white px-3 py-1.5 rounded text-sm transition-opacity">
            Click to interact
          </span>
        </div>
      )}
    </div>
  );
}

export function publishedEmbedURL(
  embedURL: string,
  snapshotURL: string | undefined,
  lookupId: string | undefined,
  theme: "light" | "dark",
  publishedURL?: string,
): string | null {
  if (publishedURL) {
    const published = new URL(publishedURL);
    if (
      published.origin !== "https://editor.stately.ai" ||
      published.pathname !== "/viz" ||
      !published.searchParams.get("publicationId")
    ) return null;
    published.searchParams.set("theme", theme);
    const legacyMode = new URL(embedURL).searchParams.get("mode");
    if (legacyMode) published.searchParams.set("mode", legacyMode);
    return published.toString();
  }
  const source = new URL(embedURL);
  const snapshotId = snapshotURL?.match(/\/([0-9a-f-]{36})\.json$/i)?.[1];
  const id =
    lookupId ??
    snapshotId ??
    source.searchParams.get("machineId") ??
    source.searchParams.get("projectVersionId") ??
    source.searchParams.get("projectId") ??
    (source.pathname.includes("/registry/editor/embed/")
      ? source.pathname.split("/").at(-1)
      : null);
  if (!id) return null;
  const publicationId = publications[id];
  const liveMachineId = !snapshotURL && !lookupId ? source.searchParams.get("machineId") : null;
  if (!publicationId && !liveMachineId) return null;
  const url = new URL("https://editor.stately.ai/viz");
  if (publicationId) url.searchParams.set("publicationId", publicationId);
  else if (liveMachineId) url.searchParams.set("machineId", liveMachineId);
  url.searchParams.set("theme", theme);
  const mode = source.searchParams.get("mode");
  if (mode) url.searchParams.set("mode", mode);
  return url.toString();
}
