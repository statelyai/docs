// §3 The problem: the same change shown twice. An agent's PR diff (abstract,
// unreadable at a glance) vs the same change as the editor draws it.
import { Statechart } from '../Statechart';
import { checkoutAfterMachine } from '../machines';
import { Edge, FigCaption, Section, SectionHeading } from '../shared';

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
  ' ': { row: '', bar: 'var(--sp-muted-fill)' },
  '+': { row: 'bg-[oklch(0.78_0.15_150/10%)]', bar: 'oklch(0.78 0.15 150 / 45%)' },
  '-': { row: 'bg-[oklch(0.7_0.19_22/10%)]', bar: 'oklch(0.7 0.19 22 / 45%)' },
} as const;

const diffTitle = 'The same PR as a statechart';
const diffDescription =
  'The checkout statechart after the PR. States: idle (initial), cart, address, payment, declined, confirmed (final), refund (unreachable: no transition leads to it). Transitions: idle on ADD_ITEM to cart; cart on CHECKOUT to address; cart on EMPTY to idle; address on SUBMIT to payment; payment on PAID to confirmed; payment on FAIL to declined; declined on RETRY to payment (added in this PR); declined on CANCEL to cart. Removed in this PR: declined on REFUND to refund.';

export function DiffVsGraph() {
  return (
    <Section id="problem" event="REVIEW" guard="diff unreadable" color="red">
      <SectionHeading
        title="Agents write code faster than anyone can review it."
        lede="A diff shows which lines moved. It doesn't show that refund can no longer be reached, or that RETRY now loops back into payment."
      />
      <div className="mt-12 grid lg:grid-cols-[minmax(0,2fr)_56px_minmax(0,3fr)] gap-4 lg:gap-0 items-stretch">
        {/* diff: abstract, no readable code */}
        <div className="lg:h-[520px] rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-surface)] overflow-hidden flex flex-col">
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
          <Edge dir="right" length={56} />
        </div>

        {/* graph */}
        <div className="lg:h-[520px] rounded-[var(--sp-radius)] border border-[var(--sp-border)] sp-grid overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 min-h-9 border-b border-[var(--sp-border)] bg-[var(--sp-canvas)]">
            <span className="sp-mono text-[11.5px] text-[var(--sp-fg)]">same change, as behavior</span>
            <span className="ml-auto sp-mono text-[11.5px] text-[var(--sp-warn)]">refund unreachable</span>
          </div>
          <div data-machine-slot="diff-graph" className="flex-1 min-h-0 flex items-center justify-center p-4">
            <Statechart
              machine={checkoutAfterMachine.wide}
              label={diffTitle}
              description={diffDescription}
              className="hidden sm:block w-full h-auto max-h-full"
            />
            <Statechart
              machine={checkoutAfterMachine.tall}
              label={diffTitle}
              description={diffDescription}
              className="sm:hidden w-full h-auto max-w-[24rem]"
            />
          </div>
          <div className="px-4 pb-4">
            <FigCaption n={2}>The same PR as a graph. refund can no longer be reached.</FigCaption>
          </div>
        </div>
      </div>
    </Section>
  );
}
