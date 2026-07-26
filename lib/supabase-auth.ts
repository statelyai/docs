import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server.js';

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function createSupabaseAuth(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase authentication is not configured.');
  }

  let cookiesToSet: CookieToSet[] = [];
  let authHeaders: Record<string, string> = {};
  const isProduction = process.env.VERCEL_ENV === 'production';

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookieOptions: {
      domain: isProduction ? '.stately.ai' : undefined,
      path: '/',
      sameSite: 'lax',
      secure: isProduction,
    },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(nextCookies, headers) {
        cookiesToSet = nextCookies;
        authHeaders = headers;
      },
    },
  });

  return {
    supabase,
    applyAuthCookies(response: Response) {
      if (cookiesToSet.length === 0) return response;

      const nextResponse = new NextResponse(response.body, response);

      for (const { name, value, options } of cookiesToSet) {
        nextResponse.cookies.set(name, value, options);
      }
      for (const [name, value] of Object.entries(authHeaders)) {
        nextResponse.headers.set(name, value);
      }

      return nextResponse;
    },
  };
}
