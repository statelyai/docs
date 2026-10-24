'use client';
import './landing.css';
import { Footer } from '@/components/Footer';
import { Hero } from './sections/Hero';
import { AgentSetup } from './sections/AgentSetup';
import { DiffVsGraph } from './sections/DiffVsGraph';
import { Loop } from './sections/Loop';
import { Compat } from './sections/Compat';
import { Pillars } from './sections/Pillars';
import { OpenSource } from './sections/OpenSource';
import { Enterprise } from './sections/Enterprise';
import { PricingTeaser } from './sections/PricingTeaser';
import { Faq } from './sections/Faq';
import { FinalCta } from './sections/FinalCta';

export function Landing() {
  return (
    <main className="sp dark min-h-screen">
      <Hero />
      <AgentSetup />
      <DiffVsGraph />
      <Loop />
      <Compat />
      <Pillars />
      <OpenSource />
      <Enterprise />
      <PricingTeaser />
      <Faq />
      <FinalCta />
      <Footer tone="neutral" />
    </main>
  );
}
