import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';

const { rewrite: rewriteLLM } = rewritePath('/docs/*path', '/llms.mdx/*path');

const SITE_URL = 'https://stately.ai';

const LINK_HEADER = [
  `<${SITE_URL}/sitemap.xml>; rel="sitemap"; type="application/xml"`,
  `<${SITE_URL}/llms.txt>; rel="describedby"; type="text/plain"`,
].join(', ');

export function middleware(request: NextRequest) {
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  const response = NextResponse.next();
  response.headers.append('Link', LINK_HEADER);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
