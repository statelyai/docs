import { source, blog } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

export const { GET } = createSearchAPI('advanced', {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
  indexes: [
    ...source.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: 'docs',
    })),
    ...blog.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: 'blog',
    })),
  ],
});
