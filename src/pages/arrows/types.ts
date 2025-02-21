type Brand<T, Tag extends string> = T & { __tag: Tag };

export type SaveStatus = 'saving' | 'saved' | 'idle' | 'none';

export interface DeltaPosition {
  dx: number;
  dy: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Side = 'left' | 'right' | 'top' | 'bottom';

export interface Port {
  side: Side;
  /**
   * Relative position from side's top/left position
   */
  position: DeltaPosition;
}

export interface Vector {
  x: number;
  y: number;
}

export type SVGPoint = Brand<Point, 'SVGPoint'>;
export type ScreenPoint = Brand<Point, 'ScreenPoint'>;

/** displacement vector */
export type SVGVector = Brand<Vector, 'SVGVector'>;
/** displacement vector */
export type ScreenVector = Brand<Vector, 'ScreenVector'>;

export type ZoomValue = Brand<number, 'ZoomValue'>;
export type ZoomFactor = Brand<number, 'ZoomFactor'>;

export interface ViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export type LineSegment = [Point, Point];

export interface SidePoint extends Point {
  side: Side;
}

export interface RelativeSidePoint {
  /**
   * The rect side this point is on
   */
  side: Side;
  /**
   * How far from the top or left this point resides on the side
   * E.g., if side is "right" and pecent is 0.1, this point is
   * near the top-right corner on the right side
   */
  percent: number;
}

export type SideLineSegment = [SidePoint, SidePoint];

export type Path = Point[];

export type MPathParam = ['M', Point];
export type LPathParam = ['L', Point];
export type HPathParam = ['H', number];
export type VPathParam = ['V', number];
export type ZPathParam = ['Z'];
export type CPathParam = ['C', Point, Point, Point];
export type QPathParam = ['Q', Point, Point];
export type PathParam =
  | MPathParam
  | LPathParam
  | HPathParam
  | VPathParam
  | ZPathParam
  | CPathParam
  | QPathParam;

export type SvgPathPortion = PathParam[];
export type SvgPath = [MPathParam, ...SvgPathPortion];

export interface RectInit {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResultBox<T> {
  v: T;
}

export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

export type JSONSerializable<T extends object, U> = T & {
  toJSON: () => U;
};

export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type Point = {
  x: number;
  y: number;
};

export type XGridLine = { x: number };
export type YGridLine = { y: number };
export type GridLine = XGridLine | YGridLine;
// TODO: hope that this gets fixed in TS
// type GridLinesX = [XGridLine, ...GridLinesY]
// type GridLinesY = [YGridLine, ...GridLinesX]
export type GridLines = GridLine[];

export type GridLineSegment = {
  direction: SideDirection;
  segment: LineSegment;
};

export type OrthogonalPath = {
  sourceSide: Side;
  targetSide: Side;
  lines: GridLines;
};

/**
 * Source node side and target node side to draw a path
 */
export type SidePath = [Side, Side];

export type SideDirection = 'vertical' | 'horizontal';

export interface Ray {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface OrthogonalRay {
  x: number;
  y: number;
  dx: -1 | 0 | 1;
  dy: -1 | 0 | 1;
}

export interface CubicCurve {
  p1: Point;
  p2: Point;
  p: Point;
}
