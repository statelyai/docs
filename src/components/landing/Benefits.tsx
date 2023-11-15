import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  CalendarIcon,
  FileDownIcon,
  MergeIcon,
  PartyPopperIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Wand2Icon,
} from 'lucide-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  ButtonLink,
  ComingSoon,
  SectionTitle,
  classNames,
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
            visual language for everyone on the team (even AI 🤖).
          </SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2  pt-16 gap-12">
            <div className="max-w-lg flex">
              <div className="pr-12 pt-2 text-pink-300">
                <Wand2Icon size="32" />
              </div>
              <FeatureText>
                Our drag and drop editor brings together contributors of all
                backgrounds. Code, diagrams, documentation, test generation, and
                more in one place. No more silos. Always up to date.
              </FeatureText>
            </div>
            <div className="max-w-lg flex">
              <div className="pr-12 pt-2 text-pink-300">
                <SparklesIcon size="32" />
              </div>
              <FeatureText>
                AI’s love helping at each phase with state machines to guide
                them, while humans use the visual editor to audit and enhance
                their work.
              </FeatureText>
            </div>
          </div>

          <div className="grid md:grid-cols-2 w-full gap-12 pt-24">
            <div className="md:col-span-2">
              <Feature box imgSrc="/landing/DELETE-1.png">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <FeatureText>
                    <Strong>Create flows with no code required</Strong>. Rapidly
                    prototype or gather requirements without worrying about
                    technical details.
                  </FeatureText>
                  <FeatureText>
                    <Strong>Then simulate your design</Strong> to test and
                    iterate. You can even instantly try out a prototype as an
                    auto-generated React app.
                  </FeatureText>
                </div>
              </Feature>
            </div>
            <Feature box>
              <FeatureText>
                <Strong>Get feedback</Strong> from your team and clients on how
                everything is supposed to work.
              </FeatureText>
            </Feature>

            <Feature box>
              <FeatureText>
                <Strong>Explore community diagrams</Strong> to inspire your own
                solutions. Then share your work with the community to get
                feedback and kudos.
              </FeatureText>
            </Feature>
            <div className="md:col-span-2">
              <Feature box>
                <div className="grid grid-cols-2 gap-12">
                  <div className="pt-12">
                    <FeatureText>
                      <Strong>Generate flows with AI</Strong> to scaffold
                      behavior, suggest variants, turn up edge cases, and even
                      write code.
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
          <span className="text-orange-500">
            Build with executable diagrams
          </span>{' '}
          and get the best of both text-based and visual tools.
        </SectionTitle>
        <div className="grid lg:grid-cols-3 mt-24">
          <Feature>
            <img
              src="/landing/xstate-white.svg"
              className="h-8 self-start mb-4 opacity-60"
            />
            <FeatureText>
              <Strong>Run diagrams using XState</Strong>, a best-in-class open
              source library for orchestrating and managing state in JavaScript
              and TypeScript apps. No lock-in.
            </FeatureText>

            <div className="flex gap-2">
              <ButtonLink href="/docs/xstate" target="_self">
                Read XState docs
              </ButtonLink>
              <ButtonLink href="https://github.com/statelyai/xstate">
                View on Github
              </ButtonLink>
            </div>
          </Feature>

          <Feature>
            <div className="flex gap-4">
              <img
                src="/landing/platform-logos.svg"
                className="h-[30px] self-start mb-4 opacity-60"
              />
            </div>
            <FeatureText>
              <Strong>
                Use XState on the frontend, backend, or wherever JavaScript runs
              </Strong>
              . Integrations are available for React, Vue, Svelte, and other
              frameworks.
            </FeatureText>
          </Feature>
          <Feature>
            <img
              src="/landing/network-white.svg"
              className="h-[38px] self-start mb-2 opacity-60"
            />

            <FeatureText>
              XState uses event-driven programming, state machines, statecharts,
              and the actor model to{' '}
              <Strong>
                handle even the most complex logic in predictable, robust, and
                visual ways
              </Strong>
              .
            </FeatureText>
            <ButtonLink
              href="/docs/state-machines-and-statecharts"
              target="_self"
            >
              Learn more about statecharts
            </ButtonLink>
          </Feature>
        </div>
        <img src="/landing/DELETE-2.png" className="w-full h-96 mt-12" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 w-full pt-36 justify-center">
          <Feature box>
            <div className="flex">
              <ArrowLeftRightIcon className="h-[24px] self-start mt-1 text-orange-300" />
              <div className="flex-1 pl-6">
                <FeatureText>
                  <Strong>Bidirectional updates</Strong> between code and
                  visualization let you use what makes you most productive.
                </FeatureText>
              </div>
            </div>
          </Feature>
          <Feature box>
            <div className="flex">
              <FileDownIcon className="h-[24px] self-start text-orange-300" />
              <div className="flex-1 pl-6">
                <FeatureText>
                  <Strong>
                    Automatically visualize Redux, Zustand, and other code
                  </Strong>{' '}
                  to get the benefits of Stately in your codebase even without
                  XState.
                </FeatureText>
              </div>
            </div>
          </Feature>
          <Feature box>
            <FeatureText>
              <Strong>An IDE extension</Strong> brings the power of Stately into
              VS Code.
            </FeatureText>
            <ButtonLink href="https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode">
              Download the VS Code extension
            </ButtonLink>
          </Feature>

          <div className="md:col-span-2 lg:col-span-3">
            <Feature box>
              <div className="grid grid-cols-2 gap-12">
                <div className="pt-12">
                  <FeatureText>
                    <Strong>Generate React apps from diagrams</Strong> to
                    jumpstart product development. Keep iterating visually with
                    the help of AI or dive straight into the code to rapidly
                    extend the scaffolding with your vision.
                  </FeatureText>
                </div>
                <img src="/landing/DELETE-1.png" className="h-96 w-full" />
              </div>
            </Feature>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <Feature box>
              <div className="grid grid-cols-2 gap-12">
                <img src="/landing/DELETE-1.png" className="h-96 w-full" />
                <div className="pt-12">
                  <FeatureText>
                    <Strong>Generate tests automatically</Strong> to keep
                    coverage robust and up-to-date.
                  </FeatureText>
                </div>
              </div>
            </Feature>
          </div>

          <Feature box>
            <FeatureText>
              <Strong>Export all of your generated code</Strong> in Javascript
              or Typescript.
            </FeatureText>
            <FeatureText>
              <Strong>Connect with Github</Strong> to sync Stately with your
              codebase.
            </FeatureText>

            <img
              src="/landing/github-white.svg"
              className="h-[24px] self-start"
            />
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
        <p className="font-extrabold text-3xl drop-shadow-sm text-white/60 leading-tight pb-8">
          Products evolve. <span className="pl-4">People are busy.</span>
        </p>
        <SectionTitle>
          <span className="text-green-500">Understand and stay aligned</span>{' '}
          with Stately as the source of truth.
        </SectionTitle>
        <div className="grid lg:grid-cols-2 mt-24">
          <Feature>
            <div className="max-w-lg flex">
              <div className="pr-6 pt-2 text-green-300">
                <ShieldCheckIcon size="48" />
              </div>
              <FeatureText>
                <Strong>Future proof your code</Strong> with clear
                visualizations that are easy to return to and change later. Even
                years later.
              </FeatureText>
            </div>
          </Feature>
          <Feature>
            <div className="max-w-lg flex">
              <div className="pr-6 pt-2 text-green-300">
                <BookOpenIcon size="48" />
              </div>
              <FeatureText>
                <Strong>Living documentation</Strong> keeps the whole team in
                sync without extra overhead.
              </FeatureText>
            </div>
          </Feature>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mt-12">
          <div className="md:col-span-2 lg:col-span-3">
            <Feature box>
              <div className="grid grid-cols-2 gap-12">
                <div className="pt-12">
                  <FeatureText>
                    <Strong>Reference an event catalog</Strong> which is
                    automatically generated and can be annotated to provide
                    further information.
                  </FeatureText>
                </div>
                <img src="/landing/DELETE-1.png" className="h-96 w-full" />
              </div>
            </Feature>
          </div>
          <Feature box>
            <FeatureText>
              <Strong>Save versions</Strong> as backup and to see the history of
              your work.
            </FeatureText>
          </Feature>

          <Feature box>
            <FeatureText>
              <Strong>
                Export as markdown stories, Mermaid drawings, or JSON documents
              </Strong>{' '}
              that can be copied into issues and project documents.
            </FeatureText>
          </Feature>
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
          instant realtime backend.
        </SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2  pt-16 gap-12">
          <div className="max-w-xl">
            <FeatureText>
              <Strong>Want to keep it simple?</Strong> Design in our visual
              editor then one-click deploy to our multiplayer ready
              logic-as-a-service Stately Sky.
            </FeatureText>
          </div>
          <div className="max-w-xl">
            <FeatureText>
              Send your events using our SDK and{' '}
              <Strong>we'll update all clients automatically</Strong>.
            </FeatureText>
          </div>
        </div>

        <img src="/landing/DELETE-2.png" className="h-120 w-full mt-32" />

        <div className="max-w-5xl mt-24 flex flex-col gap-4 m-auto">
          <FeatureTitle>A seamless developer experience</FeatureTitle>
          <FeatureText>
            Coding against large cloud services is cumbersome, boilerplate
            heavy, and painful to deploy. <br />
            Low/no-code platforms can be inflexible and require vendor lock-in.
          </FeatureText>
          <FeatureText>
            <Strong>
              With Stately Sky, just draw a diagram, generate an API key, and
              press "Deploy". <br />
              And it has robust export options with no lock-in.
            </Strong>
          </FeatureText>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-36">
          <div className="grid col-span-3">
            <Feature box>
              <div className="max-w-3xl m-auto pt-4">
                <FeatureText>
                  Combine the expressiveness and readability of statecharts with
                  the durability and fault tolerance of cloud computing by
                  running state machines as actors in Sky.
                </FeatureText>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-auto pt-8 pb-8">
                <div className="flex gap-4">
                  <PartyPopperIcon className="text-purple-300 mb-4 mt-1" />
                  <div className="flex-1">
                    <FeatureText>
                      <Strong>Multiplayer collaboration</Strong> which can be
                      useful for whiteboarding, document editing, gaming or many
                      other types of apps.
                    </FeatureText>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MergeIcon className="text-purple-300 mb-4 mt-1" />
                  <div className="flex-1">
                    <FeatureText>
                      <Strong>Asynchronous workflows</Strong> like fetching
                      large amounts of data in the background.
                    </FeatureText>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CalendarIcon className="text-purple-300 mb-4 mt-1" />
                  <div className="flex-1">
                    <FeatureText>
                      <Strong>Long-running backend processes</Strong> like
                      medical patient onboarding flows or inventory management.
                    </FeatureText>
                  </div>
                </div>
              </div>
            </Feature>
          </div>
        </div>
      </BenefitSection>
    </AnimateAwayGradient>
  );
}

function BenefitSection({ anchorLink, children }) {
  return (
    <section
      id={anchorLink}
      className={classNames(
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

// Eventually maybe make all bolded text links to doc pages
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

function FeatureTitle({ children }) {
  return (
    <div className="font-extrabold text-xl md:text-2xl lg:text-3xl drop-shadow-sm text-white/90 leading-tight md:leading-tight lg:leading-tight">
      {children}
    </div>
  );
}
