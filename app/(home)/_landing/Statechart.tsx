// SVG statechart drawn with the editor's exact styling: 45px rounded nodes,
// 2px edges with a translucent halo, 10px cubic corners, edges split at their
// event labels, 10x10 arrowheads with the tip 5px off the target.
// Hand-placed coordinates; not a layout engine. Used for page motif diagrams.

export type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  evidence?: string;
  initial?: boolean;
  final?: boolean;
  unreachable?: boolean;
  active?: 'sim';
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

const EDGE = 'var(--sp-edge)';
const toneColor = { added: '#4ade80', removed: '#f87171' } as const;
const NW = 148;
const NH = 45;
const LABEL_H = 40;

/** Width of an event label: Inter 14px 600, 12px padding, 2px border. */
export const labelWidth = (s: string) => Math.round(s.length * 9.4) + 28;

type P = [number, number];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const unit = (v: P): P => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};
const along = (p: P, d: P, t: number): P => [p[0] + d[0] * t, p[1] + d[1] * t];

/** Orthogonal path with 10px corners drawn as `L p0 C p0 corner p1`. */
function route(points: P[], r = 10) {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const c = points[i];
    const inV = sub(c, points[i - 1]);
    const outV = sub(points[i + 1], c);
    const rr = Math.min(r, Math.hypot(...inV) / 2, Math.hypot(...outV) / 2);
    const p0 = along(c, unit(inV), -rr);
    const p1 = along(c, unit(outV), rr);
    d += ` L ${p0[0]} ${p0[1]} C ${p0[0]} ${p0[1]} ${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`;
  }
  const last = points[points.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}

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
  return { source, target, mid };
}

export function Statechart({
  machine,
  className,
  label,
}: {
  machine: Machine;
  className?: string;
  /** accessible name; omit when the chart is decorative (aria-hidden parent) */
  label?: string;
}) {
  const { w, h, nodes, edges } = machine;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n.label]));
  const describe = () => {
    const states = nodes
      .map((n) => {
        const flags = [n.initial && 'initial', n.final && 'final', n.unreachable && 'unreachable'].filter(Boolean);
        return flags.length ? `${n.label} (${flags.join(', ')})` : n.label;
      })
      .join(', ');
    const transitions = edges.map((e) => `${byId[e.from] ?? e.from} on ${e.label} to ${byId[e.to] ?? e.to}`).join('; ');
    return `States: ${states}. Transitions: ${transitions}.`;
  };
  const titleId = `sc-title-${nodes.map((n) => n.id.replace(/\W/g, '')).join('-')}-${w}`;
  const descId = `${titleId}-desc`;
  const mk = `${titleId}-arrow`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role={label ? 'img' : undefined}
      aria-labelledby={label ? `${titleId} ${descId}` : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label && <title id={titleId}>{label}</title>}
      {label && <desc id={descId}>{describe()}</desc>}
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
        const stroke = e.tone ? toneColor[e.tone] : EDGE;
        const dash = e.tone === 'removed' ? '5 5' : undefined;
        const { source, target, mid } = splitEdge(e);
        const lw = labelWidth(e.label);
        return (
          <g key={`${e.from}-${e.to}-${e.label}`}>
            {[source, target].map((pts, k) => (
              <g key={k}>
                <path d={route(pts)} fill="none" stroke="black" strokeOpacity={0.5} strokeWidth={6} />
                <path
                  d={route(pts)}
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
                <rect x={mid[0] - lw / 2} y={mid[1] - LABEL_H / 2} width={lw} height={LABEL_H} rx={15.2} fill="var(--sp-label-bg)" stroke={stroke} strokeWidth={2} />
                <text x={mid[0]} y={mid[1] + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill="#fafafa">
                  {e.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {nodes.map((n) => {
        const nw = n.w ?? NW;
        const nh = n.h ?? (n.evidence ? 57 : NH);
        // Title line box: 8px top padding, 25px line; or centered when alone.
        const titleMid = n.evidence ? n.y + 8 + 12.5 : n.y + nh / 2;
        const tx = n.x + 12 + (n.final ? 28 : 0);
        return (
          <g key={n.id}>
            {n.initial && (
              <g transform={`translate(${n.x - 24} ${titleMid - 15})`}>
                <circle cx={4} cy={4} r={4} fill={EDGE} />
                <path d="M4,10 Q4,15 10,15 L11,15" fill="none" stroke={EDGE} strokeWidth={2} strokeLinecap="round" />
                <path d="M11,11 L11,19 L19,15 z" fill={EDGE} />
              </g>
            )}
            {n.active === 'sim' && (
              <rect x={n.x - 5} y={n.y - 5} width={nw + 10} height={nh + 10} rx={10.2} fill="none" stroke="var(--sp-sim)" strokeWidth={4} />
            )}
            {n.selected && (
              <rect x={n.x - 4} y={n.y - 4} width={nw + 8} height={nh + 8} rx={9.2} fill="none" stroke="var(--sp-select)" strokeWidth={2} />
            )}
            <rect x={n.x} y={n.y} width={nw} height={nh} rx={5.2} fill="var(--sp-node)" stroke="var(--sp-node-stroke)" strokeWidth={2} />
            {n.final && (
              <g>
                <circle cx={n.x + 22} cy={titleMid} r={9} fill="none" stroke="var(--sp-final-icon)" strokeWidth={3} />
                <circle cx={n.x + 22} cy={titleMid} r={4} fill="var(--sp-final-icon)" />
              </g>
            )}
            <text x={tx} y={titleMid + 7} fontSize={20} fontWeight={600} letterSpacing={-0.2} fill="#fafafa">
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
                <path d="M0,-4.5 L4.5,3.5 L-4.5,3.5 z" fill="#1b1b1f" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
