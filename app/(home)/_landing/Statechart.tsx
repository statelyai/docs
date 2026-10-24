// PROTOTYPE — SVG statechart drawn in Viz editor styling (rounded-rect nodes,
// 2px orthogonal edges with rounded corners, bordered event labels, filled
// triangle arrowheads). Hand-placed coordinates; not a layout engine.

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
  active?: 'selected' | 'sim' | 'inspect';
  /** selection outline; combinable with a sim/inspect runtime outline */
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
  /** shorthand for tone: 'accent' */
  accent?: boolean;
  /** accent: highlighted (primary). added: new in a diff (success, solid). removed: gone in a diff (destructive, dashed). */
  tone?: 'accent' | 'added' | 'removed';
  dashed?: boolean;
};

const toneColor = {
  accent: 'var(--sp-primary)',
  added: 'var(--sp-success)',
  removed: 'var(--sp-destructive)',
} as const;

export type Machine = { w: number; h: number; nodes: Node[]; edges: Edge[] };

const NW = 148;
const NH = 56;

function ortho(points: [number, number][], r = 10) {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const inx = Math.sign(cx - px);
    const iny = Math.sign(cy - py);
    const outx = Math.sign(nx - cx);
    const outy = Math.sign(ny - cy);
    const rr = Math.min(
      r,
      Math.hypot(cx - px, cy - py) / 2,
      Math.hypot(nx - cx, ny - cy) / 2,
    );
    d += ` L ${cx - inx * rr} ${cy - iny * rr}`;
    d += ` Q ${cx} ${cy} ${cx + outx * rr} ${cy + outy * rr}`;
  }
  const [lx, ly] = points[points.length - 1];
  d += ` L ${lx} ${ly}`;
  return d;
}

function segMid(points: [number, number][], seg?: number): [number, number] {
  const i = seg ?? Math.floor((points.length - 1) / 2);
  const [ax, ay] = points[i];
  const [bx, by] = points[i + 1];
  return [(ax + bx) / 2, (ay + by) / 2];
}

export function Statechart({
  machine,
  className,
  dim = false,
  showEvidence = true,
  label = 'Statechart of a checkout flow mapped from source code',
}: {
  machine: Machine;
  className?: string;
  dim?: boolean;
  showEvidence?: boolean;
  label?: string;
}) {
  const { w, h, nodes, edges } = machine;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label={label}
      style={{ opacity: dim ? 0.55 : 1 }}
    >
      <defs>
        {(
          [
            ['sp-arrow', 'var(--sp-edge)'],
            ['sp-arrow-accent', toneColor.accent],
            ['sp-arrow-added', toneColor.added],
            ['sp-arrow-removed', toneColor.removed],
          ] as const
        ).map(([id, fill]) => (
          <marker
            key={id}
            id={id}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={fill} />
          </marker>
        ))}
      </defs>

      {edges.map((e) => {
        const tone = e.tone ?? (e.accent ? 'accent' : undefined);
        const stroke = tone ? toneColor[tone] : 'var(--sp-edge)';
        const dashed = e.dashed || tone === 'removed';
        const [mx, my] = segMid(e.points, e.labelSeg);
        const lw = e.label.length * 7.6 + 22;
        return (
          <g key={`${e.from}-${e.to}-${e.label}`}>
            <path
              d={ortho(e.points)}
              fill="none"
              stroke={stroke}
              strokeWidth={2}
              strokeDasharray={dashed ? '4 4' : undefined}
              markerEnd={tone ? `url(#sp-arrow-${tone})` : 'url(#sp-arrow)'}
            />
            <rect
              x={mx - lw / 2}
              y={my - 11}
              width={lw}
              height={22}
              rx={11}
              fill="var(--sp-canvas)"
              stroke={stroke}
              strokeWidth={2}
            />
            <text
              x={mx}
              y={my + 4}
              textAnchor="middle"
              className="sp-mono"
              fontSize={11}
              fontWeight={500}
              letterSpacing={0.4}
              fill={tone ? 'var(--sp-fg)' : 'var(--sp-muted)'}
            >
              {e.label}
            </text>
          </g>
        );
      })}

      {nodes.map((n) => {
        const nw = n.w ?? NW;
        const nh = n.h ?? NH;
        const stroke = n.unreachable
          ? 'var(--sp-warn)'
          : n.selected || n.active === 'selected'
            ? 'var(--sp-primary)'
            : 'var(--sp-node-stroke)';
        return (
          <g key={n.id} opacity={n.unreachable ? 0.8 : 1}>
            {n.initial && (
              <>
                <circle cx={n.x - 26} cy={n.y + 14} r={5} fill="var(--sp-edge)" />
                <path
                  d={`M ${n.x - 21} ${n.y + 14} L ${n.x - 2} ${n.y + 14}`}
                  stroke="var(--sp-edge)"
                  strokeWidth={2}
                  markerEnd="url(#sp-arrow)"
                />
              </>
            )}
            {n.active === 'sim' && (
              <rect
                x={n.x - 4}
                y={n.y - 4}
                width={nw + 8}
                height={nh + 8}
                rx={10}
                fill="none"
                stroke="var(--sp-sim)"
                strokeWidth={4}
              />
            )}
            {n.active === 'inspect' && (
              <rect
                x={n.x - 4}
                y={n.y - 4}
                width={nw + 8}
                height={nh + 8}
                rx={10}
                fill="none"
                stroke="var(--sp-inspect)"
                strokeWidth={2}
                strokeDasharray="2 3"
              />
            )}
            <rect
              x={n.x}
              y={n.y}
              width={nw}
              height={nh}
              rx={6}
              fill="var(--sp-node)"
              stroke={stroke}
              strokeWidth={2}
              strokeDasharray={n.unreachable ? '5 4' : undefined}
            />
            {n.final && (
              <rect
                x={n.x + 4}
                y={n.y + 4}
                width={nw - 8}
                height={nh - 8}
                rx={3}
                fill="none"
                stroke={stroke}
                strokeWidth={1.5}
              />
            )}
            <text
              x={n.x + 12}
              y={n.y + 23}
              fontSize={13}
              fontWeight={600}
              fill="var(--sp-fg)"
            >
              {n.label}
            </text>
            {showEvidence && n.evidence && (
              <text
                x={n.x + 12}
                y={n.y + 42}
                className="sp-mono"
                fontSize={11}
                fontWeight={500}
                fill={n.unreachable ? 'var(--sp-warn)' : 'var(--sp-muted-2)'}
              >
                {n.evidence}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- sample machine: checkout flow "mapped from source" ---------- */

const col = (i: number) => 40 + i * 220;
const row = (i: number) => 36 + i * 150;

export const checkoutMachine: Machine = {
  w: 760,
  h: 400,
  nodes: [
    { id: 'idle', label: 'idle', x: col(0), y: row(0), initial: true, evidence: 'checkout.ts:12' },
    { id: 'cart', label: 'cart', x: col(1), y: row(0), evidence: 'checkout.ts:31' },
    { id: 'address', label: 'address', x: col(2), y: row(0), evidence: 'checkout.ts:58' },
    { id: 'payment', label: 'payment', x: col(2), y: row(1), evidence: 'payment.ts:9', active: 'selected' },
    { id: 'declined', label: 'declined', x: col(1), y: row(1), evidence: 'payment.ts:44' },
    { id: 'confirmed', label: 'confirmed', x: col(2), y: row(2), final: true, evidence: 'checkout.ts:97' },
    { id: 'refund', label: 'refund', x: col(0), y: row(2), w: 196, unreachable: true, evidence: 'unreachable · refund.ts:3' },
  ],
  edges: [
    { from: 'idle', to: 'cart', label: 'ADD_ITEM', points: [[col(0) + NW, row(0) + 28], [col(1), row(0) + 28]] },
    { from: 'cart', to: 'address', label: 'CHECKOUT', points: [[col(1) + NW, row(0) + 28], [col(2), row(0) + 28]] },
    { from: 'address', to: 'payment', label: 'SUBMIT', points: [[col(2) + NW / 2, row(0) + NH], [col(2) + NW / 2, row(1)]] },
    { from: 'payment', to: 'confirmed', label: 'PAID', points: [[col(2) + NW / 2, row(1) + NH], [col(2) + NW / 2, row(2)]] },
    { from: 'payment', to: 'declined', label: 'FAIL', points: [[col(2), row(1) + 20], [col(1) + NW, row(1) + 20]] },
    { from: 'declined', to: 'payment', label: 'RETRY', accent: true, points: [[col(1) + NW, row(1) + 40], [col(2), row(1) + 40]] },
    {
      from: 'cart',
      to: 'idle',
      label: 'EMPTY',
      points: [[col(1) + NW / 2, row(0) + NH], [col(1) + NW / 2, row(0) + NH + 40], [col(0) + NW / 2, row(0) + NH + 40], [col(0) + NW / 2, row(0) + NH]],
      labelSeg: 1,
    },
    {
      from: 'declined',
      to: 'cart',
      label: 'CANCEL',
      points: [[col(1), row(1) + 28], [col(0) + NW / 2 + 40, row(1) + 28], [col(0) + NW / 2 + 40, row(0) + NH + 70], [col(1) + 40, row(0) + NH + 70], [col(1) + 40, row(0) + NH]],
      labelSeg: 0,
    },
  ],
};

/** Tiny 3-node chain used as a section eyebrow / motif. */
export function MiniChain({ step = 0, className }: { step?: number; className?: string }) {
  const n = 3;
  const w = 84;
  return (
    <svg viewBox={`0 0 ${w} 14`} width={w} height={14} className={className} aria-hidden>
      {Array.from({ length: n }).map((_, i) => {
        const x = i * 30 + 1;
        const on = i <= step;
        return (
          <g key={i}>
            <rect x={x} y={2} width={20} height={10} rx={3} fill={on ? 'var(--sp-primary)' : 'var(--sp-node)'} stroke={on ? 'var(--sp-primary)' : 'var(--sp-node-stroke)'} strokeWidth={1.5} />
            {i < n - 1 && <path d={`M ${x + 22} 7 L ${x + 29} 7`} stroke="var(--sp-edge)" strokeWidth={1.5} markerEnd="url(#sp-arrow)" />}
          </g>
        );
      })}
    </svg>
  );
}
