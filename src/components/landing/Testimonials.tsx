import React from 'react';
import { SectionTitle } from './SharedComponents';

export function Testimonials() {
  return (
    <section className="container pt-36 w-full">
      <div className="pb-24 w-fit m-auto">
        <SectionTitle>Loved by teams</SectionTitle>
      </div>
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-6 items-start">
        <li>
        <ul className="grid gap-6 w-full">
          <Testimonial
            imgSrc="./landing-page/assets/amy.png"
            name="Amy Pellegrini"
            company="Thoughtworks"
          >
            Every team where I introduced XState has been more effective at
            handling state management with complex user interfaces. It fills a
            gap in the JS ecosystem no other tool did before.
          </Testimonial>
          <Testimonial
            imgSrc="./landing-page/assets/natalie.png"
            name="Natalie Cuthbert"
            company="Stitch"
          >
            We've been using XState for our new payments product. Shout out to
            the team that is making designing complex front-end flows a dream.
          </Testimonial>
          <Testimonial
            imgSrc="./landing-page/assets/patrick.png"
            name="Patrick Cavit"
            company="Netflix"
          >
            XState is a revelation. It makes complex tasks easier to build and
            debug while also making the code more straightforward and
            approachable.
          </Testimonial>
        </ul>
        </li>
        <li>
        <ul className="grid gap-6">
          <Testimonial
            imgSrc="./landing-page/assets/presley.png"
            name="Presley Pizzo"
            company="Coder"
          >
            XState naturally separates the logic and makes it simple to mock out
            API calls, so it's easier to test the code and organize it!
          </Testimonial>

          <Testimonial
            imgSrc="./landing-page/assets/james.png"
            name="James Tharpe"
            company="T-Mobile"
          >
            We use XState to implement business workflows as statecharts. The
            visualizer helps us collaborate more closely with customers, the
            ability to externalize workflows as JSON configuration makes complex
            workflow changes surprisingly simple to roll out, and test case
            generation makes it easier than ever to move forward with
            confidence. XState makes it all possible!
          </Testimonial>
        </ul>
        </li>
        <li>
        <ul className="grid gap-6">
          <Testimonial
            imgSrc="./landing-page/assets/maya.png"
            name="Maya Shavin"
            company="Microsoft"
          >
            Advantages of XState: Visually clear view of the code flow, code
            reusability, test coverage, easy to debug/ spot bugs, code
            scalability & maintenance, and better code design & planning.
          </Testimonial>
          <Testimonial
            imgSrc="./landing-page/assets/santi.png"
            name="Santi Cros"
            company="Domestic Data Streamers"
          >
            Thinking and building with XState has been a revolution in how I
            develop robust business logic. But being able to visualize that in
            real time, has been a game changer in how I model and communicate
            any logic!
          </Testimonial>
        </ul>
        </li>
      </ul>
    </section>
  );
}

function Testimonial({ imgSrc, name, company, children }) {
  return (
    <li className="h-fit max-w-full bg-gradient-to-b from-gray-800/95 to-gray-800/80 border-[0.5px] shadow-md shadow-gray-900 border-gray-850 rounded-2xl px-8 py-6">
      <div className="flex items-center">
        <picture>
          <img src={imgSrc} alt="" height="62" width="62" />
        </picture>
        <div className="pl-4">
          <h3 className="text-white/60 text-lg font-semibold">{name}</h3>
          <p className="text-white/60 text-sm pt-1 font-semibold">
            @ {company}
          </p>
        </div>
      </div>
      <p className="text-white/90 text-lg leading-snug mt-4">{children}</p>
    </li>
  );
}
