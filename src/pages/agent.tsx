import { Footer } from '../components/landing/Footer';
import { Intro } from '../components/landing/Intro';
import { Navbar } from '../components/landing/Navbar';
import React from 'react';
import '../css/landing-page.css';
import '../css/landing-styles.css';
import Head from '@docusaurus/Head';
import { StatelyAgent } from '../components/landing/StatelyAgent';

export default function Agent() {
  return (
    // We need the class name `twp` here to ensure the Tailwind reset gets applied to all children.
    <div className="twp">
      <Head>
        <title>Stately | Build complex logic intelligently</title>
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
        <meta
          name="description"
          content="Build and deploy workflows and app logic with Stately’s AI enhanced, collaborative tools."
        />
        <meta
          property="og:title"
          content="Stately - Build complex logic intelligently"
        />
        <meta property="og:url" content="https://stately.ai" />
        <meta
          property="og:description"
          content="Build and deploy workflows and app logic with Stately’s AI enhanced, collaborative tools."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://stately.ai/landing-page/stately-landing-page.png"
        />
        <link
          rel="icon"
          href="https://stately.ai/landing-page/favicon.ico"
          sizes="any"
        />
        <link
          rel="icon"
          href="https://stately.ai/landing-page/icon.svg"
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href="https://stately.ai/landing-page/apple-touch-icon.png"
        />
        <link rel="manifest" href="./landing-page/manifest.webmanifest" />
        <script
          defer
          data-domain="stately.ai"
          src="https://plausible.io/js/script.tagged-events.js"
        ></script>
      </Head>

      <header className="bg-blue-950/20 border-b-white/[0.08] border-b fixed w-full z-10 backdrop-blur-md">
        <Navbar />
      </header>

      <main className="bg-blue-950">
        <StatelyAgent />
      </main>
      <Footer />
    </div>
  );
}
