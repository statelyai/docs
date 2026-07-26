import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import { searchDocs } from '@/lib/docs-search';
import { createSupabaseAuth } from '@/lib/supabase-auth';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Public docs chat is authenticated before any model work begins.

const systemPrompt = [
  'You are an AI assistant for the XState documentation site (stately.ai/docs).',
  'XState is a JavaScript/TypeScript library for creating state machines, statecharts, and actors.',
  'Use the `search` tool to retrieve relevant docs context before answering when needed.',
  'The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.',
  'If you cannot find the answer in search results, say you do not know and suggest a better search query.',
].join('\n');

const allowedOrigins = [
  'https://stately.ai',
  'https://www.stately.ai',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean);

function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

function isOriginAllowed(origin: string | null) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin) || origin.endsWith('.stately.ai')) {
    return true;
  }

  return (
    process.env.NODE_ENV !== 'production' &&
    /^https?:\/\/(?:[^.]+\.)?localhost(?::\d+)?$/.test(origin)
  );
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: isOriginAllowed(req.headers.get('origin')) ? 204 : 403,
    headers: getCorsHeaders(req.headers.get('origin')),
  });
}

async function getAuthState(req: NextRequest) {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (!isOriginAllowed(origin)) {
    return {
      response: Response.json(
        { error: 'Origin is not allowed.' },
        { status: 403, headers: corsHeaders },
      ),
    };
  }

  let auth: ReturnType<typeof createSupabaseAuth>;
  try {
    auth = createSupabaseAuth(req);
  } catch {
    return {
      response: Response.json(
        { error: 'Authentication is unavailable.' },
        { status: 503, headers: corsHeaders },
      ),
    };
  }

  try {
    const {
      data: { user },
    } = await auth.supabase.auth.getUser();

    return { auth, corsHeaders, user };
  } catch {
    return {
      response: Response.json(
        { error: 'Authentication is unavailable.' },
        { status: 503, headers: corsHeaders },
      ),
    };
  }
}

export async function GET(req: NextRequest) {
  const authState = await getAuthState(req);
  if ('response' in authState) return authState.response;

  return authState.auth.applyAuthCookies(
    Response.json(
      { authenticated: Boolean(authState.user) },
      { headers: authState.corsHeaders },
    ),
  );
}

export async function POST(req: NextRequest) {
  const authState = await getAuthState(req);
  if ('response' in authState) return authState.response;

  if (!authState.user) {
    return authState.auth.applyAuthCookies(
      new Response('AUTH_REQUIRED', {
        status: 401,
        headers: authState.corsHeaders,
      }),
    );
  }

  const reqJson: { messages?: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    stopWhen: stepCountIs(5),
    tools: {
      search: searchTool,
    },
    messages: [
      { role: 'system', content: systemPrompt },
      ...(await convertToModelMessages(reqJson.messages ?? [])),
    ],
    toolChoice: 'auto',
  });

  return authState.auth.applyAuthCookies(
    result.toUIMessageStreamResponse({ headers: authState.corsHeaders }),
  );
}

const searchTool = tool({
  description: 'Search the docs content and return raw JSON results.',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    return await searchDocs(query, { limit: Math.max(limit, 10) });
  },
});

export type SearchTool = typeof searchTool;
