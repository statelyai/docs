// §4 The Stately loop: five steps as one machine, each with its artifact.
import { MachineCanvas } from '../MachineCanvas';
import { type Machine } from '../Statechart';
import { Edge, Pane, Section, SectionHeading } from '../shared';
import { TextLink } from './CopyLine';

const steps = [
  { verb: 'MAP', title: 'Map', state: 'mapped', artifact: 'statechart + sha', body: 'Your agent reads the code and produces a statechart. Every transition cites its source; the map carries a source hash.' },
  { verb: 'PROPOSE', title: 'Propose', state: 'proposed', artifact: 'proposal', body: 'Edit the graph visually or let the agent propose a change. Proposals are immutable.' },
  { verb: 'REVIEW', title: 'Review', state: 'approved', artifact: 'visual diff', body: 'The change appears as a visual diff on the PR. A human approves it.' },
  { verb: 'IMPLEMENT', title: 'Implement', state: 'implemented', artifact: 'source change', body: 'The agent applies the approved change in source.' },
  { verb: 'VERIFY', title: 'Verify', state: 'verified', artifact: 'verdict', body: 'Remap from source and compare. The verdict is matches or drifted.' },
];

// Hand-placed: entry edge (MAP) from the left, then 4 transitions.
const NW = 124;
const NH = 56;
const X0 = 72;
const STEP = 222;
const Y = 20;
const x = (i: number) => X0 + i * STEP;

const loopMachine: Machine = {
  w: x(4) + NW + 4,
  h: Y + NH + 20,
  nodes: steps.map((s, i) => ({
    id: s.state,
    label: s.state,
    x: x(i),
    y: Y,
    w: NW,
    evidence: s.artifact,
    final: i === steps.length - 1,
  })),
  edges: steps.map((s, i) => ({
    from: i === 0 ? 'source' : steps[i - 1].state,
    to: s.state,
    label: s.verb,
    accent: i === steps.length - 1,
    points: [
      [i === 0 ? 0 : x(i - 1) + NW, Y + NH / 2],
      [x(i), Y + NH / 2],
    ],
  })),
};

const chipCls =
  'sp-mono inline-flex items-center gap-1.5 h-6 px-2 rounded-[calc(var(--sp-radius)-2px)] border text-[11.5px]';

export function Loop() {
  return (
    <Section id="loop" event="MAP">
      <SectionHeading
        title="How an agent's change gets reviewed."
        lede="Each step leaves something you can check: a map, a proposal, a visual diff, a code change, a verdict."
      />
      {/* The loop is one compound state, `review`, holding the five steps and the CI gate. */}
      <div className="mt-12 rounded-md border-2 border-[var(--sp-node-stroke)]">
        <div className="px-3 py-2 text-[13px] font-semibold text-[var(--sp-fg)]">review</div>
        <div className="px-4 sm:px-6 pb-6 lg:pt-2">
          <div className="hidden lg:block" aria-hidden>
            <MachineCanvas slot="loop" machine={loopMachine} sim="approved" label="The review loop as a statechart: mapped, proposed, approved, implemented, verified" />
          </div>
          <ol className="lg:mt-8 grid lg:grid-cols-5 gap-x-6 lg:gap-y-8">
            {steps.map((s, i) => (
              <li key={s.verb} className="min-w-0 flex flex-col">
                {/* Below lg the machine row is hidden: the steps become a vertical chain. */}
                <Edge dir="down" label={s.verb} length={i === 0 ? 48 : 64} className="lg:hidden !ml-12" />
                <h3 className="max-lg:order-1 max-lg:self-start max-lg:rounded-md max-lg:border-2 max-lg:border-[var(--sp-node-stroke)] max-lg:bg-[var(--sp-node)] max-lg:px-3 max-lg:py-1.5 lg:mt-2 text-[16px] font-semibold text-[var(--sp-fg)]">
                  {s.title}
                </h3>
                <p className="max-lg:order-2 max-lg:mt-2 lg:order-first sp-mono text-[11.5px] uppercase tracking-[0.06em] text-[var(--sp-muted-2)]">
                  {String(i + 1).padStart(2, '0')} · {s.artifact}
                </p>
                <p className="max-lg:order-3 mt-2 text-[14px] leading-relaxed text-[var(--sp-muted)]">{s.body}</p>
              </li>
            ))}
          </ol>
          {/* VERIFY step gates CI: edge drops from the last step column into the ci pane. */}
          <div className="mt-6 lg:grid lg:grid-cols-5 lg:gap-x-6">
            <Edge dir="down" label="GATE" length={64} className="lg:hidden !ml-12" />
            <Edge dir="down" label="GATE" length={72} className="hidden lg:block lg:col-start-5" />
          </div>
          <div className="mt-1 grid lg:grid-cols-5 gap-x-6 gap-y-6 items-center">
            <Pane className="lg:col-start-3 lg:col-span-3 lg:row-start-1" title="ci gate" right={<span className="text-[var(--sp-muted-2)]">diff step</span>}>
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
            <p className="lg:col-start-1 lg:col-span-2 lg:row-start-1 text-[15px] leading-relaxed text-[var(--sp-muted)]">
              Runs over MCP, with the CLI for scan, push, pull, and diff. The editor is optional, and so is XState in your code.
            </p>
          </div>
        </div>
      </div>
      <Pane title="what we test" className="mt-12 max-w-[44rem]">
        <p className="p-5 text-[14px] leading-relaxed text-[var(--sp-muted)]">
          We run Claude Code and Codex through map, edit, apply, and verify. In
          each run, every change is cited to its source and checked by verify.{' '}
          <TextLink href="/docs/packages/mcp">MCP docs</TextLink>
        </p>
      </Pane>
    </Section>
  );
}
