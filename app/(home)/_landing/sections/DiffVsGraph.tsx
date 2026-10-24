'use client';
// §3 The problem: the same change shown twice. An agent's PR diff (opaque)
// vs the same change as a graph with one new transition highlighted.
import { Statechart, checkoutMachine } from '../Statechart';
import { FigCaption, Section, SectionHeading } from '../shared';

const diff: Array<[' ' | '+' | '-', string]> = [
  [' ', 'export const checkoutMachine = setup({'],
  [' ', '  actors: { charge, verifyAddress },'],
  ['-', '  guards: { hasItems },'],
  ['+', '  guards: { hasItems, canRetry },'],
  [' ', '}).createMachine({'],
  [' ', '  states: {'],
  [' ', '    payment: {'],
  [' ', '      invoke: { src: "charge", onDone: "confirmed",'],
  ['-', '        onError: "declined" },'],
  ['+', '        onError: [{ guard: "canRetry", target: "declined" },'],
  ['+', '                  { target: "cart" }] },'],
  [' ', '    },'],
  [' ', '    declined: {'],
  ['+', '      on: { RETRY: "payment", CANCEL: "cart" },'],
  ['-', '      on: { CANCEL: "cart" },'],
  [' ', '    },'],
  ['-', '    refund: { entry: "issueRefund", type: "final" },'],
  ['+', '    refund: { entry: "issueRefund" },'],
  [' ', '  },'],
  [' ', '});'],
];

export function DiffVsGraph() {
  return (
    <Section id="problem" event="WHY">
      <SectionHeading
        title="Agents write code faster than anyone can review it."
        lede="A diff shows which lines moved. It doesn't show that refund can no longer be reached, or that RETRY now loops back into payment."
      />
        {/* the argument */}
        <div className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1.25fr)] gap-4 lg:gap-0 items-stretch">
          {/* diff */}
          <div className="rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-surface)] overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 min-h-9 border-b border-[var(--sp-border)]">
              <span className="sp-mono text-[11px] text-[var(--sp-fg)]">PR #4821 · checkout retry</span>
              <span className="sp-mono text-[11px] text-[var(--sp-muted-2)]">src/checkout.ts</span>
              <span className="ml-auto sp-mono text-[11px]">
                <span className="text-[var(--sp-success)]">+5</span>{' '}
                <span className="text-[oklch(0.7_0.19_22)]">−4</span>
              </span>
            </div>
            <pre className="sp-mono text-[11.5px] leading-[1.6] p-4 overflow-hidden text-[var(--sp-muted)]">
              {diff.map(([k, line], i) => (
                <div
                  key={i}
                  className={
                    k === '+'
                      ? 'bg-[oklch(0.78_0.15_150/10%)] text-[var(--sp-fg)]'
                      : k === '-'
                        ? 'bg-[oklch(0.7_0.19_22/10%)] text-[var(--sp-muted-2)] line-through decoration-[oklch(0.7_0.19_22/50%)]'
                        : ''
                  }
                >
                  <span className="inline-block w-5 select-none text-[var(--sp-muted-2)]">{k}</span>
                  {line}
                </div>
              ))}
            </pre>
            <div className="px-4 pb-4">
              <FigCaption n={1}>What the reviewer sees. 9 changed lines in src/checkout.ts.</FigCaption>
            </div>
          </div>

          {/* connector: a transition between the two panes */}
          <div className="hidden lg:flex items-center justify-center">
            <svg width="56" height="24" viewBox="0 0 56 24" aria-hidden>
              <path d="M 2 12 L 50 12" stroke="var(--sp-primary)" strokeWidth="2" markerEnd="url(#sp-arrow-accent)" />
            </svg>
          </div>

          {/* graph */}
          <div className="rounded-[var(--sp-radius)] border border-[var(--sp-border)] sp-grid overflow-hidden flex flex-col">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 min-h-9 border-b border-[var(--sp-border)] bg-[var(--sp-canvas)]">
              <span className="sp-mono text-[11px] text-[var(--sp-fg)]">same change, as behavior</span>
              <span className="ml-auto sp-mono text-[10.5px] uppercase tracking-[0.06em]">
                <span className="text-[var(--sp-primary)]">1 new transition</span>
                <span className="text-[var(--sp-muted-2)]"> · </span>
                <span className="text-[var(--sp-warn)]">1 state unreachable</span>
              </span>
            </div>
            <Statechart machine={checkoutMachine} className="w-full flex-1 p-4" />
            <div className="px-4 pb-4">
              <FigCaption n={2}>The same PR as a graph. One new transition, one state now unreachable.</FigCaption>
            </div>
          </div>
        </div>

    </Section>
  );
}
