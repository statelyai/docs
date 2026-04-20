import type { MetadataRoute } from 'next';
import { source, blog } from '@/lib/source';

const SITE_URL = 'https://stately.ai';

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/docs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const docRoutes: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blog.getPages().map((page) => {
    const data = page.data as { date?: string | Date };
    const lastModified = data.date ? new Date(data.date) : now;
    return {
      url: `${SITE_URL}${page.url}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    };
  });

  return [...staticRoutes, ...docRoutes, ...blogRoutes];
}
