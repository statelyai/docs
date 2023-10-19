import { SectionTitle, ButtonLink } from './SharedComponents';
import React from 'react';

export function FinalCallToAction() {
  return (
    <section className="container bg-gradient-to-b from-blue-950/50 to-blue-800 pt-96 pb-36 mt-[-12rem]">
      <div className="container max-w-3xl pt-24">
        <SectionTitle>
          Stately transitions your team through the product lifecycle.
        </SectionTitle>
      </div>
      <div className="flex justify-center pt-24 gap-4">
        <ButtonLink href="/pricing" background="blue" size="large">
          Sign up for free
        </ButtonLink>
        <ButtonLink
          href="https://calendly.com/d/yc8-3hq-rpc/request-a-demo"
          background="orange"
          size="large"
        >
          Book a demo
        </ButtonLink>
      </div>
    </section>
  );
}
