import { pageMetadata, SITE_URL } from '@/lib/seo';
import { Landing } from './_landing/Landing';
import { faqItems } from './_landing/sections/Faq';

const title = 'Visual state machine editor and software modeling';
const description =
  'Design state machines, statecharts, and workflows in Stately\'s visual editor. Use MCP tools to help coding agents model and reason about your software.';

export const metadata = pageMetadata({ title, description, path: '/' });

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
