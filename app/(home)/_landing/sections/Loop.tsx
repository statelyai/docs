// §4 The Stately loop: five steps as one machine, each with what it leaves behind.
import { Statechart, type Machine } from '../Statechart';
import { nodeTitleCls } from '../classes';
import { Edge, Pane, Section, SectionHeading, StateNode } from '../shared';
import { TextLink } from './CopyLine';

// Five states in a row; the editor lays machines out top-down, so this
// figure is drawn here in editor styling to keep the loop horizontal.
const LW = 148;
const LX = (i: number) => 24 + i * 268;
const loopMachine: Machine = {
  w: 24 + 5 * 268 - 120 + 24,
  h: 61,
  nodes: [
    { id: 'mapped', label: 'mapped', x: LX(0), y: 8, initial: true },
    { id: 'proposed', label: 'proposed', x: LX(1), y: 8 },
    { id: 'approved', label: 'approved', x: LX(2), y: 8 },
    { id: 'implemented', label: 'implemented', x: LX(3), y: 8, w: 168 },
    { id: 'verified', label: 'verified', x: LX(4), y: 8, final: true },
  ],
  edges: [
    { from: 'mapped', to: 'proposed', label: 'PROPOSE', points: [[LX(0) + LW, 30], [LX(1), 30]] },
    { from: 'proposed', to: 'approved', label: 'REVIEW', points: [[LX(1) + LW, 30], [LX(2), 30]] },
    { from: 'approved', to: 'implemented', label: 'IMPLEMENT', points: [[LX(2) + LW, 30], [LX(3), 30]] },
    { from: 'implemented', to: 'verified', label: 'VERIFY', points: [[LX(3) + 168, 30], [LX(4), 30]] },
  ],
};

const steps = [
  { verb: 'MAP', title: 'Map', body: 'Your agent reads the code and produces a statechart. Every transition cites its source; the map carries a source hash.' },
  { verb: 'PROPOSE', title: 'Propose', body: 'Edit the graph visually or let the agent propose a change. Proposals are immutable.' },
  { verb: 'REVIEW', title: 'Review', body: 'The change appears as a visual diff on the PR. A human approves it.' },
  { verb: 'IMPLEMENT', title: 'Implement', body: 'The agent applies the approved change in source.' },
  { verb: 'VERIFY', title: 'Verify', body: 'Remap from source and compare. The verdict is matches or drifted.' },
];

const chipCls =
  'sp-mono inline-flex items-center gap-1.5 h-6 px-2 rounded-[calc(var(--sp-radius)-2px)] border text-[11.5px]';

export function Loop() {
  return (
    <Section id="loop" event="MAP">
      <SectionHeading
        title="How an agent's change gets reviewed."
        lede="Each step leaves something you can check: a map, a proposal, a visual diff, a code change, a verdict."
      />
      {/* The loop is one compound state, `review`, holding the five steps, the CI gate, and what we test. */}
      <div className="mt-12 rounded-md border-2 border-[var(--sp-node-stroke)]">
        <div className="px-3 py-2 text-[13px] font-semibold text-[var(--sp-fg)]">review</div>
        <div className="px-4 sm:px-6 pb-6 lg:pt-2">
          <div data-embed-slot="loop" className="hidden lg:block">
            <Statechart
              machine={loopMachine}
              label="The review loop as a statechart"
              className="w-full h-auto"
            />
          </div>
          <ol className="lg:mt-8 grid lg:grid-cols-5 gap-x-6 lg:gap-y-8">
            {steps.map((s, i) => (
              <li key={s.verb} className="min-w-0 flex flex-col">
                {/* Below lg the steps become a vertical chain of nodes. */}
                <Edge dir="down" label={s.verb} length={i === 0 ? 72 : 96} className="lg:hidden !ml-12" />
                <h3 className="max-lg:self-start max-lg:rounded-[5.2px] max-lg:border-2 max-lg:border-[var(--sp-node-stroke)] max-lg:bg-[var(--sp-node)] max-lg:px-3 max-lg:py-1.5 text-[16px] font-semibold text-[var(--sp-fg)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--sp-muted)]">{s.body}</p>
              </li>
            ))}
          </ol>
          {/* The CI gate runs on the PR: an edge drops from the Review column into the ci pane. */}
          <div className="mt-6 lg:grid lg:grid-cols-5 lg:gap-x-6">
            <Edge dir="down" label="GATE" length={96} className="lg:hidden !ml-12" />
            <Edge dir="down" label="GATE" length={96} className="hidden lg:flex lg:col-start-3" />
          </div>
          <div className="grid lg:grid-cols-5 gap-x-6 items-center">
            <Pane className="lg:col-span-3" title="ci gate" right={<span className="text-[var(--sp-muted-2)]">diff step</span>}>
              <div className="p-4 space-y-3">
                <code className="sp-mono block text-[12.5px] text-[var(--sp-fg)] whitespace-pre overflow-x-auto">
                  <span className="text-[var(--sp-muted-2)] select-none">$ </span>statelyai diff &lt;base&gt; &lt;head&gt; --fail-on-changes
                </code>
                <div className="flex flex-wrap gap-2">
                  <span className={`${chipCls} border-[var(--sp-success)]/40 text-[var(--sp-success)]`}>
                    <span className="inline-block size-1.5 rounded-full bg-current" />
                    no changes
                  </span>
                  <span className={`${chipCls} border-[var(--sp-warn)]/40 text-[var(--sp-warn)]`}>
                    <span className="inline-block size-1.5 rounded-full bg-current" />
                    changes
                  </span>
                </div>
              </div>
            </Pane>
            {/* RUN: the ci pane into what we test. Right on lg, down below. */}
            <div className="min-w-0 lg:col-span-2 flex flex-col lg:flex-row lg:items-center lg:-ml-6">
              <Edge dir="down" label="RUN" length={96} className="lg:hidden !ml-12" />
              <Edge dir="right" label="RUN" length={104} className="hidden lg:flex shrink-0" />
              <StateNode title={<h3 className={nodeTitleCls}>what we test</h3>} className="min-w-0 flex-1">
                <p className="px-3 pb-3 text-[14px] leading-relaxed text-[var(--sp-muted)]">
                  We run Claude Code and Codex through map, edit, apply, and
                  verify. In each run, every change is cited to its source and
                  checked by verify. <TextLink href="/docs/packages/mcp">MCP docs</TextLink>
                </p>
              </StateNode>
            </div>
          </div>
          <p className="mt-8 max-w-[44rem] text-[15px] leading-relaxed text-[var(--sp-muted)]">
            Runs over MCP, with the CLI for scan, push, pull, and diff. The editor is optional, and so is XState in your code.
          </p>
        </div>
      </div>
    </Section>
  );
}
