// §3 The problem: the same change shown twice. An agent's PR diff (abstract,
// unreadable at a glance) vs the same change as a graph: RETRY added, REFUND removed.
import { MachineCanvas } from '../MachineCanvas';
import { type Machine } from '../Statechart';
import { Edge, FigCaption, Section, SectionHeading } from '../shared';

// Fig 2: only the states this PR touches. Hand-placed.
const NW = 148;
const NH = 56;
const L = 40; // left column x
const R = 324; // right column x
const T = 30; // top row y
const B = 180; // bottom row y
const RW = 196; // refund is wider for its evidence line
const prMachine: Machine = {
  w: R + NW + 40,
  h: B + NH + 24,
  nodes: [
    { id: 'declined', label: 'declined', x: L, y: T, evidence: 'payment.ts:44' },
    { id: 'payment', label: 'payment', x: R, y: T, evidence: 'payment.ts:9' },
    { id: 'confirmed', label: 'confirmed', x: R, y: B, final: true, evidence: 'checkout.ts:97' },
    { id: 'refund', label: 'refund', x: L, y: B, w: RW, unreachable: true, evidence: 'unreachable · refund.ts:3' },
  ],
  edges: [
    { from: 'payment', to: 'declined', label: 'FAIL', points: [[R, T + 16], [L + NW, T + 16]] },
    { from: 'declined', to: 'payment', label: 'RETRY', tone: 'added', points: [[L + NW, T + 42], [R, T + 42]] },
    { from: 'payment', to: 'confirmed', label: 'PAID', points: [[R + NW / 2, T + NH], [R + NW / 2, B]] },
    { from: 'confirmed', to: 'refund', label: 'REFUND', tone: 'removed', points: [[R, B + NH / 2], [L + RW, B + NH / 2]] },
  ],
};

// Skeleton rows: widths in %, indent in steps. 2 removed, 2 added, 4 context.
const rows: Array<[' ' | '+' | '-', number, number]> = [
  [' ', 0, 62],
  [' ', 1, 44],
  ['-', 2, 56],
  ['+', 2, 78],
  [' ', 2, 38],
  ['-', 3, 48],
  ['+', 3, 70],
  [' ', 1, 30],
];

const tint = {
  ' ': { row: '', bar: 'oklch(1 0 0 / 9%)' },
  '+': { row: 'bg-[oklch(0.78_0.15_150/10%)]', bar: 'oklch(0.78 0.15 150 / 45%)' },
  '-': { row: 'bg-[oklch(0.7_0.19_22/10%)]', bar: 'oklch(0.7 0.19 22 / 45%)' },
} as const;

export function DiffVsGraph() {
  return (
    <Section id="problem" event="REVIEW" guard="diff unreadable">
      <SectionHeading
        title="Agents write code faster than anyone can review it."
        lede="A diff shows which lines moved. It doesn't show that refund can no longer be reached, or that RETRY now loops back into payment."
      />
      <div className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1.25fr)] gap-4 lg:gap-0 items-stretch">
        {/* diff: abstract, no readable code */}
        <div className="lg:h-[360px] rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-surface)] overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 min-h-9 border-b border-[var(--sp-border)]">
            <span className="sp-mono text-[11.5px] text-[var(--sp-fg)]">PR #4821 · checkout retry</span>
            <span className="sp-mono text-[11.5px] text-[var(--sp-muted-2)]">src/checkout.ts</span>
            <span className="ml-auto sp-mono text-[11.5px]">
              <span className="text-[var(--sp-success)]">+4</span>{' '}
              <span className="text-[oklch(0.7_0.19_22)]">−4</span>
            </span>
          </div>
          <div aria-hidden className="flex-1 flex flex-col justify-center gap-1.5 p-4">
            {rows.map(([k, indent, width], i) => (
              <div key={i} className={`flex items-center h-6 rounded-sm ${tint[k].row}`}>
                <span className="sp-mono w-6 shrink-0 text-center text-[11.5px] text-[var(--sp-muted-2)]">{k}</span>
                <span
                  className="h-2 rounded-full"
                  style={{ marginLeft: indent * 14, width: `${width}%`, background: tint[k].bar }}
                />
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <FigCaption n={1}>Excerpt of src/checkout.ts. 8 lines changed.</FigCaption>
          </div>
        </div>

        <div className="hidden lg:flex items-center">
          <Edge dir="right" accent length={56} />
        </div>

        {/* graph */}
        <div className="lg:h-[360px] rounded-[var(--sp-radius)] border border-[var(--sp-border)] sp-grid overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 min-h-9 border-b border-[var(--sp-border)] bg-[var(--sp-canvas)]">
            <span className="sp-mono text-[11.5px] text-[var(--sp-fg)]">same change, as behavior</span>
            <span className="ml-auto sp-mono text-[11.5px] uppercase tracking-[0.06em]">
              <span className="text-[var(--sp-success)]">+1 transition</span>
              <span className="text-[var(--sp-muted-2)]"> · </span>
              <span className="text-[var(--sp-destructive)]">−1 transition</span>
              <span className="text-[var(--sp-muted-2)]"> · </span>
              <span className="text-[var(--sp-warn)]">1 unreachable</span>
            </span>
          </div>
          <MachineCanvas
            slot="diff-graph"
            machine={prMachine}
            label="The same PR as a statechart: RETRY from declined to payment added, REFUND from confirmed to refund removed, refund unreachable"
            className="flex-1 min-h-0 p-4"
            svgClassName="block w-full h-auto lg:h-full"
          />
          <div className="px-4 pb-4">
            <FigCaption n={2}>Same PR as a graph. RETRY added, REFUND removed, refund unreachable.</FigCaption>
          </div>
        </div>
      </div>
    </Section>
  );
}
