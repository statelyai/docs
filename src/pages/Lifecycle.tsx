import React from 'react';
import { classNames, ButtonLink, ComingSoon } from './SharedComponents';

export function Lifecycle() {
  return (
    <div className="pt-72 pb-48">
      <h1 className="text-7xl font-semibold text-white/90 tracking-tighter leading-tight text-center max-w-6xl m-auto">
        Stately transitions your team through the product lifecycle.
      </h1>
      <div className="flex gap-12 flex-col">
        <LifecycleStep num="1" title="Design" color="pink">
          <DesignSection />
        </LifecycleStep>
        <LifecycleStep num="2" title="Build" color="green">
          <BuildSection />
        </LifecycleStep>
        <LifecycleStep num="3" title="Ship" color="teal">
          <ShipSection />
        </LifecycleStep>
        <LifecycleStep num="4" title="Understand" color="purple">
          <UnderstandSection />
        </LifecycleStep>
      </div>
    </div>
  );
}

const boxStyles =
  'flex h-fit w-fit max-w-6xl rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-800/10 border border-[0.5px] shadow-md shadow-blue-900 border-blue-850 py-6 px-8 gap-12';

const imgStyles =
  'max-w-2xl rounded-md border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850 h-96 w-full';

function DesignSection() {
  return (
    <div className="container max-w-7xl grid w-full pl-24 gap-12">
      <p className="text-white/60 text-3xl leading-normal pl-4 mb-12 max-w-4xl">
        <StrongLink>Collaborate on robust app logic</StrongLink> with a visual
        language that everyone on the team can understand.
      </p>
      <FeatureLeftImage imgSrc="/landing/DELETE-1.png">
        <StrongLink>Generate flows with AI</StrongLink> to scaffold behavior,
        suggest variants, turn up edge cases, and even write code.
      </FeatureLeftImage>
      <FeatureRightImage imgSrc="/landing/DELETE-1.png">
        <p className="pb-12">
          <StrongLink>Simulate your logic</StrongLink> to test and iterate.
        </p>
        <ComingSoon />
        <p className="pt-2">
          Run realistic simulations with live code in the visual editor.
          Prototype experiences by attaching mockups to states.
        </p>
      </FeatureRightImage>
      <FeatureLeftImage imgSrc="/landing/DELETE-1.png">
        <StrongLink>Get feedback</StrongLink> from your team and your clients on
        how everything is supposed to work.
      </FeatureLeftImage>

      <FeatureRightImage imgSrc="/landing/DELETE-1.png">
        <StrongLink>Explore community diagrams</StrongLink> for inspiration on
        your own solutions. Then share your work back with the community to get
        feedback and kudos.
      </FeatureRightImage>
    </div>
  );
}

function BuildSection() {
  return (
    <div className="container max-w-7xl grid w-full pl-24 gap-12">
      <p className="text-white/60 text-3xl leading-normal pl-4 mb-12">
        <StrongLink>Give your coding superpowers</StrongLink> by getting the
        best of both text and visual tools.
      </p>
      <img src="/landing/DELETE-2.png" className="w-full h-96 ml-4" />
      <div className="flex flex-wrap gap-x-12 gap-y-8 w-full pt-12 justify-center">
        <FeatureText>
          <p>
            <StrongLink>Bidirectional updates</StrongLink> between code and
            visualization let you use what makes you most productive.
          </p>
        </FeatureText>
        <FeatureText>
          <StrongLink>Create legacy-proof code</StrongLink> that is easy to
          understand and change later.
        </FeatureText>

        <FeatureText>
          <StrongLink>Generate tests automatically</StrongLink> to keep them
          robust and up-to-date.
        </FeatureText>
        <FeatureText>
          <p className="pb-4">
            <StrongLink>An IDE extension</StrongLink> brings the power of
            Stately into VS Code.
          </p>
          <ButtonLink size="small">Download the VS Code extension</ButtonLink>
        </FeatureText>
        <FeatureText>
          <Strong>Save versions</Strong> as backup and to see the history of
          your work.
        </FeatureText>

        <FeatureText>
          <p>
            <StrongLink>Connect with Github</StrongLink> to sync Stately with
            your code.
          </p>
        </FeatureText>

        <FeatureText>
          <p>
            <StrongLink>
              Rapidly build workflows with integration templates
            </StrongLink>{' '}
            in the visual editor. Especially when AI helps generate the code.
          </p>
          <div className="pt-4">
            <ComingSoon />
          </div>
        </FeatureText>

        <FeatureText>
          <p>
            <Strong>Inspect running apps</Strong> in the visual editor to help
            build, test, and debug your logic.
          </p>
          <div className="pt-4">
            <ComingSoon />
          </div>
        </FeatureText>

        <div className="max-w-2xl pt-12">
          <FeatureBox>
            <p>
              <Strong>Use state machines and statecharts</Strong> to create
              reliable, resilient behaviors.
            </p>
            <p className="pt-4 text-base leading-normal text-white/60">
              Statecharts make state management simpler. Get an overview of how
              your application works at a glance. Find states that are often
              missed, including unwanted states, impossible states and
              unnecessary error states. As well as eliminating bugs and other
              issues caused by boolean-based state management.
            </p>
            <div className="pt-4 ">
              <ButtonLink size="small">Learn more about statecharts</ButtonLink>
            </div>
          </FeatureBox>
        </div>

        {/* <p className="pt-4">
            <StrongLink>
              Drag around when functions are called in your code
            </StrongLink>{' '}
            with visual effect blocks to make managing complex logic intuitive
            and simple.
          </p> */}
      </div>
    </div>
  );
}

function ShipSection() {
  return (
    <div className="container max-w-7xl grid w-full pl-28">
      <p className="text-white/60 text-3xl leading-normal">
        <Strong>Deploy flows to Stately Sky</Strong> to keep realtime state
        syncing simple.
      </p>
      <p className="text-lg leading-normal text-white/60 pt-8">
        Send events from your code using our SDK to update state across clients
        automatically.
      </p>
      <div className="pt-12">
        <ComingSoon />
      </div>
      <img src="/landing/DELETE-2.png" className="h-96 w-full mt-12" />
    </div>
  );
}

function UnderstandSection() {
  return (
    <div className="container max-w-7xl grid w-full pl-24 gap-12">
      <p className="text-white/60 text-3xl leading-normal pl-6 mb-12 max-w-5xl">
        <StrongLink>Analyze, iterate, and align</StrongLink> with Stately as the
        source of truth for your logic.
      </p>

      <div className="flex flex-wrap gap-12 w-full">
        <FeatureBox>
          <Strong>Use living documentation</Strong> that can keep the whole team
          in sync without extra overhead.
        </FeatureBox>
        <FeatureBox>
          <Strong>Export flows as Mermaid, markdown, or JSON documents</Strong>{' '}
          that can be copied into issues and project documents.
        </FeatureBox>
        <FeatureBox>
          <p>
            <Strong>Visualize communication between actors</Strong> in a system
            with sequence diagrams.
          </p>
          <div className="pt-12">
            <ComingSoon />
          </div>
        </FeatureBox>
      </div>
      <FeatureLeftImage>
        <Strong>Catalog events automatically</Strong> in an easy to use format.
      </FeatureLeftImage>
      <FeatureBox>And start the process again.</FeatureBox>
    </div>
  );
}

function LifecycleStep({ num, title, color, children }) {
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

  const otherTextStyles = 'font-extrabold text-6xl pl-8 drop-shadow-sm';
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
    <>
      <div
        className={classNames(
          'bg-gradient-to-b from-blue-600/10 to-blue-950 border-t border-t-blue-600/30',
          'mt-36 pt-12',
        )}
      >
        <div className="container max-w-7xl flex items-center ">
          <div className={numberStyles}>
            <span className="text-4xl font-black text-white">{num}</span>
          </div>
          <div className={textStyles}>{title}</div>
        </div>
      </div>
      {children}
    </>
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
    <div className={classNames(boxStyles, 'w-full')}>
      <img src={imgSrc} className={imgStyles} />
      <p className="text-white/60 text-2xl leading-normal pt-12 flex-1">
        {children}
      </p>
    </div>
  );
}

function FeatureRightImage({ children, imgSrc = '/landing/DELETE-1.png' }) {
  return (
    <div className="flex h-fit w-fit max-w-6xl rounded-3xl py-6 px-8 gap-12">
      <p className="text-white/60 text-2xl leading-normal pt-12 flex-1">
        {children}
      </p>
      <img src={imgSrc} className={imgStyles} />
    </div>
  );
}

function FeatureText({ children, imgSrc = '/landing/DELETE-1.png' }) {
  return (
    <div
      className={classNames(
        'flex h-fit w-fit max-w-6xl py-6 px-8 gap-12',
        'w-full max-w-lg',
      )}
    >
      <p className="text-white/60 text-2xl leading-normal">{children}</p>
    </div>
  );
}

function FeatureBox({ children, imgSrc = '/landing/DELETE-1.png' }) {
  return (
    <div className="flex flex-1 rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-800/10 border-[0.5px] shadow-md shadow-blue-900 border-blue-850 py-6 px-8 gap-12">
      <p className="text-white/60 text-2xl leading-normal">{children}</p>
    </div>
  );
}
