'use client';
// Editor-style connectors between real DOM boxes. Place <EdgeLayer> inside a
// `position: relative` container that also holds the connected elements,
// marked with `data-edge-id`. Labels can be dragged (or nudged with arrow
// keys) and the edge re-routes through them. Nothing persists.
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { pathD, routeElbow, splitAtLabel, type Box, type Pt, type Route, type SideOpt } from './router';

export type EdgeSpec = {
  id: string;
  /** a `data-edge-id` value, or a CSS selector starting with `.`, `#`, or `[` */
  from: string;
  to: string;
  label?: string;
  fromSide?: SideOpt;
  toSide?: SideOpt;
  guard?: string;
  tone?: 'default' | 'added' | 'removed';
  /** arrowheads at both ends */
  bidirectional?: boolean;
  /** dashed stroke, like the editor's architecture `sends` relationship */
  dashed?: boolean;
  /** `text`: the architecture view's bare 12px label instead of the event pill */
  labelStyle?: 'pill' | 'text';
};

const STROKE = { default: 'var(--sp-edge)', added: 'var(--sp-success)', removed: 'var(--sp-destructive)' } as const;
const NUDGE = 8;
const keys: Record<string, Pt> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };

const selector = (k: string) => (/^[.#[]/.test(k) ? k : `[data-edge-id="${CSS.escape(k)}"]`);
const estimate = (e: EdgeSpec): [number, number] =>
  e.labelStyle === 'text' ? [Math.round((e.label ?? '').length * 7) + 16, 24] : [Math.round((e.label ?? '').length * 9.4) + 28, e.guard ? 64 : 40];

type Geo = { boxes: Record<string, Box | null>; pills: Record<string, [number, number]> };

export function EdgeLayer({
  edges,
  className = '',
  decorative = false,
}: {
  edges: EdgeSpec[];
  className?: string;
  /** labels stay draggable with a pointer but leave the tab order and the accessibility tree */
  decorative?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const root = useRef<HTMLDivElement>(null);
  const pills = useRef<Record<string, HTMLDivElement | null>>({});
  const [mounted, setMounted] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [way, setWay] = useState<Record<string, Pt>>({});
  const [dragging, setDragging] = useState<{ id: string; off: Pt; moved: boolean } | null>(null);
  // Stable dependency for inline `edges` arrays.
  const spec = JSON.stringify(edges);

  useEffect(() => {
    setMounted(true);
    const el = root.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const list: EdgeSpec[] = JSON.parse(spec);
    const targets = () => {
      const out: Record<string, Element | null> = {};
      for (const e of list) for (const k of [e.from, e.to]) out[k] ??= box.querySelector(selector(k));
      return out;
    };
    const measure = () => {
      if (!el.offsetParent) return; // layer hidden at this breakpoint
      const c = box.getBoundingClientRect();
      const ox = c.left + box.clientLeft;
      const oy = c.top + box.clientTop;
      const boxes: Geo['boxes'] = {};
      for (const [k, t] of Object.entries(targets())) {
        const r = t?.getBoundingClientRect();
        boxes[k] = r && r.width && r.height ? { x: r.left - ox, y: r.top - oy, w: r.width, h: r.height } : null;
      }
      const sizes: Geo['pills'] = {};
      for (const e of list) {
        const p = pills.current[e.id];
        sizes[e.id] = p && p.offsetWidth ? [p.offsetWidth, p.offsetHeight] : estimate(e);
      }
      setGeo({ boxes, pills: sizes });
    };
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    ro.observe(box);
    for (const t of Object.values(targets())) if (t) ro.observe(t);
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [spec]);

  const routes = useMemo(() => {
    const out: Record<string, Route> = {};
    if (!geo) return out;
    for (const e of edges) {
      const a = geo.boxes[e.from];
      const b = geo.boxes[e.to];
      if (!a || !b) continue;
      const size = e.label ? geo.pills[e.id] : undefined;
      out[e.id] = routeElbow(a, b, way[e.id] ?? null, { fromSide: e.fromSide, toSide: e.toSide, label: size });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo, way, spec]);

  if (!mounted) return <div ref={root} className="pointer-events-none absolute inset-0" />;

  const local = (e: React.PointerEvent): Pt => {
    const r = root.current!.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const tones = ['default', 'added', 'removed'] as const;
  const marker = (tone: EdgeSpec['tone'] = 'default') => `url(#${uid}-arrow-${tone})`;

  return (
    <div ref={root} className={`pointer-events-none absolute inset-0 z-10 ${className}`}>
      <svg className="absolute inset-0 overflow-visible" width="100%" height="100%" aria-hidden>
        <defs>
          {tones.map((t) => (
            <marker key={t} id={`${uid}-arrow-${t}`} viewBox="0 0 10 10" markerWidth="5" markerHeight="5" markerUnits="strokeWidth" refX="5" refY="5" orient="auto-start-reverse">
              <path d="M0,0 L0,10 L10,5 z" fill={STROKE[t]} />
            </marker>
          ))}
        </defs>
        {edges.map((e) => {
          const r = routes[e.id];
          if (!r) return null;
          const tone = e.tone ?? 'default';
          const halves = splitAtLabel(r, e.label ? geo!.pills[e.id] : null, e.bidirectional);
          return (
            <g key={e.id}>
              {halves.map((pts, k) => {
                const first = k === 0;
                const last = k === halves.length - 1;
                const dashed = tone === 'removed' || !!e.dashed || (!!e.guard && first && halves.length > 1);
                const d = pathD(pts);
                return (
                  <g key={k}>
                    <path d={d} fill="none" stroke="var(--sp-edge-halo)" strokeWidth={6} />
                    <path
                      d={d}
                      fill="none"
                      stroke={STROKE[tone]}
                      strokeWidth={2}
                      strokeDasharray={dashed ? '5 5' : undefined}
                      strokeDashoffset={dashed ? 2.5 : undefined}
                      markerEnd={last ? marker(tone) : undefined}
                      markerStart={first && e.bidirectional ? marker(tone) : undefined}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      {edges.map((e) => {
        if (!e.label) return null;
        const r = routes[e.id];
        const at = r?.label;
        const active = dragging?.id === e.id;
        const text = e.labelStyle === 'text';
        const move = (p: Pt) => setWay((w) => ({ ...w, [e.id]: p }));
        return (
          <div
            key={e.id}
            ref={(el) => {
              pills.current[e.id] = el;
            }}
            role={decorative ? undefined : 'button'}
            tabIndex={at && !decorative ? 0 : -1}
            aria-hidden={decorative || undefined}
            aria-roledescription={decorative ? undefined : 'movable label'}
            onPointerDown={(ev) => {
              if (!at || ev.button !== 0) return;
              ev.preventDefault();
              ev.currentTarget.setPointerCapture(ev.pointerId);
              const p = local(ev);
              setDragging({ id: e.id, off: [p[0] - at[0], p[1] - at[1]], moved: false });
            }}
            onPointerMove={(ev) => {
              if (!active || !dragging) return;
              const p = local(ev);
              if (!dragging.moved) setDragging({ ...dragging, moved: true });
              move([p[0] - dragging.off[0], p[1] - dragging.off[1]]);
            }}
            onPointerUp={() => {
              if (!active) return;
              const moved = dragging?.moved;
              setDragging(null);
              // A click without movement keeps the auto-routed position;
              // only a real drag settles a waypoint.
              if (moved && at) move(at);
            }}
            onPointerCancel={() => setDragging(null)}
            onKeyDown={(ev) => {
              const k = keys[ev.key];
              if (!k || !at) return;
              ev.preventDefault();
              move([at[0] + k[0] * NUDGE, at[1] + k[1] * NUDGE]);
            }}
            className={`pointer-events-auto absolute left-0 top-0 touch-none select-none whitespace-nowrap text-[var(--sp-fg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sp-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sp-bg)] ${
              text ? 'px-2 py-1 text-[12px] leading-4' : 'rounded-[15.2px] border-2 px-3 py-2 text-[14px] leading-5 font-semibold'
            } ${active ? 'cursor-grabbing' : 'cursor-grab'} ${e.guard ? 'grid grid-cols-[20px_auto] items-center gap-x-2' : ''}`}
            style={{
              borderColor: STROKE[e.tone ?? 'default'],
              background: text ? 'transparent' : 'var(--sp-label-bg)',
              transform: at ? `translate(${at[0]}px, ${at[1]}px) translate(-50%, -50%)` : undefined,
              visibility: at ? 'visible' : 'hidden',
            }}
          >
            {e.guard ? (
              <>
                <span className="row-span-2 grid size-5 place-items-center" aria-hidden>
                  <span className="block size-[14px] rotate-45 rounded-[2px] bg-[var(--sp-fg)]" />
                </span>
                <span>{e.label}</span>
                <span className="leading-5">
                  <span className="text-[var(--sp-muted)]">IF</span> <span className="text-[12px] text-[var(--sp-fg)] opacity-80">{e.guard}</span>
                </span>
              </>
            ) : (
              e.label
            )}
          </div>
        );
      })}
    </div>
  );
}
