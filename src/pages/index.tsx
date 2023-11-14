import React from 'react';
import '../css/landing-page.css';
import { Navbar } from '../components/landing/Navbar';
import { Intro } from '../components/landing/Intro';
import { Testimonials } from '../components/landing/Testimonials';
import { Footer } from '../components/landing/Footer';
import { Benefits } from '../components/landing/Benefits';
import { FinalCallToAction } from '../components/landing/FinalCallToAction';
import '../css/landing-styles.css';

export default function Index() {
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
