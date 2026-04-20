export const revalidate = false;

const SITE_URL = 'https://stately.ai';

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-Web',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
  'Bytespider',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'cohere-ai',
];

export function GET() {
  const body = [
    '# Content Signals per https://contentsignals.org/',
    'Content-Signal: search=yes, ai-train=no, ai-input=yes',
    '',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    ...AI_CRAWLERS.flatMap((bot) => [
      `User-agent: ${bot}`,
      'Allow: /docs/',
      'Allow: /blog/',
      'Disallow: /api/',
      '',
    ]),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
