import assert from 'node:assert/strict';
import { once } from 'node:events';
import http from 'node:http';
import { registerHooks } from 'node:module';
import test from 'node:test';

test('chat streams a docs search and answer through the OpenAI transport', async (t) => {
  const requests = [];
  const server = http.createServer(async (req, res) => {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw);
    requests.push(body);
    const hasSearch = body.input.some(
      (item) => item.type === 'function_call_output',
    );
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    const emit = (type, data) =>
      res.write(
        `event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`,
      );

    emit('response.created', {
      response: { id: 'response', created_at: 1, model: 'gpt-4o' },
    });
    if (!hasSearch) {
      const item = {
        type: 'function_call',
        status: 'completed',
        id: 'search',
        call_id: 'search',
        name: 'search',
        arguments: '{"query":"actors","limit":10}',
      };
      emit('response.output_item.added', {
        output_index: 0,
        item: { ...item, arguments: '' },
      });
      emit('response.function_call_arguments.delta', {
        output_index: 0,
        item_id: item.id,
        delta: item.arguments,
      });
      emit('response.output_item.done', { output_index: 0, item });
    } else {
      const text =
        'Actors communicate using **events**. See [Actors](/docs/actors).';
      emit('response.output_item.added', {
        output_index: 0,
        item: { type: 'message', id: 'answer' },
      });
      emit('response.output_text.delta', {
        output_index: 0,
        item_id: 'answer',
        delta: text,
      });
      emit('response.output_item.done', {
        output_index: 0,
        item: {
          type: 'message',
          id: 'answer',
          role: 'assistant',
          content: [{ type: 'output_text', text, annotations: [] }],
        },
      });
    }
    emit('response.completed', { response: {} });
    res.end();
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const previous = {
    key: process.env.OPENAI_API_KEY,
    base: process.env.OPENAI_BASE_URL,
  };
  process.env.OPENAI_API_KEY = 'local-test-only';
  process.env.OPENAI_BASE_URL = `http://127.0.0.1:${server.address().port}/v1`;
  t.after(() => {
    for (const [name, value] of [
      ['OPENAI_API_KEY', previous.key],
      ['OPENAI_BASE_URL', previous.base],
    ]) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });
  const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
      return nextResolve(
        specifier === '@/lib/docs-search'
          ? new URL('../lib/docs-search.ts', import.meta.url).href
          : specifier,
        context,
      );
    },
  });
  t.after(() => hooks.deregister());
  const { POST } = await import('../app/api/docs/chat/route.ts');
  const response = await POST(
    new Request('http://localhost/api/docs/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            id: 'question',
            role: 'user',
            parts: [{ type: 'text', text: 'What are actors?' }],
          },
        ],
      }),
    }),
  );
  assert.equal(response.status, 200);
  const events = (await response.text())
    .split('\n')
    .filter((line) => line.startsWith('data: ') && line !== 'data: [DONE]')
    .map((line) => JSON.parse(line.slice(6)));
  assert.deepEqual(
    events.filter((event) => event.type === 'error'),
    [],
  );
  const search = events.find((event) => event.type === 'tool-output-available');
  assert.ok(search?.output.some((result) => result.url === '/docs/actors'));
  assert.match(
    events
      .filter((event) => event.type === 'text-delta')
      .map((event) => event.delta)
      .join(''),
    /\[Actors\]\(\/docs\/actors\)/,
  );
  assert.equal(requests.length, 2);
  assert.ok(
    JSON.stringify(requests[0]).includes(
      'You are an AI assistant for the XState',
    ),
  );
  assert.ok(
    requests[1].input.some(
      (item) =>
        item.type === 'function_call_output' &&
        item.output.includes('/docs/actors'),
    ),
  );
});
