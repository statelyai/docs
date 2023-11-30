import { ButtonLink } from './SharedComponents';

export function Intro() {
  return (
    <section className="py-36 bgimage-gradient-blue">
      <div className="container m-auto max-w-7xl">
        <h1 className="text-5xl font-semibold leading-tight tracking-tighter text-center md:text-6xl lg:text-6xl text-white/90 drop-shadow-sm">
          Your intelligent assistant for robust logic
        </h1>
        <ExampleRow />

        <div className="flex flex-col items-center w-full">
          <p className="max-w-lg mt-24 mb-12 text-lg leading-normal tracking-tight text-center md:text-xl lg:text-2xl text-white/60 drop-shadow-sm">
            Build and deploy workflows and app logic with AI enhanced,
            collaborative tools
          </p>
          <CallToActionButtons />
        </div>

        <div className="w-full rounded-md shadow-md">
          <img
            alt="This state machine is called Accumulate room readings. Its purpose is to get temperature and humidity readings from IoT sensors and generate a report every hour. The state machine starts in the ConsumeReadings state, where it initializes the temperature and humidity values as null. It then waits for temperature and humidity events to be logged. When a temperature event is logged, the state machine updates the temperature value. Similarly, when a humidity event is logged, it updates the humidity value. After one hour, the state machine transitions to the GenerateReport state. In this state, it invokes a service called produceReport to generate the report. Once the report is generated, the state machine transitions back to the ConsumeReadings state to continue accumulating readings."
            src="/assets/landing/room-readings.png"
            width="1248"
            height="710"
            className="w-full my-24 rounded-md border-[0.5px] shadow-2xl shadow-blue-900 border-blue-850"
          />
        </div>
        <Companies />
      </div>
    </section>
  );
}

const exampleBox =
  'px-4 py-2 border-[0.5px] border-blue-700/60 border-dotted rounded-md w-fit text-white/60 bg-gradient-to-b from-blue-900/60 to-blue-900/10 font-bold text-sm';

const line = 'w-4 lg:w-12 h-[1px] bg-blue-800 self-center rounded-md';

function ExampleRow() {
  return (
    <ul className="flex flex-wrap justify-center max-w-full gap-2 m-auto mt-20 select-none">
      <li className="flex flex-wrap gap-2">
        <div className={exampleBox}>Workflows</div>{' '}
        <span className={line}></span>
      </li>
      <li className="flex flex-wrap gap-2">
        <div className={exampleBox}>Chatbots</div>{' '}
        <span className={line}></span>
      </li>
      <li className="flex flex-wrap gap-2">
        <div className={exampleBox}>Multistep forms</div>{' '}
        <span className={line}></span>
      </li>
      <li className="flex flex-wrap gap-2">
        <div className={exampleBox}>Onboarding</div>{' '}
        <span className={line}></span>
      </li>
      <li className="flex flex-wrap gap-2">
        <div className={exampleBox}>Games</div> <span className={line}></span>
      </li>
      <li className="flex flex-wrap gap-2">
        <div className={exampleBox}>Complex logic</div>{' '}
        <span className={line}></span>
      </li>
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
    <div className="flex justify-center gap-4 md:justify-start">
      <ButtonLink
        size="large"
        background="pink"
        href="/editor?source=landing-page"
        target="_self"
      >
        Try the visual editor
      </ButtonLink>
      <ButtonLink
        size="large"
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
    <div className="container flex flex-wrap justify-center max-w-3xl gap-12 pb-16 md:gap-16 lg:max-w-5xl">
      <Company
        src="/landing-page/assets/aws.svg"
        alt="AWS"
        height="64"
        width="65"
      />
      <Company
        src="/landing-page/assets/ted.svg"
        alt="TED"
        height="64"
        width="80"
      />
      <Company
        src="/landing-page/assets/netflix.svg"
        alt="Netflix"
        height="64"
        width="122"
      />
      <Company
        src="/landing-page/assets/lyft.svg"
        alt="Lyft"
        height="64"
        width="58"
      />
      <Company
        src="/landing-page/assets/microsoft.svg"
        alt="Microsoft"
        height="64"
        width="154"
      />
      <Company
        src="/landing-page/assets/epic-games.svg"
        alt="Epic Games"
        height="64"
        width="45"
      />
      <Company
        src="/landing-page/assets/cisco.svg"
        alt="Cisco"
        height="64"
        width="74"
      />
    </div>
  );
}

function Company({ src, alt, height, width }) {
  return (
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      className="h-16 opacity-50"
    />
  );
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
