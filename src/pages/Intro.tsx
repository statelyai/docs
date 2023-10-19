import React from 'react';

export function Intro() {
  return (
    <div className="bg-gray-850 pt-48 pb-24">
      <div className="container">
        <h1 className="text-6xl font-bold text-white">
          Create, share, and ship executable diagrams in minutes.
        </h1>
        <CallToActionButtons />
        <img
          src="/landing/example-default.png"
          className="w-full my-24 max-w-6xl border-[0.5px] border-[rgba(255,255,255,0.08)]"
        />
        <Companies />

        <SubheadingList />
      </div>
    </div>
  );
}

function CallToActionButtons() {
  return (
    <div className="flex pt-16 gap-4">
      <button className="text-white bg-pink-500 px-5 py-4 rounded-md">
        Try the visual editor
      </button>
      <button className="text-white bg-gray-800 px-5 py-4 rounded-md">
        Book a demo
      </button>
    </div>
  );
}

function SubheadingList() {
  return (
    <ul className="grid grid-cols-3 m-auto gap-1.5 border-t border-[rgba(255,255,255,0.08)] pt-24 pb-12">
      <SubheadingListItem
        title="The collaborative source of truth for your app logic"
        details="Integrates every phase of the product lifecycle. Code, diagrams, documentation, test generation, and more. No more silos. Always up to date."
      />
      <SubheadingListItem
        title="Run diagrams using XState"
        details="A best-in-class open source library for handling complexity at scale."
      />
      <SubheadingListItem
        title="Deploy flows to Stately Sky"
        details="Send events using our SDK and let us handle the backend."
      />
    </ul>
  );
}

function SubheadingListItem({ title, details }) {
  return (
    <li className="w-full">
      <div className="m-auto w-80">
        <p className="text-white text-lg font-bold">{title}</p>
        <p className="text-gray-400">{details}</p>
      </div>
    </li>
  );
}

function Companies() {
  return (
    <div className="flex flex-wrap gap-12 justify-center pb-12">
      <Company src="/landing-page/assets/aws.svg" />
      <Company src="/landing-page/assets/ted.svg" />
      <Company src="/landing-page/assets/netflix.svg" />
      <Company src="/landing-page/assets/lyft.svg" />
      <Company src="/landing-page/assets/centered.svg" />
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
