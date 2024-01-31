import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  FileDownIcon,
  MergeIcon,
  PartyPopperIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Wand2Icon,
} from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
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
          <div className="grid grid-cols-1 gap-12 pt-16 lg:grid-cols-2">
            <div className="flex max-w-lg">
              <div className="pt-2 pr-12 text-pink-300">
                <Wand2Icon size="32" />
              </div>
              <FeatureText>
                Our drag and drop editor brings together contributors of all
                backgrounds. Code, diagrams, documentation, test generation, and
                more in one place. No more silos. Always up to date.
              </FeatureText>
            </div>
            <div className="flex max-w-lg">
              <div className="pt-2 pr-12 text-pink-300">
                <SparklesIcon size="32" />
              </div>
              <FeatureText>
                AI's love helping at each phase with state machines to guide
                them, while humans use the visual editor to audit and enhance
                their work.
              </FeatureText>
            </div>
          </div>

          <div className="grid w-full gap-12 pt-24 md:grid-cols-2">
            <div className="md:col-span-2">
              <Feature noPadding box>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 p-12">
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
                <img
                  alt="View of the same credit check workflow in simulate mode in the Stately editor. In Design mode, states can be added. In Simulate mode, the machine can be walked through where the current state and available events are highlighted."
                  src="/assets/landing/design-and-simulate.png"
                  className="w-full h-auto rounded-b-2xl"
                  height="385"
                  width="1207"
                />
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
                solutions. Share your work with the community to get feedback
                and kudos.
              </FeatureText>
            </Feature>
            <div className="md:col-span-2">
              <Feature box noPadding>
                <div className="grid md:grid-cols-2">
                  <div className="p-12">
                    <FeatureText>
                      <Strong>Embed Figma designs or attach images and other assets to states</Strong>{' '}
                      to view mockups, requirements documents, and more
                      alongside the code.
                    </FeatureText>
                    <div className="grid pt-12 gap-8">

                    <div className="flex gap-4">
                        <CheckCircleIcon className="text-pink-300 mt-1" />
                        <div className="flex-1">
                          <FeatureText>
                            Embedded Figma frames stay in sync with your design files.
                          </FeatureText>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <CheckCircleIcon className="text-pink-300 mt-1" />
                        <div className="flex-1">
                          <FeatureText>
                            Designers and product managers can fill in how each
                            state is supposed to look.
                          </FeatureText>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <CheckCircleIcon className="text-pink-300 mt-1" />
                        <div className="flex-1">
                          <FeatureText>
                            Intuitively understand what a state machine does
                            with images at each step.
                          </FeatureText>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <CheckCircleIcon className="text-pink-300 mt-1" />
                        <div className="flex-1">
                          <FeatureText>
                            Quickly prototype new ideas by experiencing mockups
                            using the same logic as your code.
                          </FeatureText>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    alt="A state machine in the Stately editor for a color picker with a screenshot of the color value input in the idle state and a screenshot of the full spectrum color picker in the open state."
                    src="/assets/landing/assets-colorpicker.png"
                    className="w-full h-auto rounded-r-2xl"
                    width="603"
                    height="903"
                  />
                </div>
              </Feature>
            </div>

            <div className="md:col-span-2">
              <Feature box noPadding>
                <div className="pt-24 pl-12 max-w-xl pb-24 m-auto">
                  <FeatureText>
                    <Strong>Generate flows with AI</Strong> to scaffold
                    behavior, suggest variants, turn up edge cases, and even
                    write code.
                  </FeatureText>
                </div>
                <img
                  alt="A state machine being accurately generated in the Stately editor from the text description: An authentication flow for a web app. The first two sign in options are using GitHub or Apple where the user does not need to enter their email address or password. The third sign in option is using email where the user needs to enter their email address and password to sign up if they have not already signed up or to sign in if they have already signed up. The authentication flow is complete when a user has signed in."
                  src="/assets/landing/ai-generation.png"
                  className="w-full h-auto rounded-br-2xl"
                  height="363"
                  width="1207"
                />
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
          and get the best of text-based and visual tools.
        </SectionTitle>
        <div className="grid mt-24 lg:grid-cols-3">
          <Feature>
            <img
              alt="XState"
              src="/assets/landing/xstate-white.svg"
              height="32"
              width="118"
              className="self-start h-8 mb-4 opacity-60"
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
                alt="TypeScript, React, Vue"
                src="/assets/landing/platform-logos.svg"
                height="30"
                width="126"
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
              alt=""
              height="32"
              width="102"
              src="/assets/landing/network-white.svg"
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
        <img
          alt="A book lender state machine in VSCode. One panel shows the state machine as a JavaScript object, the other panel shows the same state machine visualized using the XState VSCode extension."
          src="/assets/landing/vscode-split.png"
          className="w-full h-auto mt-12"
          height="637"
          width="1208"
        />
        <div className="grid justify-center w-full gap-12 md:grid-cols-2 lg:grid-cols-3 pt-48">
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
            <Feature box noPadding>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="pt-12 pl-12">
                  <FeatureText>
                    <Strong>Generate React apps from diagrams</Strong> to
                    jumpstart product development. Keep iterating visually with
                    the help of AI, or dive straight into the code to rapidly
                    extend the scaffolding with your vision.
                  </FeatureText>
                </div>
                <img
                  alt="The room reading state machine visualized in the Stately editor alongside the React app code generated for that app logic. Over the top is a button that says Generate React app."
                  src="/assets/landing/generate-react.png"
                  className="w-full h-auto rounded-b-2xl md:rounded-bl-[0] md:rounded-tr-2xl"
                  height="331"
                  width="580"
                />
              </div>
            </Feature>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <Feature box noPadding>
              <div>
                <div className="pb-24 pt-12 pl-12">
                  <FeatureText>
                    <Strong>Generate tests automatically</Strong> to keep
                    coverage robust and up-to-date.
                  </FeatureText>
                </div>
                <img
                  alt="A test path list of states and events in the Stately editor alongside that path being highlighted on the canvas, and the code generated to implement the tests."
                  src="/assets/landing/test-generation.png"
                  height="287"
                  width="1207"
                  className="w-full h-auto rounded-br-2xl"
                />
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
              alt="GitHub"
              src="/assets/landing/github-white.svg"
              width="24"
              height="24"
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
        <p className="pb-8 text-3xl font-extrabold leading-tight drop-shadow-sm text-white/60">
          Products evolve. <span className="pl-4">People are busy.</span>
        </p>
        <SectionTitle>
          <span className="text-green-500">Understand and stay aligned</span>{' '}
          with Stately as the source of truth.
        </SectionTitle>
        <div className="grid mt-24 lg:grid-cols-2">
          <Feature>
            <div className="flex max-w-lg">
              <div className="pt-2 pr-6 text-green-300">
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
            <div className="flex max-w-lg">
              <div className="pt-2 pr-6 text-green-300">
                <BookOpenIcon size="48" />
              </div>
              <FeatureText>
                <Strong>Living documentation</Strong> keeps the whole team in
                sync without extra overhead.
              </FeatureText>
            </div>
          </Feature>
        </div>
        <div className="grid w-full gap-12 mt-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-3">
            <Feature box noPadding>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="pt-12 pl-12">
                  <FeatureText>
                    <Strong>Reference an event catalog</Strong> which is
                    automatically generated and can be annotated to provide
                    further information.
                  </FeatureText>
                </div>
                <img
                  alt="An order flow in the Stately editor alongside the event schema which shows events for OrderCreatedEvent, ShipmentSentEvent and OrderConfirmedEvent. Each event has properties of various types including string, array, object, and boolean."
                  src="/assets/landing/event-schema.png"
                  height="580"
                  width="470"
                  className="rounded-md"
                />
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

          <Feature box>
            <FeatureText>
              <Strong>Generate diagram summaries</Strong> to get oriented
              quickly.
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
        <div className="grid grid-cols-1 gap-12 pt-16 lg:grid-cols-2">
          <div className="max-w-xl">
            <FeatureText>
              <Strong>Want to keep it simple?</Strong> Design in our visual
              editor, then one-click deploy to our multiplayer ready
              logic-as-a-service Stately Sky.
            </FeatureText>
          </div>
          <div className="max-w-xl">
            <FeatureText>
              Send events using our SDK, and{' '}
              <Strong>we'll update all clients automatically</Strong>.
            </FeatureText>
          </div>
        </div>

        <img
          alt="A traffic light machine in the Stately editor alongside a live web app with a rendering of a traffic light."
          src="/assets/landing/deploy-to-sky.png"
          height="598"
          width="1024"
          className="w-full h-auto max-w-5xl mx-auto mt-32 rounded-2xl border-2 border-white/10"
        />

        <div className="flex flex-col max-w-5xl gap-4 m-auto mt-48">
          <FeatureTitle>A seamless developer experience</FeatureTitle>
          <FeatureText>
            Coding against large cloud services is cumbersome, boilerplate
            heavy, and painful to deploy. <br />
            Low/no-code platforms can be inflexible and require vendor lock-in.
          </FeatureText>
          <FeatureText>
            <Strong>
              With Stately Sky, simply draw a diagram, generate an API key, and
              click "Deploy".
              <br />
              It also offers reliable export options without any lock-in.
            </Strong>
          </FeatureText>
        </div>

        <img
          alt="A diagram showing how Stately Studio deploys an actor to Stately Sky, how the config is sent from Stately Sky to Stately Sky SDK, which in turn sents state and events back to Stately Sky."
          src="/assets/landing/sky-diagram.svg"
          height="139"
          width="1024"
          className="w-full max-w-5xl mx-auto mt-24"
        />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 mt-36">
          <div className="grid col-span-3">
            <Feature box>
              <div className="max-w-3xl py-12 m-auto">
                <FeatureText>
                  Combine the expressiveness and readability of statecharts with
                  the durability and fault tolerance of cloud computing by
                  running state machines as actors in Sky.
                </FeatureText>
              </div>

              <div className="grid grid-cols-1 gap-8 pt-8 pb-8 m-auto md:grid-cols-2 lg:grid-cols-3">
                <div className="flex gap-4">
                  <PartyPopperIcon className="mt-1 mb-4 text-purple-300" />
                  <div className="flex-1">
                    <FeatureText>
                      <Strong>Multiplayer collaboration</Strong> which can be
                      useful for whiteboarding, document editing, gaming or many
                      other types of apps.
                    </FeatureText>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MergeIcon className="mt-1 mb-4 text-purple-300" />
                  <div className="flex-1">
                    <FeatureText>
                      <Strong>Asynchronous workflows</Strong> enhance efficiency
                      in operations without immediate results, such as data
                      processing, email delivery, or API calls.
                    </FeatureText>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CalendarIcon className="mt-1 mb-4 text-purple-300" />
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
// function StrongLink({ children, href = 'https://www.stately.ai/docs' }) {
//   return (
//     <a
//       href={href}
//       className="font-extrabold text-white/90 hover:text-white"
//       target="_blank"
//     >
//       {children}
//     </a>
//   );
// }

function FeatureText({
  children,
  imgSrc = '/landing/DELETE-1.png',
  imgAlt = 'TODO',
}) {
  return <p className="text-xl leading-normal text-white/60">{children}</p>;
}

function Feature({
  children,
  comingSoon,
  box,
  imgSrc,
  imgAlt,
  imgHeight,
  imgWidth,
  noPadding,
}: {
  children: ReactNode;
  comingSoon?: boolean;
  box?: boolean;
  imgSrc?: string;
  imgAlt?: string;
  imgHeight?: string;
  imgWidth?: string;
  noPadding?: boolean;
}) {
  const boxStyles = box
    ? 'bg-gradient-to-b from-gray-800/50 to-gray-800/10 border-[0.5px] shadow-md shadow-blue-900 border-blue-850 rounded-2xl'
    : '';

  const paddingStyles = noPadding ? 0 : 'py-6 px-8';
  return (
    <div
      className={classNames(
        boxStyles,
        paddingStyles,
        'flex flex-col gap-6 text-white/60 text-lg leading-normal',
      )}
    >
      {children}
      {comingSoon && <ComingSoon />}
      {imgSrc && (
        <img
          alt={imgAlt}
          src={imgSrc}
          height={imgHeight}
          width={imgWidth}
          className="rounded-xl border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850 h-auto w-full mt-8"
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
    <h3 className="text-xl font-extrabold leading-tight md:text-2xl lg:text-3xl drop-shadow-sm text-white/90 md:leading-tight lg:leading-tight">
      {children}
    </h3>
  );
}
