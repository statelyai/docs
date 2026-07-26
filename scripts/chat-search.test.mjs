import assert from 'node:assert/strict';
import test from 'node:test';
import { searchDocs } from '../lib/docs-search.ts';
import { NextRequest } from 'next/server.js';

test('chat search uses the prebuilt docs index', async () => {
  const results = await searchDocs('final state', { limit: 10 });

  assert.ok(
    results.some(
      (result) =>
        result.url === '/docs/final-states' &&
        'content' in result &&
        result.content.includes('completion or successful termination'),
    ),
  );
});

test('chat authentication rejects a request without a Stately session', async () => {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

  try {
    const { createSupabaseAuth } = await import('../lib/supabase-auth.ts');
    const auth = createSupabaseAuth(
      new NextRequest('https://stately.ai/api/docs/chat', {
        headers: { origin: 'https://stately.ai' },
      }),
    );
    const {
      data: { user },
    } = await auth.supabase.auth.getUser();

    assert.equal(user, null);
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey;
  }
});
