'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

type Embed = {
  name: string;
  embedURL: string;
  snapshotURL?: string;
};

export function EmbedMachine({ name, embedURL, snapshotURL }: Embed) {
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [snapshotSrc, setSnapshotSrc] = useState<string | null>(null);
  const [snapshotFailed, setSnapshotFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isActive]);

  useEffect(() => {
    if (!snapshotURL) return;
    let cancelled = false;
    fetch(snapshotURL)
      .then((response) => {
        if (!response.ok) throw new Error(`Snapshot ${response.status}`);
        return response.text();
      })
      .then((content) => {
        if (!cancelled) {
          setSnapshotSrc(
            `https://editor.stately.ai/viz#machine=${encodeURIComponent(toBase64(content))}&format=xgraph`,
          );
        }
      })
      .catch(() => {
        if (!cancelled) setSnapshotFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [snapshotURL]);

  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div ref={containerRef} className="relative my-4">
      {mounted && (!snapshotURL || snapshotSrc || snapshotFailed) ? (
        <iframe
          loading="lazy"
          src={manageURL(snapshotSrc ?? embedURL, {
            colorMode,
          })}
          className="block w-full aspect-video"
        >
          <a href={embedURL}>
            View the <em>{name}</em> machine in Stately Studio
          </a>
          .
        </iframe>
      ) : (
        <div className="block w-full aspect-video" />
      )}
      {!isActive && (
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

function manageURL(
  embedURL: string,
  options?: { colorMode: 'light' | 'dark' },
): string {
  const url = new URL(embedURL);
  for (const opt in options) {
    url.searchParams.set(opt, options[opt as keyof typeof options]);
  }
  return url.toString();
}

function toBase64(content: string): string {
  const bytes = new TextEncoder().encode(content);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 8192) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return btoa(binary);
}
