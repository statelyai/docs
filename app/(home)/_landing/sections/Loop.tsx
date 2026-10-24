'use client';
// §4 The Stately loop: five steps as one machine, each with its artifact.
import { Statechart, type Machine } from '../Statechart';
import { Edge, Pane, Section, SectionHeading } from '../shared';
import { TextLink } from './CopyLine';

const steps = [
  { verb: 'MAP', title: 'Map', state: 'mapped', artifact: 'statechart + sha', body: 'Your agent or the CLI reads the code and produces a statechart. Every transition cites its source; the map carries a source hash.' },
  { verb: 'PROPOSE', title: 'Propose', state: 'proposed', artifact: 'proposal', body: 'Edit the graph visually or let the agent propose a change. Proposals are immutable.' },
  { verb: 'REVIEW', title: 'Review', state: 'approved', artifact: 'visual diff', body: 'The change appears as a visual diff on the PR. A human approves it.' },
  { verb: 'IMPLEMENT', title: 'Implement', state: 'implemented', artifact: 'source change', body: 'The agent applies the approved change in source.' },
  { verb: 'VERIFY', title: 'Verify', state: 'verified', artifact: 'matches | drifted', body: 'Remap from source and compare. The verdict is matches or drifted.' },
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

export function Loop() {
  return (
    <Section id="loop" event="HOW">
      <SectionHeading
        title="How an agent's change gets reviewed."
        lede="Each step leaves something you can check: a map, a proposal, a visual diff, a code change, a verdict."
      />
      <div className="mt-12 hidden lg:block" aria-hidden>
        <Statechart machine={loopMachine} className="w-full h-auto" />
      </div>
      <ol className="mt-10 lg:mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8">
        {steps.map((s, i) => (
          <li key={s.verb} className="border-t border-[var(--sp-border)] pt-4 lg:border-t-0 lg:pt-0">
            <p className="sp-mono text-[11px] uppercase tracking-[0.06em] text-[var(--sp-muted-2)]">
              {String(i + 1).padStart(2, '0')} · {s.artifact}
            </p>
            <h3 className="mt-2 text-[16px] font-semibold text-[var(--sp-fg)]">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--sp-muted)]">{s.body}</p>
          </li>
        ))}
      </ol>
      {/* VERIFY step gates CI: edge drops from the last step column into the ci pane. */}
      <div className="mt-8 lg:mt-6 lg:grid lg:grid-cols-5 lg:gap-x-6">
        <Edge dir="down" length={40} className="lg:hidden" />
        <Edge dir="down" label="GATE" length={72} className="hidden lg:block lg:col-start-5" />
      </div>
      <div className="mt-1 grid lg:grid-cols-5 gap-x-6 gap-y-6 items-center">
        <Pane className="lg:col-start-3 lg:col-span-3 lg:row-start-1" title="ci" right={<span className="text-[var(--sp-muted-2)]">verify step</span>}>
          <div className="p-4 space-y-3">
            <code className="sp-mono block text-[12.5px] text-[var(--sp-fg)] whitespace-pre overflow-x-auto">
              <span className="text-[var(--sp-muted-2)] select-none">$ </span>statelyai diff --fail-on-changes
            </code>
            <div className="flex flex-wrap gap-2">
              <span className="sp-mono inline-flex items-center gap-1.5 h-6 px-2 rounded-[calc(var(--sp-radius)-2px)] border border-[var(--sp-success)]/40 text-[11px] text-[var(--sp-success)]">
                <span className="inline-block size-1.5 rounded-full bg-current" />
                matches
              </span>
              <span className="sp-mono inline-flex items-center gap-1.5 h-6 px-2 rounded-[calc(var(--sp-radius)-2px)] border border-[var(--sp-warn)]/40 text-[11px] text-[var(--sp-warn)]">
                <span className="inline-block size-1.5 rounded-full bg-current" />
                drifted
              </span>
            </div>
          </div>
        </Pane>
        <p className="lg:col-start-1 lg:col-span-2 lg:row-start-1 text-[15px] leading-relaxed text-[var(--sp-muted)]">
          Runs from the CLI or MCP. The editor is optional, and so is XState in your code.
        </p>
      </div>
      <Pane title="what we test" className="mt-12 max-w-[44rem]">
        <div className="p-5">
          <p className="text-[15px] leading-relaxed text-[var(--sp-fg)]">
            We run Claude Code and Codex through map, edit, apply, and verify,
            and keep the runs.
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--sp-muted)]">
            What we claim from that: each change is cited to its source and
            checked by verify. We do not claim agents make fewer mistakes with
            Stately.
          </p>
          <p className="mt-4 text-[14px]">
            <TextLink href="/docs/packages/mcp">MCP docs</TextLink>
          </p>
        </div>
      </Pane>
    </Section>
  );
}
