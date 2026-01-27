'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

type Embed = {
  name: string;
  embedURL: string;
};

export function EmbedMachine({ name, embedURL }: Embed) {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

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

  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div ref={containerRef} className="relative my-4">
      <iframe
        loading="lazy"
        src={manageURL(embedURL, {
          colorMode,
        })}
        className="block w-full aspect-video"
      >
        <a href={embedURL}>
          View the <em>{name}</em> machine in Stately Studio
        </a>
        .
      </iframe>
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
