'use client';
// The editor iframe. Fades in once loaded; a fallback timer covers a load
// event that fired before hydration. `followTheme` rewrites the URL's
// `theme=` param to the site's resolved theme (next-themes).
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function useSiteTheme(): 'light' | 'dark' {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && resolvedTheme === 'light' ? 'light' : 'dark';
}

export function EmbedFrame({
  src,
  title,
  followTheme = false,
}: {
  src: string;
  title: string;
  followTheme?: boolean;
}) {
  const theme = useSiteTheme();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 3000);
    return () => clearTimeout(t);
  }, []);
  const url = followTheme ? src.replace(/([?&])theme=(light|dark)/, `$1theme=${theme}`) : src;
  const scheme = followTheme ? theme : /[?&]theme=light/.test(src) ? 'light' : 'dark';
  return (
    <iframe
      loading="lazy"
      title={title}
      src={url}
      onLoad={() => setLoaded(true)}
      data-loaded={loaded ? '' : undefined}
      style={{ colorScheme: scheme, border: 0 }}
      className="block w-full h-full opacity-0 transition-opacity duration-300 data-[loaded]:opacity-100"
    />
  );
}
