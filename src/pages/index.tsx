import React from 'react';
import '../css/landing-page.css';
import { Navbar } from './Navbar';
import { Intro } from './Intro';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';
import { Benefits } from './Benefits';
import { FinalCallToAction } from './FinalCallToAction';
import { AIAssistance } from './AIAssistance';

export default function Index() {
  return (
    <>
      <header className="bg-blue-950/20 border-b-white/[0.08] border-b fixed w-full z-10 backdrop-blur-md">
        <Navbar />
      </header>
      <main className="bg-blue-950">
        <Intro />
        <AIAssistance />
        <Benefits />
        <Testimonials />
        <FinalCallToAction />
      </main>
      <Footer />
    </>
  );
}
