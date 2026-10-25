import './landing.css';
import { Footer } from '@/components/Footer';
import { Hero } from './sections/Hero';
import { AgentSetup } from './sections/AgentSetup';
import { DiffVsGraph } from './sections/DiffVsGraph';
import { Loop } from './sections/Loop';
import { Compat } from './sections/Compat';
import { System } from './sections/System';
import { OpenSource } from './sections/OpenSource';
import { Enterprise } from './sections/Enterprise';
import { PricingTeaser } from './sections/PricingTeaser';
import { Faq } from './sections/Faq';
import { FinalCta } from './sections/FinalCta';
import { CtaBand } from './sections/CtaBand';

export function Landing() {
  return (
    <main className="sp dark min-h-screen">
      <Hero />
      <AgentSetup />
      <DiffVsGraph />
      <Loop />
      <CtaBand text="Try it on your own code." />
      <System />
      <Compat />
      <CtaBand text="See it on a running app." />
      <OpenSource />
      <PricingTeaser />
      <Enterprise />
      <Faq />
      <FinalCta />
      <Footer tone="neutral" />
    </main>
  );
}
