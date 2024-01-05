import { useEffect, useLayoutEffect } from 'react';
import { ButtonLink, classNames } from './SharedComponents';
import { Side } from '@site/src/pages/arrows/types';
import { Rect } from '@site/src/pages/arrows/rect';
import {
  bendPath,
  getInnerGridLines,
  getLineSegmentsFromGridLines,
  getSvgPathFromSegments,
  oppositeSide,
  pathToD,
} from '@site/src/pages/arrows/path';
import { maybeStringToNumber } from '@site/src/pages/arrows/index';

export function Intro() {
  return (
    <section className="py-36 bgimage-gradient-blue">
      <div className="container m-auto max-w-7xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tighter text-center text-white/90 drop-shadow-sm max-w-[645px] m-auto">
          Turn ideas into diagrams and code in minutes.
        </h1>

        <div className="flex flex-col items-center w-full pt-24">
          <ConversionBoxes />
          <p className="max-w-3xl mt-36 mb-16 text-lg leading-normal tracking-tight text-center md:text-xl lg:text-2xl text-white/60 drop-shadow-sm">
            From frontend user flows to backend workflows, build and deploy any
            type of logic with Stately as your source of truth.
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

interface DrawnPath {
  redraw: () => void;
}

function useArrows(
  config: Record<
    string,
    Array<{
      target: string;
      sourceSide?: 'top' | 'right' | 'bottom' | 'left';
      targetSide?: 'top' | 'right' | 'bottom' | 'left';
    }>
  >,
) {
  useLayoutEffect(() => {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svgEl.setAttribute(
      'style',
      `
position: absolute;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
max-width: 100%;
overflow: visible;
pointer-events: none;
z-index: 2;
`,
    );

    const defEl = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'defs',
    );

    defEl.innerHTML = `
<marker
  id="arrow"
  viewBox="0 0 10 10"
  markerWidth="5"
  markerHeight="5"
  refX="0"
  refY="5"
  markerUnits="strokeWidth"
  orient="auto"
>
  <path data-arrow="marker" d="M0,0 L0,10 L10,5 z" fill="currentcolor" />
</marker>
`;
    svgEl.setAttribute('id', 'arrows');
    svgEl.appendChild(defEl);
    document.body.appendChild(svgEl);

    return () => {
      svgEl.remove();
    };
  }, []);

  useEffect(() => {
    const nodeEls =
      document.querySelectorAll<HTMLElement>('[data-edge-source]');
    const paths: DrawnPath[] = [];
    const resizeObserverFns: Array<() => void> = [];

    function onResize(el: any, cb: (rect: Rect) => void) {
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          if (el.ownerDocument.contains(el)) {
            cb(el.getBoundingClientRect());
          }
        });
      });
      resizeObserver.observe(el);

      resizeObserverFns.push(() => resizeObserver.unobserve(el));
    }

    const svgEl = document.querySelector('#arrows')! as SVGElement;

    function drawPath(config: {
      source: Element;
      sourceSide: Side;
      /**
       * Distance (%) from left or top of source side.
       *
       * @default 0.5
       */
      sourcePosition?: number;
      target: Element;
      targetSide: Side;
      /**
       * Distance (%) from left or top of target side.
       *
       * @default 0.5
       */
      targetPosition?: number;
      /**
       * Distance (%) between start and end of zig-zag edge where it
       * should cut across.
       *
       * @default 0.5
       */
      bendPosition?: number;
      radius?: number;
      color?: string;
      attributes?: Record<string, string>;
    }): DrawnPath {
      const resolvedConfig = {
        radius: 10,
        ...config,
      };

      const { source, target } = resolvedConfig;

      function getPathD() {
        const svgRect = new Rect(svgEl.getBoundingClientRect());

        const sourceRect = new Rect(source.getBoundingClientRect());
        const targetRect = new Rect(target.getBoundingClientRect());
        const startPoint = sourceRect.relativeSide(
          resolvedConfig.sourceSide,
          resolvedConfig.sourcePosition ?? 0.5,
        );
        let endPoint = targetRect.relativeSide(
          resolvedConfig.targetSide,
          resolvedConfig.targetPosition ?? 0.5,
        );

        if (
          oppositeSide[resolvedConfig.sourceSide] ===
            resolvedConfig.targetSide &&
          resolvedConfig.targetPosition === undefined
        ) {
          if (
            ['top', 'bottom'].includes(resolvedConfig.targetSide) &&
            startPoint.x > targetRect.left &&
            startPoint.x < targetRect.right
          ) {
            endPoint.x = startPoint.x;
          } else if (
            startPoint.y > targetRect.top &&
            startPoint.y < targetRect.bottom
          ) {
            endPoint.y = startPoint.y;
          }
        }
        startPoint.y -= svgRect.top;
        endPoint.y -= svgRect.top;
        const lines = getInnerGridLines(
          startPoint,
          endPoint,
          resolvedConfig.bendPosition ?? 0.5,
        );
        const lineSegments = getLineSegmentsFromGridLines(
          startPoint,
          endPoint,
          lines,
        );

        const svgPath = getSvgPathFromSegments(
          lineSegments.allLineSegments,
          startPoint,
          endPoint,
        );

        const pathD = pathToD(bendPath(svgPath, resolvedConfig.radius));

        return pathD;
      }

      const pathEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      );

      pathEl.setAttribute('stroke', resolvedConfig.color ?? 'white');
      pathEl.setAttribute('stroke-width', '2');
      pathEl.setAttribute('fill', 'none');
      pathEl.setAttribute('d', getPathD());
      pathEl.setAttribute('marker-end', 'url(#arrow)');

      if (resolvedConfig.attributes) {
        Object.entries(resolvedConfig.attributes).forEach(([key, value]) => {
          pathEl.setAttribute(key, value);
        });
      }
      svgEl.appendChild(pathEl);

      const obj = {
        redraw: () => {
          pathEl.setAttribute('d', getPathD());
        },
      };

      onResize(source, obj.redraw);
      onResize(target, obj.redraw);

      return obj;
    }

    Object.entries(config).forEach(([nodeKey, nodeConfig]) => {
      const elNode = document.querySelector<HTMLElement>(
        `[data-edge-source="${nodeKey}"]`,
      );
      if (!elNode) {
        return;
      }

      nodeConfig.forEach((targetConfig) => {
        const elTarget = document.querySelector(
          `[data-edge-source="${targetConfig.target}"]`,
        );

        if (!elTarget) {
          return;
        }

        const sourceSide = targetConfig.sourceSide ?? 'bottom';
        const targetSide = targetConfig.targetSide ?? 'top';
        const sourcePosition = maybeStringToNumber(
          elNode.dataset.edgeSourcePosition,
        );
        const targetPosition = maybeStringToNumber(
          elNode.dataset.edgeTargetPosition,
        );
        const bendPosition = maybeStringToNumber(
          elNode.dataset.edgeBendPosition,
        );

        paths.push(
          drawPath({
            source: elNode,
            sourceSide,
            sourcePosition,
            target: elTarget,
            targetSide,
            targetPosition,
            bendPosition,
            attributes: {
              class: 'edge',
            },
            radius: 20,
          }),
        );
      });
    });

    const resizeHandler = () => {
      paths.forEach((path) => path.redraw());
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);

      resizeObserverFns.forEach((fn) => fn());
    };
  });
}

function ConversionBoxes() {
  const boxStyles =
    'bg-gradient-to-b from-gray-700/50 to-gray-700/10 border-[0.5px] shadow-md shadow-blue-900 border-blue-850 rounded-2xl py-4 px-6 h-fit w-80';
  const headerStyles = 'text-xl font-black';
  const listStyles = 'text-white/60 text-sm pt-1 font-medium space-y-1';
  useArrows({
    diagrams: [
      {
        target: 'code',
        sourceSide: 'right',
        targetSide: 'bottom',
      },
    ],
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-10 w-fit max-w-4xl m-auto">
      <div
        className={classNames(boxStyles, 'lg:col-start-1 lg:col-span-2')}
        data-edge-source="ideas"
      >
        <h3 className={headerStyles}>Ideas</h3>
        <ul className={listStyles}>
          <li>Requirements</li>
          <li>User stories</li>
          <li>Features</li>
          <li>Specifications</li>
        </ul>
      </div>

      <div
        className={classNames(
          boxStyles,
          'lg:row-start-2 lg:col-start-2 lg:col-span-3 justify-self-center',
        )}
        data-edge-source="diagrams"
      >
        <h3 className={headerStyles}>Diagrams</h3>
        <ul className={listStyles}>
          <li>State machines</li>
          <li>Flowcharts</li>
          <li>Statecharts</li>
          <li>Sequence diagrams</li>
        </ul>
      </div>

      <div
        className={classNames(boxStyles, 'lg:col-start-4 lg:col-span-2')}
        data-edge-source="code"
      >
        <h3 className={headerStyles}>Code</h3>
        <ul className={listStyles}>
          <li>Workflows</li>
          <li>App logic</li>
          <li>JS, TS, JSON</li>
          <li>Mermaid</li>
        </ul>
      </div>
    </div>
  );
}

function CallToActionButtons() {
  return (
    <div className="flex justify-center gap-4 md:justify-start">
      <ButtonLink
        background="pink"
        href="/editor?source=landing-page"
        target="_self"
        size="medium"
      >
        Try the visual editor
      </ButtonLink>
      <ButtonLink
        background="darkBlue"
        href="https://calendly.com/d/yc8-3hq-rpc/request-a-demo"
        size="medium"
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
