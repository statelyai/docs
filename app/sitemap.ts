import type { MetadataRoute } from 'next';
import { source, blog } from '@/lib/source';
import { SITE_URL } from '@/lib/seo';

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set([
    '/',
    '/pricing',
    '/privacy',
    '/terms',
    '/blog',
    ...source.getPages().map((page) => page.url),
    ...blog.getPages().map((page) => page.url),
  ]);

  // These legacy routes permanently redirect in next.config.mjs.
  paths.delete('/docs/privacy');
  paths.delete('/docs/xstate-graph');
  paths.delete('/docs/mcp');

  return [...paths].map((path) => ({ url: `${SITE_URL}${path}` }));
}
