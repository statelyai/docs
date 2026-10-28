// Pure geometry for EdgeLayer: orthogonal elbow routes between two boxes,
// optionally through a label waypoint. Units are CSS px in container space.
//
// Sanity checks (a, b are boxes; label 80x40; stub 10):
// 1. a {0,0,100,50}, b {200,0,100,50}, no waypoint
//    → right/left, straight [[100,25],[200,25]] (spans overlap), label [145,25]
//      (centered on the visible line, which stops 10px short for the arrow).
// 2. a {0,0,100,50}, b {200,100,100,50} → right/left Z
//    [[100,25],[145,25],[145,125],[200,125]], label on the middle [145,75].
// 3. a {0,0,100,50}, b {0,200,100,50} → bottom/top [[50,50],[50,200]], label [50,120].
// 4. Case 1, waypoint [150,30] → both anchors slide to y=30; still straight.
// 5. a {0,0,100,50}, b {300,200,100,50}, right→top → L
//    [[100,25],[350,25],[350,200]], label on the roomier segment.
// 6. a {0,0,100,50}, b {300,100,100,50}, waypoint [180,29] → snaps to y=25
//    (within 8px of the source anchor): [[100,25],[280,25],[280,125],[300,125]].
// 7. Case 1, waypoint [150,-80] (auto sides) → top→top U through y=-80.
// 8. Never more than 3 bends, never through either box; a waypoint no such
//    route reaches is projected onto the nearest one (the label slides).
// 9. Corner labels: a waypoint at a bend attaches the label to that corner,
//    so the edge enters one side of the pill and leaves an adjacent side
//    (in from the left, out of the bottom). a {0,0,80,16}, b {0,240,790,60},
//    waypoint [270,150] → [[40,16],[40,150],[270,150],[270,240]], label at
//    the bend [270,150] instead of a detour around the target.
// 10. The label always leaves a visible run before the arrow: at least TAIL
//    px of line, then the 10px arrow, so the arrowhead never sits on the pill.

export type Pt = [number, number];
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type SideOpt = Side | 'auto';
export type Box = { x: number; y: number; w: number; h: number };
export type RouteOpts = {
  fromSide?: SideOpt;
  toSide?: SideOpt;
  /** label pill [w, h]; keeps the label on a segment it fits */
  label?: [number, number];
};
/** `seg`: segment index the label sits on; with `corner`, the label is at that segment's end bend. */
export type Route = { points: Pt[]; label: Pt; seg: number; corner: boolean };

const STUB = 10; // straight run out of the source
const ARROW = 10; // path ends this far before the target border (tip 5px off)
const TAIL = 14; // visible line between a label and the arrow
const R = 10; // corner radius
const SNAP = 8;
const INSET = 12; // anchors stay this far from box corners

const OUT: Record<Side, Pt> = { top: [0, -1], right: [1, 0], bottom: [0, 1], left: [-1, 0] };
const OPP: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const SIDES: Side[] = ['top', 'right', 'bottom', 'left'];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const eq = (a: number, b: number) => Math.abs(a - b) < 0.5;
const dirOf = (a: Pt, b: Pt): Pt => [eq(a[0], b[0]) ? 0 : Math.sign(b[0] - a[0]), eq(a[1], b[1]) ? 0 : Math.sign(b[1] - a[1])];
const len = (a: Pt, b: Pt) => Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
const add = (p: Pt, d: Pt, t: number): Pt => [p[0] + d[0] * t, p[1] + d[1] * t];
/** Half the label extent along direction d. */
const half = (size: [number, number], d: Pt) => (d[0] ? size[0] : size[1]) / 2;

export function autoSides(a: Box, b: Box): [Side, Side] {
  const gx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w));
  const gy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h));
  const dx = b.x + b.w / 2 - (a.x + a.w / 2);
  const dy = b.y + b.h / 2 - (a.y + a.h / 2);
  const horiz = gx > gy || (eq(gx, gy) && Math.abs(dx) >= Math.abs(dy));
  if (horiz) return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
  return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

function sideMid(b: Box, s: Side): Pt {
  if (s === 'top') return [b.x + b.w / 2, b.y];
  if (s === 'bottom') return [b.x + b.w / 2, b.y + b.h];
  if (s === 'left') return [b.x, b.y + b.h / 2];
  return [b.x + b.w, b.y + b.h / 2];
}

/**
 * Anchor pairs to try. Side centers; facing sides whose spans overlap share
 * one straight line (slid toward w). With a waypoint, each anchor may also
 * slide along its own side toward it, so a corner label can sit anywhere
 * over the target rather than only over the shared span.
 */
function anchorPairs(a: Box, b: Box, fs: Side, ts: Side, w: Pt | null): [Pt, Pt][] {
  const s = sideMid(a, fs);
  const t = sideMid(b, ts);
  if (OPP[fs] !== ts) return [[s, t]];
  const k = fs === 'top' || fs === 'bottom' ? 0 : 1;
  const span = (x: Box): [number, number] => [(k ? x.y : x.x) + INSET, (k ? x.y + x.h : x.x + x.w) - INSET];
  const [alo, ahi] = span(a);
  const [blo, bhi] = span(b);
  const lo = Math.max(alo, blo);
  const hi = Math.min(ahi, bhi);
  const out: [Pt, Pt][] = [];
  if (hi >= lo) {
    const v = w ? clamp(w[k], lo, hi) : (lo + hi) / 2;
    const s1: Pt = [s[0], s[1]], t1: Pt = [t[0], t[1]];
    s1[k] = t1[k] = v;
    out.push([s1, t1]);
  }
  if (w || !out.length) {
    const s2: Pt = [s[0], s[1]], t2: Pt = [t[0], t[1]];
    if (w && ahi >= alo) s2[k] = clamp(w[k], alo, ahi);
    if (w && bhi >= blo) t2[k] = clamp(w[k], blo, bhi);
    if (!out.length || s2[k] !== out[0][0][k] || t2[k] !== out[0][1][k]) out.push([s2, t2]);
  }
  return out;
}

/** Drop duplicate points and merge same-direction collinear runs (reversals are kept, then rejected). */
function simplify(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (q && eq(q[0], p[0]) && eq(q[1], p[1])) continue;
    if (out.length >= 2) {
      const d1 = dirOf(out[out.length - 2], q);
      const d2 = dirOf(q, p);
      if (d1[0] === d2[0] && d1[1] === d2[1]) {
        out[out.length - 1] = p;
        continue;
      }
    }
    out.push(p);
  }
  return out;
}

const inside = (b: Box, p: Pt, q: Pt) => {
  // axis-aligned segment vs box interior (shrunk 1px)
  const x0 = Math.min(p[0], q[0]), x1 = Math.max(p[0], q[0]);
  const y0 = Math.min(p[1], q[1]), y1 = Math.max(p[1], q[1]);
  return x1 > b.x + 1 && x0 < b.x + b.w - 1 && y1 > b.y + 1 && y0 < b.y + b.h - 1;
};

function valid(pts: Pt[], fs: Side, ts: Side, a: Box, b: Box) {
  if (pts.length < 2 || pts.length - 2 > 3) return false;
  const n = pts.length - 1;
  for (let i = 0; i < n; i++) {
    const d = dirOf(pts[i], pts[i + 1]);
    if (d[0] !== 0 && d[1] !== 0) return false;
    if (i > 0) {
      const p = dirOf(pts[i - 1], pts[i]);
      if (p[0] === -d[0] && p[1] === -d[1]) return false;
    }
    if (inside(a, pts[i], pts[i + 1]) || inside(b, pts[i], pts[i + 1])) return false;
  }
  const d0 = dirOf(pts[0], pts[1]);
  const dn = dirOf(pts[n - 1], pts[n]);
  const out = OUT[fs];
  const into = OUT[ts];
  return d0[0] === out[0] && d0[1] === out[1] && dn[0] === -into[0] && dn[1] === -into[1] && len(pts[n - 1], pts[n]) >= STUB + ARROW;
}

/** Usable label-center range on segment i (stub, corners, tail and arrow excluded). */
function range(pts: Pt[], i: number, ext: number): [number, number] {
  const L = len(pts[i], pts[i + 1]);
  const lo = (i === 0 ? STUB : R) + ext / 2;
  const hi = L - (i === pts.length - 2 ? ARROW + TAIL : R) - ext / 2;
  return [lo, hi];
}

type Placement = { pt: Pt; seg: number; d: number; fits: boolean; key: number; corner: boolean };

function place(pts: Pt[], w: Pt | null, size: [number, number]): Placement {
  let best: Placement = { pt: pts[0], seg: 0, d: Infinity, fits: false, key: -Infinity, corner: false };
  const n = pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[i + 1];
    const d = dirOf(a, b);
    const ext = d[0] ? size[0] : size[1];
    const [lo, hi] = range(pts, i, ext);
    const fits = hi >= lo;
    let t: number;
    if (w) {
      const along = d[0] ? (w[0] - a[0]) * d[0] : (w[1] - a[1]) * d[1];
      t = fits ? clamp(along, lo, hi) : len(a, b) / 2;
    } else t = fits ? (lo + hi) / 2 : len(a, b) / 2;
    const pt = add(a, d, t);
    const dist = w ? Math.hypot(w[0] - pt[0], w[1] - pt[1]) : 0;
    // Default: fitting middle segment with the most room. Waypoint: nearest.
    const middle = n < 3 || (i > 0 && i < n - 1);
    const key = w ? -dist - (fits ? 0 : 1000) : (fits ? 1e6 : 0) + (middle ? 1e5 : 0) + (hi - lo);
    if (key > best.key) best = { pt, seg: i, d: dist, fits, key, corner: false };
  }
  // Dragged onto a bend: the label takes the corner (in one side, out an
  // adjacent side) when both runs beside it have room for half the pill.
  if (w)
    for (let i = 1; i < n; i++) {
      const c = pts[i];
      const din = dirOf(pts[i - 1], c);
      const dout = dirOf(c, pts[i + 1]);
      // The pill may sit right against the neighbouring bend; it only needs
      // the stub, or the tail and arrow, kept clear.
      const needIn = (i === 1 ? STUB : 0) + half(size, din);
      const needOut = (i === n - 1 ? ARROW + TAIL : 0) + half(size, dout);
      const fits = len(pts[i - 1], c) >= needIn && len(c, pts[i + 1]) >= needOut;
      const dist = Math.hypot(w[0] - c[0], w[1] - c[1]);
      const key = -dist - (fits ? 0 : 1000) - 2; // a straight placement wins exact ties
      if (key > best.key) best = { pt: c, seg: i - 1, d: dist, fits, key, corner: true };
    }
  return best;
}

/**
 * Orthogonal route from box a to box b (≤3 bends), through waypoint w when
 * given. Points start on a's border and end on b's border; split and shorten
 * with `splitAtLabel`.
 */
export function routeElbow(a: Box, b: Box, w: Pt | null, opts: RouteOpts = {}): Route {
  const size = opts.label ?? [0, 0];
  const [af, at] = autoSides(a, b);
  const fixedF = opts.fromSide && opts.fromSide !== 'auto' ? opts.fromSide : null;
  const fixedT = opts.toSide && opts.toSide !== 'auto' ? opts.toSide : null;
  const pf = fixedF ?? af;
  const pt = fixedT ?? at;
  // Without a waypoint keep the preferred sides; dragging may switch auto sides.
  const fromSides = w && !fixedF ? SIDES : [pf];
  const toSides = w && !fixedT ? SIDES : [pt];
  let best: (Route & { score: number }) | null = null;
  for (const fs of fromSides)
    for (const ts of toSides)
     for (const [s0, t0] of anchorPairs(a, b, fs, ts, w)) {
      const ww: Pt | null = w ? [w[0], w[1]] : null;
      if (ww) for (const p of [s0, t0]) for (const k of [0, 1]) if (Math.abs(ww[k] - p[k]) < SNAP) ww[k] = p[k];
      const s1 = add(s0, OUT[fs], STUB);
      const t1 = add(t0, OUT[ts], STUB + ARROW);
      const m: Pt = ww ?? [(s1[0] + t1[0]) / 2, (s1[1] + t1[1]) / 2];
      const cands: Pt[][] = [
        [s0, s1, [m[0], s1[1]], [m[0], t1[1]], t1, t0],
        [s0, s1, [s1[0], m[1]], [t1[0], m[1]], t1, t0],
        [s0, s1, [t1[0], s1[1]], t1, t0],
        [s0, s1, [s1[0], t1[1]], t1, t0],
      ];
      // Routes that bend at the waypoint itself, for corner labels.
      if (ww) cands.push([s0, s1, [m[0], s1[1]], m, [t1[0], m[1]], t1, t0], [s0, s1, [s1[0], m[1]], m, [m[0], t1[1]], t1, t0]);
      for (const c of cands) {
        const pts = simplify(c);
        if (!valid(pts, fs, ts, a, b)) continue;
        const p = place(pts, ww, size);
        const total = pts.slice(1).reduce((acc, q, i) => acc + len(pts[i], q), 0);
        const sideCost = fs === pf && ts === pt ? 0 : 45;
        const score = (pts.length - 2) * 40 + (w ? p.d * 4 : 0) + (p.fits ? 0 : 150) + total * 0.01 + sideCost;
        if (!best || score < best.score) best = { points: pts, label: p.pt, seg: p.seg, corner: p.corner, score };
      }
    }
  if (best) return { points: best.points, label: best.label, seg: best.seg, corner: best.corner };
  // Fallback: straight between preferred anchors.
  const [s0, t0] = anchorPairs(a, b, pf, pt, null)[0];
  return { points: [s0, t0], label: [(s0[0] + t0[0]) / 2, (s0[1] + t0[1]) / 2], seg: 0, corner: false };
}

/**
 * Split a route at its label pill (no line under it). The target half ends
 * 10px before the border; with `both`, the source half starts 10px out too.
 */
export function splitAtLabel(r: Route, size: [number, number] | null, both = false): Pt[][] {
  const pts = r.points.map((p) => [p[0], p[1]] as Pt);
  const shorten = (p: Pt, q: Pt) => add(q, dirOf(q, p), ARROW);
  const n = pts.length;
  if (both) pts[0] = shorten(pts[1], pts[0]);
  if (!size) {
    pts[n - 1] = shorten(pts[n - 2], pts[n - 1]);
    return [pts];
  }
  let src: Pt[];
  let dst: Pt[];
  if (r.corner) {
    const c = pts[r.seg + 1];
    const din = dirOf(pts[r.seg], c);
    const dout = dirOf(c, pts[r.seg + 2]);
    src = [...pts.slice(0, r.seg + 1), add(c, din, -half(size, din))];
    dst = [add(c, dout, half(size, dout)), ...pts.slice(r.seg + 2)];
  } else {
    const d = dirOf(pts[r.seg], pts[r.seg + 1]);
    src = [...pts.slice(0, r.seg + 1), add(r.label, d, -half(size, d))];
    dst = [add(r.label, d, half(size, d)), ...pts.slice(r.seg + 1)];
  }
  const last = dst.length - 1;
  const dir = dirOf(pts[n - 2], pts[n - 1]);
  dst[last] = shorten(dst[last - 1], dst[last]);
  // A label that overflows its segment must not leave the arrow pointing
  // backwards: keep a short forward run into the arrowhead.
  const run = (dst[last][0] - dst[last - 1][0]) * dir[0] + (dst[last][1] - dst[last - 1][1]) * dir[1];
  if (run < 4) dst[last - 1] = add(dst[last], dir, -4);
  return [src, dst];
}

/** Orthogonal path with rounded corners drawn as `L p0 C p0 corner p1`. */
export function pathD(points: Pt[], r = R) {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const c = points[i];
    const p = points[i - 1];
    const q = points[i + 1];
    const rr = Math.min(r, Math.hypot(c[0] - p[0], c[1] - p[1]) / 2, Math.hypot(q[0] - c[0], q[1] - c[1]) / 2);
    const u = unit(p, c);
    const v = unit(c, q);
    const p0 = add(c, u, -rr);
    const p1 = add(c, v, rr);
    d += ` L ${p0[0]} ${p0[1]} C ${p0[0]} ${p0[1]} ${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
}

function unit(a: Pt, b: Pt): Pt {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
}
