import React from 'react';
import { ButtonLink } from './SharedComponents';
import './styles.css';

export function Intro() {
  return (
    <section className="py-36 bgimage-gradient-blue">
      <div className="container m-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white/90 drop-shadow-sm tracking-tighter leading-tight">
          Build robust app logic and workflows.
        </h1>
        <ExampleRow />
        <CallToActionButtons />

        <div className="shadow-md rounded-md w-full bg-red">
          <img
            src="/landing/example-default.png"
            className="w-full my-24 rounded-md border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850"
          />
        </div>
        <Companies />
      </div>
    </section>
  );
}

const exampleBox =
  'px-4 py-2 border-[0.5px] border-blue-700/60 rounded-md w-fit text-white/60 bg-gradient-to-b from-blue-900/60 to-blue-900/10 font-bold text-sm';

const line = 'w-4 lg:w-12 h-[1px] bg-blue-800 self-center rounded-md';

function ExampleRow() {
  return (
    <ul className="flex max-w-full flex-wrap gap-2 mt-12">
      <li className={exampleBox}>Chatbots</li>
      <hr className={line} />

      <li className={exampleBox}>Multistep forms</li>
      <hr className={line} />

      <li className={exampleBox}>Onboarding</li>
      <hr className={line} />

      <li className={exampleBox}>Complex logic</li>
      <hr className={line} />

      <li className={exampleBox}>Prototypes</li>
      <hr className={line} />

      <li className={exampleBox}>
        <span className="dot1">.</span>
        <span className="dot2">.</span>
        <span className="dot3">.</span>
      </li>
    </ul>
  );
}

function CallToActionButtons() {
  return (
    <div className="flex pt-24 gap-4 justify-center md:justify-start">
      <ButtonLink
        background="pink"
        href="https://stately.ai/editor?source=landing-page"
      >
        Try the visual editor
      </ButtonLink>
      <ButtonLink
        background="darkBlue"
        href="https://calendly.com/d/yc8-3hq-rpc/request-a-demo"
      >
        Book a demo
      </ButtonLink>
    </div>
  );
}

function Companies() {
  return (
    <div className="container flex flex-wrap gap-12 justify-center pb-16">
      <p className="text-base text-white/60 font-extrabold tracking-relaxed h-fit self-center pr-6">
        Used by
      </p>

      <Company src="/landing-page/assets/aws.svg" />
      <Company src="/landing-page/assets/ted.svg" />
      <Company src="/landing-page/assets/netflix.svg" />
      <Company src="/landing-page/assets/lyft.svg" />
      <Company src="/landing-page/assets/microsoft.svg" />
      <Company src="/landing-page/assets/epic-games.svg" />
      <Company src="/landing-page/assets/cisco.svg" />
    </div>
  );
}

function Company({ src }) {
  return <img src={src} className="h-16 opacity-50" />;
}

// function PromoVideo() {
//   return (
//     <video
//       muted={true}
//       preload="metadata"
//       autoplay={false}
//       poster="/landing-page/assets/visual-editor-v1-poster-image.png"
//       className="py-24 max-w-[1280px]"
//     >
//       <source
//         src="/landing-page/assets/visual-editor-v2.mp4"
//         type="video/mp4"
//         width="100%"
//       />
//       <p>Video is unavailable in your browser.</p>
//     </video>
//   );
// }
