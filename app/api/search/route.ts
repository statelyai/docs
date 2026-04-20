import { source, blog } from '@/lib/source';
import { initAdvancedSearch } from 'fumadocs-core/search/server';
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [
  'https://stately.ai',
  'https://www.stately.ai',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean);

function getCorsHeaders(origin: string | null) {
  const isAllowed =
    origin && (allowedOrigins.includes(origin) || origin.endsWith('.stately.ai'));

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

const allPages = await Promise.all([
  ...source.getPages().map(async (page) => {
    const data =
      'load' in page.data ? { ...page.data, ...(await page.data.load()) } : page.data;

    return {
      title: page.data.title ?? '',
      description: page.data.description ?? '',
      url: page.url,
      id: page.url,
      structuredData: data.structuredData,
      tag: 'docs' as const,
    };
  }),
  ...blog.getPages().map(async (page) => {
    const data =
      'load' in page.data ? { ...page.data, ...(await page.data.load()) } : page.data;

    return {
      title: page.data.title ?? '',
      description: page.data.description ?? '',
      url: page.url,
      id: page.url,
      structuredData: data.structuredData,
      tag: 'blog' as const,
    };
  }),
]);

const titleByUrl = new Map(allPages.map((p) => [p.url, p.title.toLowerCase()]));

const searchServer = initAdvancedSearch({
  language: 'english',
  indexes: allPages,
});

function titleMatchScore(query: string, title: string): number {
  if (title === query) return 4;
  if (title.startsWith(query)) return 3;
  const words = title.split(/\s+/);
  if (words.some((w) => w === query)) return 2;
  if (title.includes(query)) return 1;
  return 0;
}

/**
 * Re-rank search results to boost pages whose title matches the query.
 * Results come as a flat list grouped by page:
 *   [page1, heading1a, text1b, page2, heading2a, ...]
 * We split into page groups, score each group, sort, then flatten.
 */
function rerankResults(
  results: { type: string; url: string; [key: string]: any }[],
  query: string
) {
  // Split flat list into page groups
  const groups: { type: string; url: string; [key: string]: any }[][] = [];
  for (const item of results) {
    if (item.type === 'page') {
      groups.push([item]);
    } else if (groups.length > 0) {
      groups[groups.length - 1].push(item);
    }
  }

  const queryLower = query.toLowerCase();
  groups.sort((a, b) => {
    const titleA = titleByUrl.get(a[0].url) ?? '';
    const titleB = titleByUrl.get(b[0].url) ?? '';
    const scoreA = titleMatchScore(queryLower, titleA);
    const scoreB = titleMatchScore(queryLower, titleB);
    return scoreB - scoreA;
  });

  return groups.flat();
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return NextResponse.json([], { headers: getCorsHeaders(origin) });
  }

  const tag = url.searchParams.get('tag')?.split(',');
  const results = await searchServer.search(query, { tag });
  const reranked = rerankResults(results, query);

  return NextResponse.json(reranked, { headers: getCorsHeaders(origin) });
}
