import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export async function GET() {
  const navigation = await llms(source).index();
  const taskLinks = [
    '- [Create an XState machine](/docs/xstate/v5/quick-start.mdx#create-a-machine-with-a-coding-agent): Prompt for XState v5 or v6.',
    '- [Add model-based tests](/docs/model-based-testing.mdx#add-model-based-tests-with-a-coding-agent): Version-specific testing guides and a prompt.',
    ...(source.getPage(['packages', 'sdk'])
      ? ['- [Embed a machine with the Stately SDK](/docs/embed.mdx#embed-a-machine-with-the-stately-sdk): Prompt for a read-only embed.']
      : []),
  ].join('\n');
  const unlistedPages = source
    .getPages()
    .filter((page) => !navigation.includes(`](${page.url})`));
  const completeIndex = unlistedPages.length
    ? `

## Complete page index
${unlistedPages.map((page) => `- [${page.data.title}](${page.url}.mdx)`).join('\n')}`
    : '';

  const content = `# Stately documentation

## Common tasks
${taskLinks}

${navigation.replace(/^# .+/u, '## Documentation index')}${completeIndex}

## Optional
- [Full documentation](/llms-full.txt): Complete docs in one file
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
