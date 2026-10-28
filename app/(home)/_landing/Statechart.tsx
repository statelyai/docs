// SVG statechart drawn with the editor's exact styling: nodes sized from
// their text (12px padding, 2px border, 45px tall), 2px edges with a
// translucent halo, 10px cubic corners, edges split at their event labels,
// 10x10 arrowheads with the tip 5px off the target. Optional simulation
// highlights follow the editor's: a 4px outline on the active state, a 2px
// ring on labels of enabled transitions, an 8px half-opacity halo on the
// taken transition, everything else dimmed to 0.5.
// Hand-placed coordinates; not a layout engine. Used for page motif diagrams.
import { useId } from 'react';
import { pathD } from './router';
import { eventTextWidth, stateTextWidth } from './text';

export type Ramp = 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'blue';

export type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  /** defaults to the text width plus padding, like the editor */
  w?: number;
  h?: number;
  evidence?: string;
  initial?: boolean;
  final?: boolean;
  unreachable?: boolean;
  /** the editor's per-state color */
  color?: Ramp;
  selected?: boolean;
};

export type Edge = {
  from: string;
  to: string;
  label: string;
  /** orthogonal waypoints, absolute. First/last are on node borders. */
  points: [number, number][];
  /** index of the segment that carries the label (default: middle) */
  labelSeg?: number;
  /** keep the split gap but draw no label (another edge on the same segment draws it) */
  labelHidden?: boolean;
  /** added: new in a diff (solid). removed: gone in a diff (dashed). */
  tone?: 'added' | 'removed';
};

export type Machine = { w: number; h: number; nodes: Node[]; edges: Edge[] };

/** Simulation state: which state is active, which transitions can be taken, which one just was. */
export type Sim = {
  active?: string;
  /** edge keys (see `edgeKey`) */
  enabled?: string[];
  taken?: string;
  /** state being entered: a short fill flash before it becomes active */
  preview?: string;
};

export const edgeKey = (e: Pick<Edge, 'from' | 'label'>) => `${e.from}:${e.label}`;

const EDGE = 'var(--sp-edge)';
const SIM = 'var(--sp-sim)';
const toneColor = { added: 'var(--sp-success)', removed: 'var(--sp-destructive)' } as const;
const NH = 45;
const LABEL_H = 40;
/** 12px padding and a 2px border on each side. */
const BOX_X = 28;
/** The final-state icon column. */
const TYPE_ICON = 28;
const EASE = 'opacity 0.3s ease-out';

/** Width of a state node: Inter 20px 600 plus padding, plus the icon column for final states. */
export const nodeWidth = (label: string, final = false) => Math.round(stateTextWidth(label)) + BOX_X + (final ? TYPE_ICON : 0);

/** Width of an event label: Inter 14px 600 plus padding. */
export const labelWidth = (s: string) => Math.round(eventTextWidth(s)) + BOX_X;

type P = [number, number];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const unit = (v: P): P => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};
const along = (p: P, d: P, t: number): P => [p[0] + d[0] * t, p[1] + d[1] * t];

/** Split an edge at its label; the target half ends 10px before the target. */
function splitEdge(e: Edge) {
  const pts = e.points;
  const i = e.labelSeg ?? Math.floor((pts.length - 1) / 2);
  const a = pts[i];
  const b = pts[i + 1];
  const d = unit(sub(b, a));
  const mid: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const half = d[0] !== 0 ? labelWidth(e.label) / 2 : LABEL_H / 2;
  const source: P[] = [...pts.slice(0, i + 1), along(mid, d, -half)];
  const target: P[] = [along(mid, d, half), ...pts.slice(i + 1)];
  const n = target.length;
  const ld = unit(sub(target[n - 1], target[n - 2]));
  target[n - 1] = along(target[n - 1], ld, -10);
  return { source, target, mid, end: target[n - 1], dir: ld };
}

/** The taken-transition halo arrowhead: 18px, same tip as the 10px one. */
function haloArrow(end: P, d: P) {
  const tip = along(end, d, 5);
  const base = along(tip, d, -18);
  const n: P = [-d[1], d[0]];
  return [tip, along(base, n, 9), along(base, n, -9)].map((p) => p.join(',')).join(' ');
}

export function Statechart({
  machine,
  className,
  label,
  description,
  sim,
}: {
  machine: Machine;
  className?: string;
  /** accessible name; omit when the chart is decorative (aria-hidden parent) */
  label?: string;
  /** text alternative; defaults to a generated list of states and transitions */
  description?: string;
  /** simulation highlights; omit for a plain diagram */
  sim?: Sim | null;
}) {
  const { w, h, nodes, edges } = machine;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const describe = () => {
    const states = nodes
      .map((n) => {
        const flags = [n.initial && 'initial', n.final && 'final', n.unreachable && 'unreachable'].filter(Boolean);
        return flags.length ? `${n.label} (${flags.join(', ')})` : n.label;
      })
      .join(', ');
    const transitions = edges.map((e) => `${byId[e.from]?.label ?? e.from} on ${e.label} to ${byId[e.to]?.label ?? e.to}`).join('; ');
    return `States: ${states}. Transitions: ${transitions}.`;
  };
  const titleId = `sc-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const descId = `${titleId}-desc`;
  const mk = `${titleId}-arrow`;
  const simOn = !!sim;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role={label ? 'img' : undefined}
      aria-labelledby={label ? `${titleId} ${descId}` : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <title id={titleId}>{label}</title>}
      {label && <desc id={descId}>{description ?? describe()}</desc>}
      <defs>
        {(
          [
            [mk, EDGE],
            [`${mk}-added`, toneColor.added],
            [`${mk}-removed`, toneColor.removed],
          ] as const
        ).map(([id, fill]) => (
          <marker key={id} id={id} viewBox="0 0 10 10" markerWidth="5" markerHeight="5" markerUnits="strokeWidth" refX="5" refY="5" orient="auto">
            <path d="M0,0 L0,10 L10,5 z" fill={fill} />
          </marker>
        ))}
      </defs>

      {edges.map((e) => {
        const key = edgeKey(e);
        const stroke = e.tone ? toneColor[e.tone] : EDGE;
        const dash = e.tone === 'removed' ? '5 5' : undefined;
        const { source, target, mid, end, dir } = splitEdge(e);
        const lw = labelWidth(e.label);
        const enabled = !!sim?.enabled?.includes(key);
        const taken = sim?.taken === key;
        return (
          <g key={key} style={{ opacity: simOn && !enabled && !taken ? 0.5 : 1, transition: EASE }}>
            {sim !== undefined && (
              // Taken-transition halo under the stroke, drawn along the path when it fires.
              <g style={{ opacity: taken ? 1 : 0, transition: EASE }}>
                <path d={pathD(source)} pathLength={1} fill="none" stroke={SIM} strokeWidth={8} strokeOpacity={0.5} className={taken ? 'sp-sim-draw' : undefined} />
                <path d={pathD(target)} pathLength={1} fill="none" stroke={SIM} strokeWidth={8} strokeOpacity={0.5} className={taken ? 'sp-sim-draw sp-sim-draw-target' : undefined} />
                <polygon points={haloArrow(end, dir)} fill={SIM} fillOpacity={0.5} className={taken ? 'sp-sim-arrow' : undefined} />
              </g>
            )}
            {[source, target].map((pts, k) => (
              <g key={k}>
                <path d={pathD(pts)} fill="none" stroke="var(--sp-edge-halo)" strokeWidth={6} />
                <path
                  d={pathD(pts)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={2}
                  strokeDasharray={dash}
                  markerEnd={k === 1 ? `url(#${mk}${e.tone ? `-${e.tone}` : ''})` : undefined}
                />
              </g>
            ))}
            {!e.labelHidden && (
              <>
                {sim !== undefined && (
                  // Enabled transition: a 2px ring outside the label border.
                  <rect
                    x={mid[0] - lw / 2 - 1}
                    y={mid[1] - LABEL_H / 2 - 1}
                    width={lw + 2}
                    height={LABEL_H + 2}
                    rx={16.2}
                    fill="none"
                    stroke={SIM}
                    strokeWidth={2}
                    style={{ opacity: enabled ? 1 : 0, transition: EASE }}
                  />
                )}
                <rect x={mid[0] - lw / 2} y={mid[1] - LABEL_H / 2} width={lw} height={LABEL_H} rx={15.2} fill="var(--sp-label-bg)" stroke={stroke} strokeWidth={2} />
                <text x={mid[0]} y={mid[1] + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill="var(--sp-fg)">
                  {e.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {nodes.map((n) => {
        const nw = n.w ?? nodeWidth(n.label, n.final);
        const nh = n.h ?? (n.evidence ? 57 : NH);
        // Title line box: 8px top padding, 25px line; or centered when alone.
        const titleMid = n.evidence ? n.y + 8 + 12.5 : n.y + nh / 2;
        const tx = n.x + 12 + (n.final ? TYPE_ICON : 0);
        const fill = n.color ? `var(--sp-ramp-${n.color}-fill)` : 'var(--sp-node)';
        const border = n.color ? `var(--sp-ramp-${n.color}-border)` : 'var(--sp-node-stroke)';
        const ink = n.color ? `var(--sp-ramp-${n.color}-title)` : 'var(--sp-fg)';
        const active = sim?.active === n.id;
        const preview = sim?.preview === n.id;
        return (
          <g key={n.id} style={{ opacity: simOn && !active && !preview ? 0.5 : 1, transition: EASE }}>
            {n.initial && (
              <g transform={`translate(${n.x - 24} ${titleMid - 15})`}>
                <circle cx={4} cy={4} r={4} fill={EDGE} />
                <path d="M4,10 Q4,15 10,15 L11,15" fill="none" stroke={EDGE} strokeWidth={2} strokeLinecap="round" />
                <path d="M11,11 L11,19 L19,15 z" fill={EDGE} />
              </g>
            )}
            {sim !== undefined && (
              // Active state: 4px outline, 2px off the border.
              <rect x={n.x - 4} y={n.y - 4} width={nw + 8} height={nh + 8} rx={9.2} fill="none" stroke={SIM} strokeWidth={4} style={{ opacity: active ? 1 : 0, transition: EASE }} />
            )}
            {n.selected && (
              <rect x={n.x - 4} y={n.y - 4} width={nw + 8} height={nh + 8} rx={9.2} fill="none" stroke="var(--sp-select)" strokeWidth={2} />
            )}
            <rect x={n.x} y={n.y} width={nw} height={nh} rx={5.2} fill={fill} stroke={border} strokeWidth={2} />
            {sim !== undefined && (
              // Entering a state: the editor's 16% fill, faded in.
              <rect
                x={n.x}
                y={n.y}
                width={nw}
                height={nh}
                rx={5.2}
                fill={SIM}
                fillOpacity={0.16}
                className={preview ? 'sp-sim-fill' : undefined}
                style={{ opacity: preview ? 1 : 0, transition: preview ? undefined : EASE }}
              />
            )}
            {n.final && (
              <g>
                <circle cx={n.x + 22} cy={titleMid} r={9} fill="none" stroke={n.color ? ink : 'var(--sp-final-icon)'} strokeWidth={3} />
                <circle cx={n.x + 22} cy={titleMid} r={4} fill={n.color ? ink : 'var(--sp-final-icon)'} />
              </g>
            )}
            <text x={tx} y={titleMid + 7} fontSize={20} fontWeight={600} letterSpacing={-0.2} fill={ink}>
              {n.label}
            </text>
            {n.evidence && (
              <text x={tx} y={n.y + 8 + 25 + 12} fontSize={12} fill="var(--sp-muted)">
                {n.evidence}
              </text>
            )}
            {n.unreachable && (
              <g transform={`translate(${n.x + nw} ${n.y})`}>
                <circle r={10} fill="var(--sp-warn)" />
                <path d="M0,-4.5 L4.5,3.5 L-4.5,3.5 z" fill="var(--sp-bg)" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
