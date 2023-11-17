import React, { ReactNode } from 'react';
import { ButtonLink, classNames, ComingSoon } from './SharedComponents';

export function Summary() {
  return (
    <>
      {/* <Examples /> */}
      <SummaryList />
    </>
  );
}

// function Examples() {
//   return (
//     <div className="container flex max-w-7xl pt-24">
//       <div className="font-semibold text-2xl pr-12 text-blue-300 pt-3">
//         Your assistant for
//       </div>
//       <ul className="text-white font-extrabold text-5xl">
//         <li>Chatbots</li>
//         <li>Backend workflows</li>
//         <li>Onboarding</li>
//         <li>Auth</li>
//         <li>Prototypes</li>
//         <li>Requirements meetings</li>
//         <li>. . .</li>
//       </ul>
//     </div>
//   );
// }

function SummaryList() {
  return (
    <div className="flex flex-wrap m-auto max-w-8xl justify-center">
      <SummaryListItem
        title="The collaborative source of truth for your app logic"
        full
        imgSrc="/landing/DELETE-1.png"
      >
        <p className="pb-4">
          Our visual editor brings together contributors of all backgrounds.
          Code, diagrams, documentation, test generation, and more in one place.
        </p>
        <p>No more silos. Always up to date.</p>
      </SummaryListItem>
      <div className="pt-12 flex max-w-7xl">
        <SummaryListItem
          title="Run diagrams using XState"
          href="https://www.stately.ai"
          linkText="Read XState docs"
          boxBg
        >
          <p>
            A best-in-class open source library for handling complexity at
            scale.
          </p>
          <p className="pt-4 pb-4">
            Use our drag-and-drop visual editor to build your application logic,
            then export it directly into your XState project.
          </p>
          <p> No lock-in.</p>
        </SummaryListItem>
        <SummaryListItem
          title="Deploy to Stately"
          // href="https://www.stately.ai"
          // linkText="Learn more about Stately Sky"
          boxBg
        >
          <p>
            Want to keep it simple? Design in our visual editor, then send
            events to Stately using our SDK and let us handle your backend with
            support for realtime multiplayer.
          </p>
          <div className="pt-6">
            <ComingSoon />
          </div>
        </SummaryListItem>
      </div>
    </div>
  );
}
// function SummaryListItemOld({
//   title,
//   details,
//   href,
//   linkText,
// }: {
//   title: string;
//   details: string;
//   href?: string;
//   linkText?: string;
// }) {
//   return (
//     <li className="h-fit m-6 w-96 rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-800/10 border border-[0.5px] shadow-md shadow-blue-900 border-blue-850 py-6 px-8">
//       <p className="text-white text-2xl font-semibold text-blue-300">{title}</p>
//       <p className="text-lg leading-snug text-white/60 pt-2">{details}</p>
//       {href && linkText && (
//         <div className="pt-8">
//           <ButtonLink href={href} target="_blank" size="small">
//             {linkText}
//           </ButtonLink>
//         </div>
//       )}
//     </li>
//   );
// }

function SummaryListItem({
  title,
  children,
  href,
  linkText,
  full,
  imgSrc,
  boxBg,
}: {
  children: ReactNode;
  full?: boolean;
  imgSrc?: string;
  boxBg?: boolean;
  title: string;
  href?: string;
  linkText?: string;
}) {
  const width = full ? 'w-full' : 'flex-1';
  const boxStyles =
    boxBg &&
    'rounded-3xl bg-gradient-to-b from-gray-800/50 to-gray-800/10 border border-[0.5px] shadow-md shadow-blue-900 border-blue-850';
  const otherStyles = 'm-6 py-8 px-12 flex gap-16 justify-center';
  const itemStyles = classNames(width, boxStyles, otherStyles);
  return (
    <div className={itemStyles}>
      {imgSrc && <img src={imgSrc} className="max-w-xl w-full h-96" />}
      <div className={imgSrc ? 'max-w-lg pt-12' : 'max-w-lg'}>
        <p className="text-white text-3xl font-semibold text-blue-300">
          {title}
        </p>
        <p className="text-lg leading-snug text-white/60 pt-6">{children}</p>
        {href && linkText && (
          <div className="pt-6">
            <ButtonLink href={href} target="_blank">
              {linkText}
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}
