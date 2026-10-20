import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_IMAGE, SITE_URL } from '@/lib/seo';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Stately | State machines, statecharts, and XState',
    template: '%s | Stately',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Stately',
    title: 'Stately | State machines, statecharts, and XState',
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_IMAGE, alt: 'A state machine in the Stately editor' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [SITE_IMAGE],
  },
};

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {process.env.VERCEL_ENV === 'production' && (
          <Script
            id="plausible-analytics"
            strategy="afterInteractive"
            data-domain="stately.ai"
            src="https://plausible.io/js/script.tagged-events.js"
          />
        )}
        <RootProvider
          theme={{ enabled: true }}
          search={{
            options: {
              api:
                process.env.NODE_ENV === 'development'
                  ? '/api/search'
                  : 'https://stately-docs.vercel.app/api/search',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
