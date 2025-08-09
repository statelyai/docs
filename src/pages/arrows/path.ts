import type {
  SidePoint,
  GridLines,
  SidePath,
  LineSegment,
  GridLine,
  Point,
  Ray,
  Side,
  SideDirection,
  XGridLine,
  YGridLine,
  SvgPath,
  SvgPathPortion,
  CubicCurve,
  Vector,
} from './types';

export const sideFactor: Record<Side, Point & { direction: SideDirection }> = {
  left: { x: -1, y: 0, direction: 'vertical' },
  right: { x: 1, y: 0, direction: 'vertical' },
  top: { x: 0, y: -1, direction: 'horizontal' },
  bottom: { x: 0, y: 1, direction: 'horizontal' },
};

export const oppositeSide: Record<Side, Side> = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
};

export function sidePointToRay(sidePoint: SidePoint): Ray {
  const ray = {
    x: sidePoint.x,
    y: sidePoint.y,
    dx: sideFactor[sidePoint.side].x,
    dy: sideFactor[sidePoint.side].y,
  };

  return ray;
}

function doOrthoRaysIntersect(ray1: Ray, ray2: Ray) {
  if ((ray1.dx === 0 && ray2.dx === 0) || (ray1.dy === 0 && ray2.dy === 0)) {
    // parallel; TODO: deal with collinear rays
    return false;
  }

  return (
    ray1.x * ray1.dx <= ray2.x * ray1.dx &&
    ray1.y * ray1.dy <= ray2.y * ray1.dy &&
    ray2.x * ray2.dx <= ray1.x * ray2.dx &&
    ray2.y * ray2.dy <= ray1.y * ray2.dy
  );
}

function sidePathsMatchDirection(
  sidePath1: SidePath,
  sidePathDirections: [SideDirection, SideDirection],
): boolean {
  return (
    sideFactor[sidePath1[0]].direction === sidePathDirections[0] &&
    sideFactor[sidePath1[1]].direction === sidePathDirections[1]
  );
}

export function getInnerGridLines(
  sourcePoint: SidePoint,
  targetPoint: SidePoint,
  bendRatio: number = 0.5,
): GridLines {
  const { side: sourceSide } = sourcePoint;
  const { side: targetSide } = targetPoint;
  const sidePath: SidePath = [sourceSide, targetSide];
  const padding = 20; // TODO: don't hardcode

  const sourceRay = sidePointToRay(sourcePoint);
  const targetRay = sidePointToRay(targetPoint);

  if (doOrthoRaysIntersect(sourceRay, targetRay)) {
    return [];
  }

  if (sidePathsMatchDirection(sidePath, ['vertical', 'horizontal'])) {
    return [
      { x: sourcePoint.x + padding * sideFactor[sourceSide].x },
      { y: targetPoint.y + padding * sideFactor[targetSide].y },
    ];
  }

  if (sidePathsMatchDirection(sidePath, ['horizontal', 'vertical'])) {
    return [
      { y: sourcePoint.y + padding * sideFactor[sourceSide].y },
      { x: targetPoint.x + padding * sideFactor[targetSide].x },
    ];
  }

  if (sidePathsMatchDirection(sidePath, ['vertical', 'vertical'])) {
    const xFactor = sideFactor[sourceSide].x;

    if (oppositeSide[sourceSide] === targetSide) {
      if (xFactor * sourcePoint.x < xFactor * targetPoint.x) {
        return [
          { x: sourcePoint.x + (targetPoint.x - sourcePoint.x) * bendRatio },
        ];
      } else {
        return [
          { x: sourcePoint.x + padding * xFactor },
          { y: sourcePoint.y + (targetPoint.y - sourcePoint.y) * bendRatio },
          { x: targetPoint.x + padding * sideFactor[targetSide].x },
        ];
      }
    }

    return [
      {
        x:
          xFactor * Math.max(xFactor * sourcePoint.x, xFactor * targetPoint.x) +
          padding * xFactor,
      },
    ];
  }

  if (sidePathsMatchDirection(sidePath, ['horizontal', 'horizontal'])) {
    const yFactor = sideFactor[sourceSide].y;

    if (oppositeSide[sourceSide] === targetSide) {
      if (yFactor * sourcePoint.y < yFactor * targetPoint.y) {
        return [
          { y: sourcePoint.y + (targetPoint.y - sourcePoint.y) * bendRatio },
        ];
      } else {
        return [
          { y: sourcePoint.y + padding * yFactor },
          { x: sourcePoint.x + (targetPoint.x - sourcePoint.x) * bendRatio },
          { y: targetPoint.y + padding * sideFactor[targetSide].y },
        ];
      }
    }

    return [
      {
        y:
          yFactor * Math.max(yFactor * sourcePoint.y, yFactor * targetPoint.y) +
          padding * yFactor,
      },
    ];
  }
  return [];
}

export function getLineSegmentsFromGridLines(
  sourcePoint: SidePoint,
  targetPoint: SidePoint,
  gridLines: GridLine[],
): {
  sourceLineSegment: LineSegment;
  lineSegments: LineSegment[];
  targetLineSegment: LineSegment;
  allLineSegments: LineSegment[];
} {
  const allGridLines = [
    ['top', 'bottom'].includes(sourcePoint.side)
      ? { x: sourcePoint.x }
      : { y: sourcePoint.y },
    ...gridLines,
    ['top', 'bottom'].includes(targetPoint.side)
      ? { x: targetPoint.x }
      : { y: targetPoint.y },
  ];

  const pointToLine = <T extends GridLine>(
    point: Point,
    line: T,
    nextLine: T extends XGridLine ? YGridLine : XGridLine,
  ): LineSegment => {
    const lineVertical = 'x' in line;

    return [
      point,
      lineVertical
        ? { x: line.x, y: (nextLine as YGridLine).y }
        : { x: (nextLine as XGridLine).x, y: line.y },
    ];
  };

  let currentPoint =
    'x' in allGridLines[0]
      ? { x: allGridLines[0].x, y: sourcePoint.y }
      : { x: sourcePoint.x, y: allGridLines[0].y };
  const segments: LineSegment[] = [];

  for (let i = 0; i < allGridLines.length; i++) {
    const line = allGridLines[i];
    const nextLine =
      allGridLines[i + 1] ??
      ('x' in line ? { y: targetPoint.y } : { x: targetPoint.x });
    const nextSegment = pointToLine(currentPoint, line, nextLine);
    segments.push(nextSegment);
    currentPoint = nextSegment[1];
  }

  return {
    sourceLineSegment: segments[0],
    lineSegments: segments.slice(1, -1),
    targetLineSegment: segments[segments.length - 1],
    allLineSegments: segments,
  };
}

export function getSvgPathFromSegments(
  segments: LineSegment[],
  sourcePoint: SidePoint,
  targetPoint: SidePoint,
  padding: number = 10,
): SvgPath {
  // @ts-ignore
  const path: SvgPath = [];

  segments.forEach((segment, i) => {
    if (!path.length) {
      path.push(['M', segment[0]]);
    }

    // if last segment
    if (i === segments.length - 1) {
      const preEndPoint = { ...segment[1] };
      switch (targetPoint.side) {
        case 'left':
          preEndPoint.x -= padding;
          break;
        case 'right':
          preEndPoint.x += padding;
          break;
        case 'top':
          preEndPoint.y -= padding;
          break;
        case 'bottom':
          preEndPoint.y += padding;
          break;
        default:
          break;
      }
      path.push(['L', preEndPoint]);
    } else {
      path.push(['L', segment[1]]);
    }
  });

  return path;
}

export function pathToD(path: SvgPath): string {
  return path
    .map(([cmd, ...points]) =>
      [
        cmd,
        ...points.map((point: Point | number) => {
          if (typeof point === 'number') {
            return point;
          }
          return `${point.x},${point.y}`;
        }),
      ].join(' '),
    )
    .join(' ');
}

export function bendPath(path: SvgPath, radius: number): SvgPath {
  const contiguousLinePaths: SvgPathPortion[] = [];
  const bentPath = [] as unknown as SvgPath;
  const current: SvgPathPortion = [];

  for (const svgPoint of path) {
    const [cmd] = svgPoint;
    if (!['L', 'H', 'V'].includes(cmd)) {
      if (current.length > 1) {
        contiguousLinePaths.push([...current]);
        current.length = 0;
      }
    }

    current.push(svgPoint);
  }
  if (current.length > 1) {
    contiguousLinePaths.push([...current]);
  }

  for (const linePath of contiguousLinePaths) {
    const points = linePath.map(([, point]) => point as Point); // TODO: fix
    const pointsWithMid = withMidpoints(simplifyPoints(points));

    const bentPathPortion: SvgPath = [linePath[0] as any /* TODO */];

    pointsWithMid.forEach((pt, i, pts) => {
      if (
        i >= 2 &&
        i <= pts.length - 2 &&
        isBendable(pts[i - 1], pt, pts[i + 1])
      ) {
        const { p1, p2, p } = roundOneCorner(
          pts[i - 1],
          pt,
          pts[i + 1],
          radius,
        );

        bentPathPortion.push(['L', p1], ['C', p1, p, p2]);
      } else if (i > 0) {
        bentPathPortion.push(['L', pt]);
      }
    });

    bentPath.push(...bentPathPortion);
  }

  return bentPath;
}

export function withMidpoints(points: Point[]): Point[] {
  const pointsWithMid: Point[] = [];

  points.forEach((pt, i) => {
    const [ptA, ptB, ptC] = [pt, points[i + 1], points[i + 2]];

    if (!ptC || !ptB) {
      pointsWithMid.push(ptA);
      return;
    }

    const midpt = {
      x: ptA.x + (ptB.x - ptA.x) / 2,
      y: ptA.y + (ptB.y - ptA.y) / 2,
    };

    pointsWithMid.push(ptA, midpt);
  });

  return pointsWithMid;
}

export function simplifyPoints(points: Point[]): Point[] {
  const pointHashes = new Set<string>();

  const result: Point[] = [];

  points.forEach((point, i) => {
    const prevPoint = points[i - 1];
    const nextPoint = points[i + 1];

    if (prevPoint?.x === point.x && point.x === nextPoint?.x) {
      return;
    }
    if (prevPoint?.y === point.y && point.y === nextPoint?.y) {
      return;
    }

    const hash = `${point.x}|${point.y}`;

    if (pointHashes.has(hash)) {
      return;
    }

    result.push(point);
  });

  return result;
}

const lineToVector = (p1: Point, p2: Point): Vector => {
  const vector = {
    type: 'vector' as const,
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };

  return vector;
};

const vectorToUnitVector = (v: Vector): Vector => {
  let magnitude = v.x * v.x + v.y * v.y;
  magnitude = Math.sqrt(magnitude);
  const unitVector = {
    type: 'vector' as const,
    x: v.x / magnitude,
    y: v.y / magnitude,
  };
  return unitVector;
};

export const roundOneCorner = (
  p1: Point,
  corner: Point,
  p2: Point,
  radius: number,
): CubicCurve => {
  const corner_to_p1 = lineToVector(corner, p1);
  const corner_to_p2 = lineToVector(corner, p2);
  const p1dist = Math.hypot(corner_to_p1.x, corner_to_p1.y);
  const p2dist = Math.hypot(corner_to_p2.x, corner_to_p2.y);
  if (p1dist * p2dist === 0) {
    return {
      p1: corner,
      p2: corner,
      p: corner,
    };
  }
  const resolvedRadius = Math.min(radius, p1dist - 0.1, p2dist - 0.1);
  const corner_to_p1_unit = vectorToUnitVector(corner_to_p1);
  const corner_to_p2_unit = vectorToUnitVector(corner_to_p2);

  const curve_p1 = {
    x: corner.x + corner_to_p1_unit.x * resolvedRadius,
    y: corner.y + corner_to_p1_unit.y * resolvedRadius,
  };
  const curve_p2 = {
    x: corner.x + corner_to_p2_unit.x * resolvedRadius,
    y: corner.y + corner_to_p2_unit.y * resolvedRadius,
  };
  const path = {
    p1: curve_p1,
    p2: curve_p2,
    p: corner,
  };

  return path;
};

export function isBendable(p1: Point, corner: Point, p2: Point): boolean {
  return !(
    (p1.x === corner.x && p2.x === corner.x) ||
    (p1.y === corner.y && p2.y === corner.y)
  );
}

// ......
