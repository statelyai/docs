import { pageMetadata, SITE_URL } from '@/lib/seo';
import { Landing } from './_landing/Landing';
import { faqItems } from './_landing/sections/Faq';

const title = 'See what your software actually does';
const description =
  'Stately maps any app into a statechart humans can see and agents can reason about. Every state, every path, verified against your code. MCP server, CLI, visual editor, and XState.';

export const metadata = {
  ...pageMetadata({ title, description, path: '/' }),
  alternates: { canonical: '/', types: { 'text/markdown': '/llms.txt' } },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Stately',
      url: `${SITE_URL}/`,
    },
    {
      '@type': 'Organization',
      name: 'Stately',
      url: SITE_URL,
      sameAs: ['https://github.com/statelyai', 'https://x.com/statelyai'],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Stately',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web, macOS, Linux, Windows',
      url: SITE_URL,
      description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      softwareHelp: `${SITE_URL}/docs`,
    },
    {
      '@type': 'SoftwareSourceCode',
      name: 'XState',
      codeRepository: 'https://github.com/statelyai/xstate',
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'Node.js, browsers',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing />
    </>
  );
}
