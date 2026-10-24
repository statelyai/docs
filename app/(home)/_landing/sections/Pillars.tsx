// §6 What teams get: three pillars, each with one quiet statechart.
import { Statechart, type Machine } from '../Statechart';
import { Section, SectionHeading, parallelRegionCls } from '../shared';
import { TextLink } from './CopyLine';

const W = 96;
const H = 44;
// L-shaped 3-node chart: a → b (horizontal), b → c (vertical).
function lChart(a: string, b: string, c: string, ab: string, bc: string, finalC = true): Machine {
  return {
    w: 336,
    h: 174,
    nodes: [
      { id: a, label: a, x: 40, y: 20, w: W, h: H, initial: true },
      { id: b, label: b, x: 220, y: 20, w: W, h: H },
      { id: c, label: c, x: 220, y: 110, w: W, h: H, final: finalC },
    ],
    edges: [
      { from: a, to: b, label: ab, points: [[40 + W, 42], [220, 42]] },
      { from: b, to: c, label: bc, points: [[268, 20 + H], [268, 110]] },
    ],
  };
}

const languageChart = lChart('draft', 'review', 'live', 'SUBMIT', 'APPROVE');

const determinismChart: Machine = {
  w: 336,
  h: 174,
  nodes: [
    { id: 'pay', label: 'payment', x: 40, y: 20, w: W, h: H, initial: true },
    { id: 'ok', label: 'paid', x: 220, y: 20, w: W, h: H, final: true },
    { id: 'no', label: 'declined', x: 220, y: 110, w: W, h: H },
  ],
  edges: [
    { from: 'pay', to: 'ok', label: 'PAID', points: [[40 + W, 42], [220, 42]] },
    { from: 'pay', to: 'no', label: 'FAIL', points: [[88, 20 + H], [88, 132], [220, 132]], labelSeg: 1 },
  ],
};

// Inverted L: v14 drops to proposal, proposal runs right to v15.
const auditChart: Machine = {
  w: 336,
  h: 174,
  nodes: [
    { id: 'v14', label: 'v14', x: 40, y: 20, w: W, h: H, initial: true },
    { id: 'proposal', label: 'proposal', x: 40, y: 110, w: W, h: H },
    { id: 'v15', label: 'v15', x: 220, y: 110, w: W, h: H, final: true },
  ],
  edges: [
    { from: 'v14', to: 'proposal', label: 'PROPOSE', points: [[88, 20 + H], [88, 110]] },
    { from: 'proposal', to: 'v15', label: 'APPROVE', points: [[40 + W, 132], [220, 132]] },
  ],
};

const pillars = [
  {
    title: 'Review without reading the code',
    body: 'Product, QA, compliance, and agents read the same diagram, so nobody translates the code first.',
    chart: languageChart,
    caption: 'draft → review → live',
    href: '/docs/state-machines-and-statecharts',
    link: 'Statecharts',
  },
  {
    title: 'Paths you can run as tests',
    body: 'xstate/graph generates the shortest and simple paths through the machine, and you run them as model-based tests.',
    chart: determinismChart,
    caption: 'payment → paid | declined',
    href: '/docs/graph',
    link: 'Graph and paths',
  },
  {
    title: 'A record of every change',
    body: 'Each approved change becomes a version with its proposal, its review, and its verify result.',
    chart: auditChart,
    caption: 'v14 → v15',
    href: '/docs/versions',
    link: 'Versions',
  },
];

export function Pillars() {
  return (
    <Section id="pillars" event="VALUE">
      <SectionHeading title="What teams use the graph for." />
      {/* One parallel state: three orthogonal regions, dashed dividers. */}
      <div className="mt-12 rounded-md border-2 border-[var(--sp-node-stroke)]">
        <div className="px-3 py-2 text-[13px] font-semibold text-[var(--sp-fg)]">team</div>
        <div className="grid lg:grid-cols-3">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className={`min-w-0 px-5 pt-4 pb-6 lg:px-6 ${i > 0 ? `border-t lg:border-t-0 lg:border-l ${parallelRegionCls}` : ''}`}
          >
            <div aria-hidden>
              <Statechart machine={p.chart} showEvidence={false} className="w-full h-auto max-w-[22rem]" />
            </div>
            <p className="sp-mono text-[11px] text-[var(--sp-muted-2)] mt-2">{p.caption}</p>
            <h3 className="mt-5 text-[17px] font-semibold text-[var(--sp-fg)]">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--sp-muted)]">{p.body}</p>
            <p className="mt-3 text-[14px]">
              <TextLink href={p.href}>{p.link}</TextLink>
            </p>
          </div>
        ))}
        </div>
      </div>
    </Section>
  );
}
