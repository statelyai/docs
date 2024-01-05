import {
  LineSegment,
  RectInit,
  SidePoint,
  RelativeSidePoint,
  Side,
} from './types';

export interface Point {
  [key: string]: any;
  x: number;
  y: number;
}

export type PartialRect =
  | (({ left: number } | { right: number }) &
      ({ top: number } | { bottom: number }) & {
        width: number;
        height: number;
      })
  | { left: number; right: number; top: number; bottom: number };

/**
 * A box is represented by two corner points
 */
export type Box = [Point, Point];

export class Rect implements DOMRect {
  public top: number;
  public left: number;
  public bottom: number;
  public right: number;
  public width: number;
  public height: number;
  public x: number;
  public y: number;

  public toJSON() {
    const { top, left, bottom, right, width, height, x, y } = this;
    return { top, left, bottom, right, width, height, x, y };
  }

  constructor(box: Box);
  constructor(rect: RectInit | PartialRect);
  constructor(rect: Box | RectInit | PartialRect) {
    if (Array.isArray(rect)) {
      const minX = Math.min(rect[0].x, rect[1].x);
      const width = Math.max(rect[0].x, rect[1].x) - minX;
      const minY = Math.min(rect[0].y, rect[1].y);
      const height = Math.max(rect[0].y, rect[1].y) - minY;
      this.top = minY;
      this.left = minX;
      this.width = width;
      this.right = this.left + this.width;
      this.height = height;
      this.bottom = this.top + this.height;
      this.x = this.left;
      this.y = this.top;
    } else {
      this.top =
        'top' in rect
          ? rect.top
          : 'y' in rect
          ? rect.y
          : rect.bottom - rect.height;
      this.left =
        'left' in rect
          ? rect.left
          : 'x' in rect
          ? rect.x
          : rect.right - rect.width;
      this.bottom = 'bottom' in rect ? rect.bottom : this.top + rect.height;
      this.right = 'right' in rect ? rect.right : this.left + rect.width;
      this.width = this.right - this.left;
      this.height = this.bottom - this.top;
      this.x = this.left;
      this.y = this.top;
    }
  }

  public point(x: string, y: string, meta?: Record<string, any>): Point {
    const point: Point = { x: 0, y: 0, ...meta };

    switch (x) {
      case 'left':
        point.x = this.left;
        break;
      case 'right':
        point.x = this.right;
        break;

      case 'center':
        point.x = this.left + this.width / 2;
        break;
      default:
        break;
    }
    switch (y) {
      case 'top':
        point.y = this.top;
        break;
      case 'bottom':
        point.y = this.bottom;
        break;

      case 'center':
        point.y = this.top + this.height / 2;
        break;
      default:
        break;
    }

    return point;
  }

  public get center(): Point {
    return {
      x: this.left + this.width / 2,
      y: this.top + this.height / 2,
    };
  }

  public centerSide(side: Side, offset: number = 0): SidePoint {
    switch (side) {
      case 'left':
        return { side: 'left', x: this.left - offset, y: this.center.y };
      case 'right':
        return { side: 'right', x: this.right + offset, y: this.center.y };
      case 'top':
        return { side: 'top', x: this.center.x, y: this.top - offset };
      case 'bottom':
        return { side: 'bottom', x: this.center.x, y: this.bottom + offset };
    }
  }

  public relativeSide(side: Side, percent: number): SidePoint {
    switch (side) {
      case 'left':
      case 'right':
        return { side, x: this[side], y: this.y + this.height * percent };
      case 'top':
      case 'bottom':
        return { side, x: this.x + this.width * percent, y: this[side] };
    }
  }

  public getRelativeSidePoint(sidePoint: SidePoint): RelativeSidePoint {
    const { side } = sidePoint;
    switch (side) {
      case 'left':
      case 'right': {
        const percent =
          this.height === 0 ? 0.5 : (sidePoint.y - this.y) / this.height;
        return { side, percent };
      }
      case 'top':
      case 'bottom': {
        const percent =
          this.width === 0 ? 0.5 : (sidePoint.x - this.x) / this.width;

        return { side, percent };
      }
    }
  }

  public sideSegment(side: Side): LineSegment {
    switch (side) {
      case 'left':
        return [
          { x: this.left, y: this.top },
          { x: this.left, y: this.bottom },
        ];
      case 'right':
        return [
          { x: this.right, y: this.top },
          { x: this.right, y: this.bottom },
        ];
      case 'top':
        return [
          { x: this.left, y: this.top },
          { x: this.right, y: this.top },
        ];
      case 'bottom':
        return [
          { x: this.left, y: this.bottom },
          { x: this.right, y: this.bottom },
        ];
      default:
        throw new Error('Invalid side');
    }
  }

  public equals(otherRect: DOMRect): boolean {
    return [
      'top' as const,
      'left' as const,
      'bottom' as const,
      'right' as const,
    ].every((prop) => {
      return otherRect[prop] === this[prop];
    });
  }

  public translate(dx: number, dy: number): Rect {
    return new Rect({
      left: this.left + dx,
      top: this.top + dy,
      width: this.width,
      height: this.height,
    });
  }

  public moveTo(point: Point): Rect {
    return new Rect({
      left: point.x,
      top: point.y,
      width: this.width,
      height: this.height,
    });
  }

  public withPadding(horizontal: number, vertical: number = horizontal): Rect {
    return new Rect({
      left: this.left - horizontal,
      right: this.right + horizontal,
      top: this.top - vertical,
      bottom: this.bottom + vertical,
    });
  }

  public getBox(): Box {
    return [
      { x: this.left, y: this.top },
      { x: this.right, y: this.bottom },
    ];
  }
}

export function fromPoint(point: Point, width: number, height: number): Rect {
  return new Rect({
    left: point.x,
    top: point.y,
    width,
    height,
    bottom: point.y + height,
    right: point.x + width,
  });
}

export function rectFrom(domRect: DOMRect): Rect {
  return new Rect(domRect);
}

export function relative(childRect: Rect, parentRect?: Rect): Rect {
  if (!parentRect) {
    return childRect;
  }

  return new Rect({
    top: childRect.top - parentRect.top,
    right: childRect.right - parentRect.left,
    bottom: childRect.bottom - parentRect.top,
    left: childRect.left - parentRect.left,
    width: childRect.width,
    height: childRect.height,
  });
}

export function pointOnSide(
  rect: Rect,
  side: Side,
  percent: number,
): SidePoint {
  let segment: LineSegment;
  let xFactor = 0,
    yFactor = 0;

  switch (side) {
    case 'left':
      segment = [
        { x: rect.left, y: rect.top },
        { x: rect.left, y: rect.bottom },
      ];
      yFactor = percent;
      break;
    case 'right':
      segment = [
        { x: rect.right, y: rect.top },
        { x: rect.right, y: rect.bottom },
      ];
      yFactor = percent;
      break;
    case 'top':
      segment = [
        { x: rect.left, y: rect.top },
        { x: rect.right, y: rect.top },
      ];
      xFactor = percent;
      break;
    case 'bottom':
      segment = [
        { x: rect.left, y: rect.bottom },
        { x: rect.right, y: rect.bottom },
      ];
      xFactor = percent;
      break;
    default:
      throw new Error(`Invalid side: ${side}`);
  }

  return {
    x: (segment[1].x - segment[0].x) * xFactor + segment[0].x,
    y: (segment[1].y - segment[0].y) * yFactor + segment[0].y,
    side,
  };
}
