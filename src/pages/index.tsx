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
