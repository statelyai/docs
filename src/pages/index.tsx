import Head from '@docusaurus/Head';
import React, { useEffect } from 'react';
import { Benefits } from '../components/landing/Benefits';
import { FinalCallToAction } from '../components/landing/FinalCallToAction';
import { Footer } from '../components/landing/Footer';
import { Intro } from '../components/landing/Intro';
import { Navbar } from '../components/landing/Navbar';
import { Testimonials } from '../components/landing/Testimonials';
import '../css/landing-page.css';
import '../css/landing-styles.css';

export default function Index() {
  useEffect(() => {
    // Add the crisp chat script after the dynamic html has been loaded
    // @ts-ignore
    window.$crisp = [];
    // @ts-ignore
    window.CRISP_WEBSITE_ID = 'dff22f8a-0d73-4a83-91be-1f448410c464';
    (function () {
      let d = document;
      let s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Stately | Your intelligent assistant for robust logic</title>
        <link rel="stylesheet" href="./landing-page/styles.css" />
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
        <meta
          name="description"
          content="Stately helps your whole team understand and collaborate on your logic through our visualizer, visual editor and XState."
        />
        <meta
          property="og:title"
          content="Stately - Your intelligent assistant for robust logic"
        />
        <meta property="og:url" content="https://stately.ai" />
        <meta
          property="og:description"
          content="Stately helps your whole team understand and collaborate on your logic through our visualizer, visual editor and XState."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://stately.ai/assets/stately-landing-page.png"
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
        <Intro />
        <Benefits />
        <Testimonials />
        <FinalCallToAction />
      </main>
      <Footer />
    </>
  );
}
