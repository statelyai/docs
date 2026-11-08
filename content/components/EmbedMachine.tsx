"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

type Embed = {
  name?: string;
  title?: string;
  embedURL?: string;
  machine?: unknown;
  mode?: string;
};

export function Embed({ name = "State", title, embedURL, machine, mode }: Embed) {
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

  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const src = machine
    ? inlineEmbedURL(machine, theme, mode)
    : embedURL ?? null;
  return (
    <div ref={containerRef} className="relative my-4">
      {mounted && src ? (
        <iframe
          loading="lazy"
          src={src}
          title={title ?? `${name} machine`}
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

export const EmbedMachine = Embed;

export function inlineEmbedURL(machine: unknown, theme: "light" | "dark", mode?: string): string | null {
  if (!machine || typeof machine !== "object" || Array.isArray(machine)) return null;
  const wrapper = machine as Record<string, unknown>;
  const definition = wrapper.definition ?? wrapper;
  const format = wrapper.format ?? (wrapper.rootNode ? "digraph" : wrapper.nodes ? "xgraph" : undefined);
  if (format !== "digraph" && format !== "xgraph" && format !== "xstate" && format !== "xstate-json") return null;
  const source = typeof definition === "string" ? definition : JSON.stringify(definition);
  const bytes = new TextEncoder().encode(source);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
  const params = new URLSearchParams({ machine: encoded, format, theme });
  if (mode) params.set("mode", mode);
  return `https://editor.stately.ai/viz#${params.toString()}`;
}
