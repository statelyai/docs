import React from 'react';
import { ButtonLink, SectionTitle } from './SharedComponents';

export function FinalCallToAction() {
  return (
    <section className="container bg-gradient-to-b from-blue-950/50 to-blue-800 pt-96 pb-36 mt-[-12rem]">
      <div className="container max-w-3xl pt-24 text-center">
        <SectionTitle>
          Intelligent logic to transition from design to deployment,{' '}
          <span className="text-blue-400">and back again.</span>
        </SectionTitle>
      </div>
      <div className="flex justify-center pt-24 gap-4">
        <ButtonLink href="/registry/signup" background="blue" size="large">
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
