import React, { useEffect, useState, ReactNode, useRef } from 'react';
import {
  classNames,
  SectionTitle,
  ButtonLink,
  ComingSoon,
} from './SharedComponents';

export function Benefits() {
  return (
    <>
      <DesignSection />
      <XStateSection />
      <SkySection />
      <SourceOfTruthSection />
    </>
  );
}

function DesignSection() {
  return (
    <AnimateAwayGradient animationClass="bgimage-gradient-pink">
      <BenefitSection anchorLink="design">
        <>
          <SectionTitle>
            <span className="text-pink-500">Design how it works</span> with a
            visual language for everyone on the team.
          </SectionTitle>
          <div className="max-w-4xl pt-16">
            <FeatureText>
              Our drag and drop editor brings together contributors of all
              backgrounds. Code, diagrams, documentation, test generation, and
              more in one place. No more silos. Always up to date.
            </FeatureText>
          </div>
          <div className="grid md:grid-cols-2 w-full gap-12 pt-24">
            <div className="md:col-span-2">
              <Feature box imgSrc="/landing/DELETE-1.png">
                <FeatureText>
                  <StrongLink>Create and simulate your flow</StrongLink> to test
                  and iterate.
                </FeatureText>
              </Feature>
            </div>
            <Feature box>
              <FeatureText>
                <StrongLink>Get feedback</StrongLink> from your team and your
                clients on how everything is supposed to work.
              </FeatureText>
            </Feature>

            <Feature box>
              <FeatureText>
                <StrongLink>Explore community diagrams</StrongLink> to inspire
                your own solutions. Then share your work with the community to
                get feedback and kudos.
              </FeatureText>
            </Feature>
            <div className="md:col-span-2">
              <Feature box>
                <div className="grid grid-cols-2 gap-12">
                  <div className="pt-12">
                    <FeatureText>
                      <StrongLink>Generate flows with AI</StrongLink> to
                      scaffold behavior, suggest variants, turn up edge cases,
                      and even write code.
                    </FeatureText>
                  </div>
                  <img src="/landing/DELETE-1.png" className="h-96 w-full" />
                </div>
              </Feature>
            </div>
          </div>
        </>
      </BenefitSection>
    </AnimateAwayGradient>
  );
}

function XStateSection() {
  return (
    <AnimateAwayGradient animationClass="bgimage-gradient-orange">
      <BenefitSection anchorLink="build">
        <SectionTitle>
          <span className="text-orange-500">Run diagrams using XState</span> and
          get the best of both text-based and visual tools.
        </SectionTitle>
        <div className="grid lg:grid-cols-3 mt-24">
          <Feature>
            <FeatureText>
              XState is a best-in-class open source library for orchestrating
              and managing state in JavaScript and TypeScript apps. No lock-in.
            </FeatureText>

            <div className="flex gap-2">
              <ButtonLink
                href="https://stately.ai/docs/xstate"
                target="_blank"
                size="small"
              >
                Read XState docs
              </ButtonLink>
              <ButtonLink
                href="https://stately.ai/docs/xstate"
                target="_blank"
                size="small"
              >
                View on Github
              </ButtonLink>
            </div>
          </Feature>

          <Feature>
            <FeatureText>
              It can be used in the frontend, backend, or wherever JavaScript
              runs.
            </FeatureText>
            <FeatureText>
              Integrations are available for React, Vue, Svelte, and other
              frameworks.
            </FeatureText>
          </Feature>
          <Feature>
            <FeatureText>
              XState uses event-driven programming, state machines, statecharts,
              and the actor model to handle even the most complex logic in
              predictable, robust, and visual ways.
            </FeatureText>
            <ButtonLink size="small">Learn more about statecharts</ButtonLink>
          </Feature>
        </div>

        <img src="/landing/DELETE-2.png" className="w-full h-96 mt-12" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 w-full pt-36 justify-center">
          <Feature box>
            <FeatureText>
              <StrongLink>Bidirectional updates</StrongLink> between code and
              visualization let you use what makes you most productive.
            </FeatureText>
          </Feature>

          <Feature box>
            <FeatureText>
              <StrongLink>Generate tests automatically</StrongLink> to keep
              coverage robust and up-to-date.
            </FeatureText>
          </Feature>
          <Feature box>
            <FeatureText>
              <StrongLink>Connect with Github</StrongLink> to sync Stately with
              your code.
            </FeatureText>
          </Feature>
          <Feature box>
            <FeatureText>
              <StrongLink>An IDE extension</StrongLink> brings the power of
              Stately into VS Code.
            </FeatureText>
            <ButtonLink size="small">Download the VS Code extension</ButtonLink>
          </Feature>

          <Feature box comingSoon>
            <FeatureText>
              <Strong>Inspect running apps</Strong> in the visual editor to help
              build, test, and debug your logic.
            </FeatureText>
          </Feature>
          <Feature box comingSoon>
            <FeatureText>
              <Strong>Visualize communication between actors</Strong> in a
              system with sequence diagrams.
            </FeatureText>
          </Feature>
        </div>
      </BenefitSection>
    </AnimateAwayGradient>
  );
}

function SourceOfTruthSection() {
  return (
    <AnimateAwayGradient animationClass="bgimage-gradient-green">
      <BenefitSection anchorLink="understand">
        <p className="font-extrabold text-3xl drop-shadow-sm text-white/90 leading-tight pb-8">
          Products evolve.
        </p>
        <SectionTitle>
          <span className="text-green-500">Understand and stay aligned</span>{' '}
          with Stately as the source of truth.
        </SectionTitle>
        <div className="mt-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
            <Feature box>
              <FeatureText>
                <Strong>Living documentation</Strong> keeps the whole team in
                sync without extra overhead.
              </FeatureText>
            </Feature>

            <Feature box>
              <FeatureText>
                <Strong>Save versions</Strong> as backup and to see the history
                of your work.
              </FeatureText>
            </Feature>

            <Feature box>
              <FeatureText>
                <Strong>
                  Export as markdown stories, Mermaid drawings, or JSON
                  documents
                </Strong>{' '}
                that can be copied into issues and project documents.
              </FeatureText>
            </Feature>
            <div className="md:col-span-2 lg:col-span-3">
              <Feature box>
                <div className="grid grid-cols-2 gap-12">
                  <div className="pt-12">
                    <FeatureText>
                      <StrongLink>Reference an event catalog</StrongLink> which
                      is automatically generated and can be annotated to provide
                      further information.
                    </FeatureText>
                  </div>
                  <img src="/landing/DELETE-1.png" className="h-96 w-full" />
                </div>
              </Feature>
            </div>
          </div>
        </div>
      </BenefitSection>
    </AnimateAwayGradient>
  );
}

function SkySection() {
  return (
    <AnimateAwayGradient animationClass="bgimage-gradient-purple">
      <BenefitSection anchorLink="deploy">
        <SectionTitle>
          <span className="text-purple-500">Deploy to Stately Sky</span> for an
          instant realtime enabled backend.
        </SectionTitle>
        <p className="text-xl leading-normal text-white/60 pt-8 max-w-4xl">
          Want to keep it simple? Design in our visual editor then one-click
          deploy to our multiplayer logic-as-a-service Stately Sky. Send events
          using our SDK to automatically update all clients.
        </p>
        <img
          src="/landing/DELETE-2.png"
          className="h-96 w-full max-w-4xl mt-12"
        />

        <div className="pt-12">
          <ComingSoon />
        </div>
      </BenefitSection>
    </AnimateAwayGradient>
  );
}

function BenefitSection({ anchorLink, title, color, children }) {
  const numberBgColor =
    color === 'pink'
      ? 'bg-pink-600'
      : color === 'green'
      ? 'bg-green-600'
      : color === 'purple'
      ? 'bg-purple-600'
      : color === 'orange'
      ? 'bg-orange-600'
      : color === 'teal'
      ? 'bg-teal-600'
      : 'text-gray-600';
  const otherNumberStyles = `flex justify-center items-center rounded-full w-16 h-16 select-none shadow-lg`;
  const numberStyles = classNames(numberBgColor, otherNumberStyles);

  const otherTextStyles =
    'font-extrabold text-6xl drop-shadow-sm border-t-[0.5px]';
  const textStyles = classNames('text-white/90', otherTextStyles);

  // const headerColor =
  //   color === 'pink'
  //     ? 'bg-gradient-to-b from-pink-900 to-blue-950 border-t border-t-pink-600/40'
  //     : color === 'green'
  //     ? 'bg-gradient-to-b from-green-900 to-blue-950 border-t border-t-green-600/40 '
  //     : color === 'purple'
  //     ? 'bg-gradient-to-b from-purple-800 to-blue-950 border-t border-t-purple-600/40'
  //     : color === 'orange'
  //     ? 'bg-gradient-to-b from-orange-800 to-blue-950 border-t border-t-orange-600/40'
  //     : color === 'teal'
  //     ? 'bg-gradient-to-b from-teal-800 to-blue-950 border-t border-t-teal-600/40'
  //     : '';

  return (
    <section
      id={anchorLink}
      className={classNames(
        // 'bg-gradient-to-b from-blue-600/10 to-blue-950 border-t border-t-blue-600/30',
        'py-36',
        'container border-t-[0.5px] border-t-blue-900',
      )}
    >
      {children}
    </section>
  );
}

function Strong({ children }) {
  return (
    <span className="font-extrabold text-white/90 drop-shadow-sm">
      {children}
    </span>
  );
}

function StrongLink({ children, href = 'https://www.stately.ai/docs' }) {
  return (
    <a
      href={href}
      className="font-extrabold text-white/90 hover:text-white"
      target="_blank"
    >
      {children}
    </a>
  );
}

function FeatureLeftImage({ children, imgSrc = '/landing/DELETE-1.png' }) {
  return (
    <div className="grid grid-col-2-leftfr rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-800/10 border border-[0.5px] shadow-md shadow-blue-900 border-blue-850 py-6 px-8 gap-12">
      <img
        src={imgSrc}
        className="max-w-2xl rounded-md border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850 h-96 w-full"
      />
      <p className="text-white/60 text-xl leading-normal pt-12 flex-1">
        {children}
      </p>
    </div>
  );
}

function FeatureRightImage({ children, imgSrc = '/landing/DELETE-1.png' }) {
  return (
    <div className="flex h-fit w-fit max-w-6xl rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-800/10 border border-[0.5px] shadow-md shadow-blue-900 border-blue-850 py-6 px-8 gap-12">
      <p className="text-white/60 text-xl leading-normal pt-12 flex-1">
        {children}
      </p>
      <img
        src={imgSrc}
        className="max-w-2xl rounded-md border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850 h-96 w-full"
      />
    </div>
  );
}

function FeatureBox({ children }) {
  return (
    <div className="flex flex-col h-fit w-full max-w-lg py-6 px-8">
      {children}
    </div>
  );
}
function FeatureText({ children, imgSrc = '/landing/DELETE-1.png' }) {
  return <p className="text-white/60 text-xl leading-normal">{children}</p>;
}

function Feature({
  children,
  comingSoon,
  box,
  imgSrc,
}: {
  children: ReactNode;
  comingSoon?: boolean;
  box?: boolean;
  imgSrc?: string;
}) {
  const boxStyles = box
    ? 'bg-gradient-to-b from-gray-800/50 to-gray-800/10 border-[0.5px] shadow-md shadow-blue-900 border-blue-850 rounded-2xl'
    : '';
  return (
    <div
      className={classNames(
        boxStyles,
        'flex flex-col py-6 px-8 gap-6 text-white/60 text-lg leading-normal',
      )}
    >
      {children}
      {comingSoon && <ComingSoon />}
      {imgSrc && (
        <img
          src={imgSrc}
          className="rounded-md border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850 h-56 w-full mt-8"
        />
      )}
    </div>
  );
}

function AnimateAwayGradient({ animationClass, children }) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={isIntersecting ? animationClass : ''}>
      {children}
    </div>
  );
}
