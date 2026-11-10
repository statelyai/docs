// §4 The Stately loop: five states inside the `review` compound state, joined
// by real EdgeLayer edges. A zigzag on lg (five columns, labels in the empty
// cells), a vertical chain below. The CI gate hangs off Verified.
import { EdgeLayer, type EdgeSpec } from '../EdgeLayer';
import { nodeTitleCls } from '../classes';
import { Section, SectionHeading, StateNode } from '../shared';
import { TextLink } from './CopyLine';

const states = [
  { id: 'mapped', title: 'Mapped', body: 'A statechart drawn from the code, with a file and line cited for every transition.', artifact: 'statechart + source hash', cell: 'lg:col-start-1 lg:row-start-2' },
  { id: 'proposed', title: 'Proposed', body: 'An edit to the graph, made in the editor or over MCP. It is never altered once saved.', artifact: 'immutable proposal', cell: 'lg:col-start-2 lg:row-start-1' },
  { id: 'approved', title: 'Approved', body: 'A reviewer reads the visual diff on the PR and signs off.', artifact: 'visual diff + sign‑off', cell: 'lg:col-start-3 lg:row-start-2' },
  { id: 'implemented', title: 'Implemented', body: 'The approved edit, written into the source.', artifact: 'commit', cell: 'lg:col-start-4 lg:row-start-1' },
  { id: 'verified', title: 'Verified', body: 'The source is read again and compared with the approved graph.', artifact: 'matches | drifted', cell: 'lg:col-start-5 lg:row-start-2', final: true },
];

const chain: EdgeSpec[] = [
  { id: 'maps', from: 'loop-start', to: 'mapped', label: 'AGENT_MAPS', color: 'purple' },
  { id: 'propose', from: 'mapped', to: 'proposed', label: 'PROPOSE_CHANGE', color: 'blue' },
  { id: 'approve', from: 'proposed', to: 'approved', label: 'HUMAN_APPROVES', color: 'green' },
  { id: 'implement', from: 'approved', to: 'implemented', label: 'AGENT_IMPLEMENTS', color: 'purple' },
  { id: 'verify', from: 'implemented', to: 'verified', label: 'VERIFY', color: 'orange' },
  { id: 'gate', from: 'verified', to: 'ci-gate', label: 'GATE', color: 'yellow' },
  { id: 'run', from: 'ci-gate', to: 'what-we-test', label: 'RUN', color: 'green' },
];
// lg zigzag: out of each node's right side, into the next one's bottom (row 1) or top (row 2).
const zigzag: EdgeSpec[] = chain.map((e, i) =>
  i >= 1 && i <= 4 ? { ...e, fromSide: 'right', toSide: i % 2 ? 'bottom' : 'top' } : e,
);

const chipCls =
  'sp-mono inline-flex items-center gap-1.5 h-6 px-2 rounded-[calc(var(--sp-radius)-2px)] border text-[11.5px]';

export function Loop() {
  return (
    <Section id="loop" event="MAP" color="purple">
      <SectionHeading
        title="How an agent's change gets reviewed."
        lede="Each state leaves something you can check: a map, a proposal, a visual diff, a code change, a verdict."
      />
      {/* One compound state, `review`: the five states, the CI gate, and what we test. */}
      <div className="mt-12 rounded-md border-2 border-[var(--sp-node-stroke)]">
        <div className="px-3 py-2 text-[13px] font-semibold text-[var(--sp-fg)]">review</div>
        <div className="relative px-4 sm:px-6 pb-6 pt-2 flex flex-col gap-[88px] lg:grid lg:grid-cols-5 lg:gap-x-6 lg:gap-y-12">
          {/* Initial pseudo-state: AGENT_MAPS leaves it into Mapped. */}
          <span data-edge-id="loop-start" aria-hidden className="self-center block size-2 rounded-full bg-[var(--sp-edge)] lg:col-start-1 lg:row-start-1 lg:self-start lg:justify-self-center lg:mt-2" />
          {states.map((s) => (
            <div key={s.id} data-edge-id={s.id} className={`min-w-0 ${s.cell}`}>
              <StateNode final={s.final} title={<h3 className={nodeTitleCls}>{s.title}</h3>} className="h-full">
                <p className="px-3 text-[13px] leading-snug text-[var(--sp-muted)]">{s.body}</p>
                <p className="sp-mono px-3 pt-2 pb-3 text-[12px] text-[var(--sp-fg)] opacity-80">{s.artifact}</p>
              </StateNode>
            </div>
          ))}
          <div data-edge-id="ci-gate" className="min-w-0 lg:col-start-4 lg:col-span-2 lg:row-start-3 lg:mt-12">
            <StateNode title={<h3 className={nodeTitleCls}>CI gate</h3>} className="h-full">
              <p className="px-3 text-[13px] leading-snug text-[var(--sp-muted)]">The diff step fails the build when the behavior changed.</p>
              <code className="sp-mono block px-3 pt-2 text-[12px] text-[var(--sp-fg)] opacity-80 whitespace-pre-wrap break-words">
                <span className="text-[var(--sp-muted-2)] select-none">$ </span>statelyai diff &lt;base&gt; &lt;head&gt; --fail-on-changes
              </code>
              <div className="flex flex-wrap gap-2 px-3 pt-2 pb-3">
                <span className={`${chipCls} border-[var(--sp-success)]/40 text-[var(--sp-success)]`}>no changes</span>
                <span className={`${chipCls} border-[var(--sp-warn)]/40 text-[var(--sp-warn)]`}>changes</span>
              </div>
            </StateNode>
          </div>
          <div data-edge-id="what-we-test" className="min-w-0 lg:col-start-1 lg:col-span-2 lg:row-start-3 lg:mt-12">
            <StateNode title={<h3 className={nodeTitleCls}>What we test</h3>} className="h-full">
              <p className="px-3 pb-3 text-[14px] leading-relaxed text-[var(--sp-muted)]">
                We run Claude Code and Codex through map, edit, and apply. Each
                change carries source citations. A trusted execution host can
                also run verify. <TextLink href="/docs/packages/mcp">MCP docs</TextLink>
              </p>
            </StateNode>
          </div>
          <EdgeLayer edges={chain} className="lg:hidden" />
          <EdgeLayer edges={zigzag} className="hidden lg:block" />
        </div>
        <p className="px-4 sm:px-6 pb-6 max-w-[48rem] text-[15px] leading-relaxed text-[var(--sp-muted)]">
          Runs over MCP, with the CLI for scan, push, pull, and diff. The editor is optional, and so is XState in your code.
        </p>
      </div>
    </Section>
  );
}
