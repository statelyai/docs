'use client';
// Hub-and-spoke graph with a small hand-rolled force simulation. The hub is
// fixed at the center; spokes spring toward home slots on a ring around it,
// repel each other, collide as boxes, and can be dragged. The layout settles once on mount
// (synchronously, no animation) and only animates while settling after a drag.
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type HubRamp = 'blue' | 'green' | 'purple' | 'orange';
export type HubNode = { id: string; title: string; meta?: string; mono?: boolean; ramp: HubRamp; icon: ReactNode };

type Body = { x: number; y: number; vx: number; vy: number; w: number; h: number; hx: number; hy: number; pinned: boolean };
type Geo = { W: number; H: number; hw: number; hh: number; pad: number };

/**
 * `count` slots on the superellipse |x/rx|^p + |y/ry|^p = 1, clockwise from
 * the top, shifted by `phase` slots. Arc length is weighted by how much room
 * a node box takes along the curve there (its width where the curve runs
 * sideways, its height where it runs up and down), so top and bottom get
 * fewer, wider-spaced slots.
 */
function ring(count: number, rx: number, ry: number, p: number, nodeW: number, nodeH: number, phase: number): [number, number][] {
  const S = 720;
  const pts: [number, number][] = [];
  for (let k = 0; k <= S; k++) {
    const t = (k / S) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pts.push([rx * Math.sign(c) * Math.abs(c) ** (2 / p), ry * Math.sign(s) * Math.abs(s) ** (2 / p)]);
  }
  const acc = [0];
  for (let k = 1; k <= S; k++) {
    const dx = pts[k][0] - pts[k - 1][0];
    const dy = pts[k][1] - pts[k - 1][1];
    const len = Math.hypot(dx, dy);
    acc.push(acc[k - 1] + (len ? (len * len) / (Math.abs(dx) * nodeW + Math.abs(dy) * nodeH) : 0));
  }
  return Array.from({ length: count }, (_, i) => {
    const want = ((i + phase) / count) * acc[S];
    let k = 0;
    while (k < S && acc[k] < want) k++;
    return pts[k];
  });
}

/** Home slots on one ring that fills the box. */
function homes(n: number, W: number, H: number, nodeW: number, nodeH: number, wide: boolean): [number, number][] {
  const rx = Math.max(0, W / 2 - nodeW / 2 - 4);
  const ry = Math.max(0, H / 2 - nodeH / 2 - 4);
  // Narrow: start with a slot at top center so the corner pairs fan out.
  return ring(n, rx, ry, wide ? 2.4 : 2, nodeW + 12, nodeH + 12, wide ? 0.5 : 0);
}

// Server render and first paint: percent positions for a wide box.
const ssrHomes = (n: number) => homes(n, 100, 100, 14, 8, true);

function tick(bodies: Body[], g: Geo, alpha: number) {
  const n = bodies.length;
  // Spring toward each node's home slot on the ring.
  for (const b of bodies) {
    if (b.pinned) continue;
    b.vx += (b.hx - b.x) * 0.06 * alpha;
    b.vy += (b.hy - b.y) * 0.06 * alpha;
  }
  // Many-body repulsion between spokes, plus the fixed hub at the origin.
  const charge = Math.min(g.W, 900) * 0.8;
  for (let i = 0; i < n; i++) {
    const a = bodies[i];
    for (let j = i + 1; j < n; j++) {
      const b = bodies[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = Math.max(dx * dx + dy * dy, 900);
      const f = (charge * alpha) / d2;
      if (!a.pinned) (a.vx += dx * f), (a.vy += dy * f);
      if (!b.pinned) (b.vx -= dx * f), (b.vy -= dy * f);
    }
  }
  for (const b of bodies) {
    if (b.pinned) continue;
    b.vx *= 0.6;
    b.vy *= 0.6;
    b.x += b.vx;
    b.y += b.vy;
  }
  // Collision: separate overlapping boxes along the shallower axis.
  const hub = { x: 0, y: 0, w: g.hw * 2, h: g.hh * 2, pinned: true };
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j <= n; j++) {
        const a = bodies[i];
        const b = j === n ? hub : bodies[j];
        const dx = b.x - a.x || 0.01;
        const dy = b.y - a.y || 0.01;
        // Keep room for a visible edge between a spoke and the hub.
        const pad = b === hub ? g.pad + 24 : g.pad;
        const ox = (a.w + b.w) / 2 + pad - Math.abs(dx);
        const oy = (a.h + b.h) / 2 + pad - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        const wa = a.pinned ? 0 : b.pinned ? 1 : 0.5;
        const wb = b.pinned ? 0 : a.pinned ? 1 : 0.5;
        // Shallower axis first. A box shoved by something fixed (the hub, a dragged
        // node) into a wall takes the other axis instead of getting stuck.
        let sx = Math.sign(dx) * ox;
        let sy = Math.sign(dy) * oy;
        let alongX = ox < oy;
        if (a.pinned || b.pinned) {
          const [q, d] = a.pinned ? [b, 1] : [a, -1];
          const hitX = Math.abs(q.x + d * sx) > g.W / 2 - q.w / 2;
          const hitY = Math.abs(q.y + d * sy) > g.H / 2 - q.h / 2;
          if (hitX && hitY) {
            // Cornered: slide out past the fixed box, a few px per tick.
            if (alongX) sx = -Math.sign(dx) * 4;
            else sy = -Math.sign(dy) * 4;
          } else if (alongX ? hitX : hitY) alongX = !alongX;
        }
        if (alongX) {
          a.x -= sx * wa;
          b.x += sx * wb;
        } else {
          a.y -= sy * wa;
          b.y += sy * wb;
        }
      }
    }
  }
  for (const b of bodies) clampTo(b, g);
}

function clampTo(b: Body, g: Geo) {
  const mx = Math.max(0, g.W / 2 - b.w / 2);
  const my = Math.max(0, g.H / 2 - b.h / 2);
  b.x = Math.min(mx, Math.max(-mx, b.x));
  b.y = Math.min(my, Math.max(-my, b.y));
}

/** Point where the ray from a box's center toward (dx, dy) leaves the box. */
function exit(cx: number, cy: number, hw: number, hh: number, dx: number, dy: number): [number, number] {
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return [cx + dx * t, cy + dy * t];
}

const ARROW_GAP = 10; // path ends 10px off each border; the 10px marker tip lands 5px off

function NodeBox({ node, hub = false }: { node: HubNode; hub?: boolean }) {
  return (
    <div
      className={`grid w-max items-center whitespace-nowrap rounded-[6px] ${
        hub
          ? 'border-2 grid-cols-[24px_auto] gap-x-2 px-3 py-2 sm:grid-cols-[36px_auto] sm:gap-x-3 sm:p-3'
          : 'border grid-cols-[18px_auto] gap-x-1.5 px-2 py-1.5 sm:grid-cols-[28px_auto] sm:gap-x-2 sm:p-2.5'
      }`}
      style={{
        background: `var(--sp-arch-${node.ramp})`,
        borderColor: `var(--sp-ramp-${node.ramp}-border)`,
        color: `var(--sp-ramp-${node.ramp}-title)`,
      }}
    >
      <span className={`block ${hub ? 'size-6 sm:size-9' : 'size-[18px] sm:size-7'}`}>{node.icon}</span>
      <span className="block">
        <span className={`block font-semibold tracking-[-0.01em] ${hub ? 'text-[14px] leading-[18px] sm:text-[16px] sm:leading-5' : 'text-[12px] leading-4 sm:text-[14px] sm:leading-[18px]'}`}>
          {node.title}
        </span>
        {node.meta && (
          <span className={`block text-[11px] leading-4 opacity-80 max-sm:hidden ${node.mono ? 'sp-mono' : ''}`}>{node.meta}</span>
        )}
      </span>
    </div>
  );
}

export function HubGraph({ hub, spokes, className = '' }: { hub: HubNode; spokes: HubNode[]; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const hubEl = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const geo = useRef<Geo | null>(null);
  const sim = useRef({ alpha: 0, target: 0, raf: 0 });
  const drag = useRef<{ i: number; off: [number, number] } | null>(null);
  const [, setFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const n = spokes.length;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const layout = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) return;
      const sizes = els.current.map((e) => [e?.offsetWidth ?? 0, e?.offsetHeight ?? 0] as const);
      const maxW = Math.max(...sizes.map((s) => s[0]));
      const maxH = Math.max(...sizes.map((s) => s[1]));
      const wide = W >= 640;
      const prev = geo.current;
      const g: Geo = {
        W,
        H,
        hw: (hubEl.current?.offsetWidth ?? 0) / 2,
        hh: (hubEl.current?.offsetHeight ?? 0) / 2,
        pad: wide ? 14 : 6,
      };
      geo.current = g;
      if (!prev || prev.W !== W || prev.H !== H) {
        bodies.current = homes(n, W, H, maxW, maxH, wide).map(([hx, hy]) => ({ x: hx, y: hy, vx: 0, vy: 0, w: 0, h: 0, hx, hy, pinned: false }));
      }
      bodies.current.forEach((b, i) => {
        b.w = sizes[i][0];
        b.h = sizes[i][1];
      });
      // Settle once, off screen time: no motion on load.
      if (!drag.current) {
        for (let k = 0, a = 1; k < 300; k++, a *= 0.98) tick(bodies.current, g, a);
        for (const b of bodies.current) (b.vx = 0), (b.vy = 0);
      }
      setReady(true);
      setFrame((f) => f + 1);
    };
    const ro = new ResizeObserver(() => requestAnimationFrame(layout));
    ro.observe(el);
    for (const e of els.current) if (e) ro.observe(e);
    if (hubEl.current) ro.observe(hubEl.current);
    layout();
    const s = sim.current;
    return () => {
      ro.disconnect();
      cancelAnimationFrame(s.raf);
    };
    // spokes are static props from the server component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const run = () => {
    const s = sim.current;
    if (s.raf) return;
    const step = () => {
      const g = geo.current;
      if (!g) return void (s.raf = 0);
      s.alpha += (s.target - s.alpha) * 0.03;
      tick(bodies.current, g, s.alpha);
      setFrame((f) => f + 1);
      if (s.alpha < 0.003 && !s.target) {
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  };

  const local = (e: React.PointerEvent): [number, number] => {
    const r = box.current!.getBoundingClientRect();
    return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2];
  };

  const g = geo.current;
  const placed = ready && g;
  const pos = (i: number): React.CSSProperties => {
    if (placed) {
      const b = bodies.current[i];
      return { left: g.W / 2 + b.x, top: g.H / 2 + b.y };
    }
    const [x, y] = ssrHomes(n)[i];
    return { left: `${50 + x}%`, top: `${50 + y}%` };
  };

  return (
    <div ref={box} aria-hidden className={`relative w-full select-none ${className}`}>
      <svg className="absolute inset-0 overflow-visible" width="100%" height="100%">
        <defs>
          <marker id="hub-arrow" viewBox="0 0 10 10" markerWidth="5" markerHeight="5" markerUnits="strokeWidth" refX="5" refY="5" orient="auto-start-reverse">
            <path d="M0,0 L0,10 L10,5 z" fill="var(--sp-edge)" />
          </marker>
        </defs>
        {spokes.map((s, i) => {
          if (!placed) {
            const p = pos(i);
            return <line key={s.id} x1="50%" y1="50%" x2={p.left} y2={p.top} stroke="var(--sp-edge)" strokeWidth={2} />;
          }
          const b = bodies.current[i];
          const len = Math.hypot(b.x, b.y);
          if (!len) return null;
          const ux = b.x / len;
          const uy = b.y / len;
          const [ax, ay] = exit(0, 0, g.hw, g.hh, ux, uy);
          const [bx, by] = exit(b.x, b.y, b.w / 2, b.h / 2, -ux, -uy);
          const span = (bx - ax) * ux + (by - ay) * uy;
          if (span < ARROW_GAP * 2 + 6) return null;
          const cx = g.W / 2;
          const cy = g.H / 2;
          const d = `M${cx + ax + ux * ARROW_GAP},${cy + ay + uy * ARROW_GAP} L${cx + bx - ux * ARROW_GAP},${cy + by - uy * ARROW_GAP}`;
          return (
            <g key={s.id}>
              <path d={d} fill="none" stroke="var(--sp-edge-halo)" strokeWidth={6} />
              <path d={d} fill="none" stroke="var(--sp-edge)" strokeWidth={2} markerStart="url(#hub-arrow)" markerEnd="url(#hub-arrow)" />
            </g>
          );
        })}
      </svg>
      <div ref={hubEl} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <NodeBox node={hub} hub />
      </div>
      {spokes.map((s, i) => (
        <div
          key={s.id}
          ref={(e) => {
            els.current[i] = e;
          }}
          data-hub-spoke={s.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab active:cursor-grabbing ${drag.current?.i === i ? 'z-10' : ''}`}
          style={pos(i)}
          onPointerDown={(e) => {
            if (e.button !== 0 || !placed) return;
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);
            const b = bodies.current[i];
            const [px, py] = local(e);
            b.pinned = true;
            drag.current = { i, off: [px - b.x, py - b.y] };
            sim.current.target = 0.3;
            sim.current.alpha = Math.max(sim.current.alpha, 0.3);
            run();
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || d.i !== i || !g) return;
            const b = bodies.current[i];
            const [px, py] = local(e);
            b.x = px - d.off[0];
            b.y = py - d.off[1];
            b.vx = b.vy = 0;
            clampTo(b, g);
          }}
          onPointerUp={() => {
            if (drag.current?.i !== i) return;
            bodies.current[i].pinned = false;
            drag.current = null;
            sim.current.target = 0;
          }}
          onPointerCancel={() => {
            if (drag.current?.i !== i) return;
            bodies.current[i].pinned = false;
            drag.current = null;
            sim.current.target = 0;
          }}
        >
          <NodeBox node={s} />
        </div>
      ))}
    </div>
  );
}
