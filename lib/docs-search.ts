import { flexsearch } from 'fumadocs-core/search/flexsearch';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import searchIndex from './search-index.json' with { type: 'json' };

type IndexEntry = {
  title: string;
  description: string;
  url: string;
  id: string;
  structuredData: StructuredData;
  tag: 'docs' | 'blog';
};

type SearchOptions = {
  tag?: string | string[];
  limit?: number;
};

const allPages = searchIndex as IndexEntry[];
const titleByUrl = new Map(allPages.map((page) => [page.url, page.title.toLowerCase()]));
const tagByUrl = new Map(allPages.map((page) => [page.url, page.tag]));
const searchServer = flexsearch({ indexes: allPages });

function titleMatchScore(query: string, title: string): number {
  if (title === query) return 4;
  if (title.startsWith(query)) return 3;
  const words = title.split(/[^a-z0-9]+/i).filter(Boolean);
  if (words.some((word) => word === query)) return 2;
  if (title.includes(query)) return 1;
  return 0;
}

function rerankResults(
  results: { type: string; url: string; [key: string]: any }[],
  query: string,
) {
  const groups: { type: string; url: string; [key: string]: any }[][] = [];
  for (const item of results) {
    if (item.type === 'page') {
      groups.push([item]);
    } else if (groups.length > 0) {
      groups.at(-1)?.push(item);
    }
  }

  const queryLower = query.toLowerCase();
  groups.sort((a, b) => {
    const titleA = titleByUrl.get(a[0].url) ?? '';
    const titleB = titleByUrl.get(b[0].url) ?? '';
    const scoreA = titleMatchScore(queryLower, titleA);
    const scoreB = titleMatchScore(queryLower, titleB);
    const tagA = tagByUrl.get(a[0].url) === 'docs' ? 1 : 0;
    const tagB = tagByUrl.get(b[0].url) === 'docs' ? 1 : 0;
    return tagB - tagA || scoreB - scoreA || titleA.length - titleB.length;
  });

  return groups.flat();
}

export async function searchDocs(query: string, options?: SearchOptions) {
  const results = await searchServer.search(query, options);
  return rerankResults(results, query);
}
