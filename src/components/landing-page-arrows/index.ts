import {
  bendPath,
  getInnerGridLines,
  getLineSegmentsFromGridLines,
  getSvgPathFromSegments,
  oppositeSide,
  pathToD,
} from './path';
import { Rect } from './rect';
import { Side } from './types';

export function drawArrows() {
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

  const defEl = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

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
  svgEl.appendChild(defEl);
  document.body.appendChild(svgEl);

  interface DrawnPath {
    redraw: () => void;
  }

  function onResize(el: any, cb: (rect: Rect) => void) {
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (el.ownerDocument.contains(el)) {
          cb(el.getBoundingClientRect());
        }
      });
    });
    resizeObserver.observe(el);

    return () => resizeObserver.unobserve(el);
  }

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
        oppositeSide[resolvedConfig.sourceSide] === resolvedConfig.targetSide &&
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

  function maybeStringToNumber(string?: string): number | undefined {
    return string !== undefined ? +string : undefined;
  }

  const nodeEls = document.querySelectorAll<HTMLElement>('[data-edge-source]');
  const paths: DrawnPath[] = [];

  nodeEls.forEach((elNode) => {
    const target = elNode.dataset.edgeTarget;

    if (!target) {
      return;
    }

    const elTarget = document.querySelector(`[data-edge-source="${target}"]`);

    if (!elTarget) {
      return;
    }

    const sourceSide = (elNode.dataset.edgeSourceSide as Side) ?? 'bottom';
    const targetSide = (elNode.dataset.edgeTargetSide as Side) ?? 'top';
    const sourcePosition = maybeStringToNumber(
      elNode.dataset.edgeSourcePosition,
    );
    const targetPosition = maybeStringToNumber(
      elNode.dataset.edgeTargetPosition,
    );
    const bendPosition = maybeStringToNumber(elNode.dataset.edgeBendPosition);

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

  window.addEventListener('resize', () => {
    paths.forEach((path) => path.redraw());
  });

  onResize(document.body, () => {
    paths.forEach((path) => path.redraw());
  });
}
