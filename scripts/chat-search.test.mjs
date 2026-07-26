import assert from 'node:assert/strict';
import test from 'node:test';
import { searchDocs } from '../lib/docs-search.ts';

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
