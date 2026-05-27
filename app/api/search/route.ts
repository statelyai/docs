import { flexsearch } from 'fumadocs-core/search/flexsearch';
import { NextRequest, NextResponse } from 'next/server';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import searchIndex from '@/lib/search-index.json';

/**
 * Why this is the way it is:
 * - The page list (title/description/structuredData per page) is precomputed at
 *   build time by `scripts/build-search-index.mjs` and shipped as a JSON import,
 *   so cold starts don't have to dynamic-import + parse every MDX file. Was
 *   measured at multi-second cold starts; now ~tens of ms.
 * - Responses are cached at the CDN edge so repeated queries (every keystroke
 *   typing the same prefix) deduplicate globally. CORS-sensitive: `Vary: Origin`.
 */

type IndexEntry = {
  title: string;
  description: string;
  url: string;
  id: string;
  structuredData: StructuredData;
  tag: 'docs' | 'blog';
};

const allPages = searchIndex as IndexEntry[];

const titleByUrl = new Map(allPages.map((p) => [p.url, p.title.toLowerCase()]));
const tagByUrl = new Map(allPages.map((p) => [p.url, p.tag]));

const searchServer = flexsearch({ indexes: allPages });

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
    Vary: 'Origin',
  };
}

/**
 * Cache search responses at the CDN edge. Browser TTL is short (a user's session)
 * so docs updates show up quickly; edge TTL is long with SWR so the function
 * almost never runs for repeated queries.
 */
const CACHE_CONTROL =
  'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800';

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

function titleMatchScore(query: string, title: string): number {
  if (title === query) return 4;
  if (title.startsWith(query)) return 3;
  const words = title.split(/[^a-z0-9]+/i).filter(Boolean);
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
  query: string,
) {
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
    const tagA = tagByUrl.get(a[0].url) === 'docs' ? 1 : 0;
    const tagB = tagByUrl.get(b[0].url) === 'docs' ? 1 : 0;
    return tagB - tagA || scoreB - scoreA || titleA.length - titleB.length;
  });

  return groups.flat();
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return NextResponse.json([], {
      headers: { ...corsHeaders, 'Cache-Control': CACHE_CONTROL },
    });
  }

  const tag = url.searchParams.get('tag')?.split(',');
  const results = await searchServer.search(query, { tag });
  const reranked = rerankResults(results, query);

  return NextResponse.json(reranked, {
    headers: { ...corsHeaders, 'Cache-Control': CACHE_CONTROL },
  });
}
