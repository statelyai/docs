import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export function GET() {
  const navigation = llms(source).index();
  const unlistedPages = source
    .getPages()
    .filter((page) => !navigation.includes(`](${page.url})`));
  const completeIndex = unlistedPages.length
    ? `

## Complete page index
${unlistedPages.map((page) => `- [${page.data.title}](${page.url}.mdx)`).join('\n')}`
    : '';

  const content = `${navigation}${completeIndex}

## Optional
- [Full documentation](/llms-full.txt): Complete docs in one file
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
