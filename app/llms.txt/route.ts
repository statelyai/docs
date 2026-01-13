import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();

  const content = `# XState

> State machines and statecharts for the modern web. XState is a JavaScript/TypeScript library for creating state machines, statecharts, and actors.

## Docs
${pages.map((p) => `- [${p.data.title}](${p.url}.mdx)`).join('\n')}

## Optional
- [Full documentation](/llms-full.txt): Complete docs in one file
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
