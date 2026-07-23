import { NextRequest, NextResponse } from 'next/server';
import { searchDocs } from '@/lib/docs-search';

/**
 * Why this is the way it is:
 * - The page list (title/description/structuredData per page) is precomputed at
 *   build time by `scripts/build-search-index.mjs` and shipped as a JSON import,
 *   so cold starts don't have to dynamic-import + parse every MDX file. Was
 *   measured at multi-second cold starts; now ~tens of ms.
 * - Responses are cached at the CDN edge so repeated queries (every keystroke
 *   typing the same prefix) deduplicate globally. CORS-sensitive: `Vary: Origin`.
 */

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
  const results = await searchDocs(query, { tag });

  return NextResponse.json(results, {
    headers: { ...corsHeaders, 'Cache-Control': CACHE_CONTROL },
  });
}
