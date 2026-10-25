'use client';
// The editor iframe. Fades in once loaded; a fallback timer covers a load
// event that fired before hydration.
import { useEffect, useState } from 'react';

export function EmbedFrame({ src, title }: { src: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <iframe
      loading="lazy"
      title={title}
      src={src}
      onLoad={() => setLoaded(true)}
      data-loaded={loaded ? '' : undefined}
      style={{ colorScheme: 'dark', border: 0 }}
      className="block w-full h-full opacity-0 transition-opacity duration-300 data-[loaded]:opacity-100"
    />
  );
}
