// §10 Pricing teaser. Tiers and lines mirror app/(home)/pricing/page.tsx.
import Link from 'next/link';
import { Statechart, type Machine } from '../Statechart';
import { DataTable, Section, SectionHeading } from '../shared';
import { stackOn3, textLinkCls } from '../classes';
import { DEMO_URL, NewTab } from '../lib';

const cell = (s: React.ReactNode) => <span className="text-[13px] leading-snug block">{s}</span>;
const price = (main: string, sub?: string) => (
  <span className="block whitespace-nowrap">
    <span className="text-[var(--sp-fg)]">{main}</span>
    {sub && <span className="block text-[12px] text-[var(--sp-muted-2)]">{sub}</span>}
  </span>
);

const tiers: [string, React.ReactNode, string][] = [
  ['Community', price('$0'), 'Editor and code export, 2 projects, 3 machines.'],
  ['Pro', price('$39 / mo', '$399 / yr'), 'Private projects, AI generation, code sync.'],
  ['Team', price('$199 / mo', '$167 / mo billed yearly'), 'Pro for up to 10 people.'],
  [
    'Enterprise',
    <a key="demo" href={DEMO_URL} target="_blank" rel="noopener noreferrer" className={`whitespace-nowrap ${textLinkCls}`}>
      Book a demo
      <NewTab />
    </a>,
    'Cloud or self-hosted, SSO, audit logs, priority support.',
  ],
];

// The tiers as one chain of states; evidence lines match the table.
const NW = 170;
const NH = 57;
const X0 = 28;
const STEP = NW + 150;
const Y = 8;
const tierChain: [string, string, string][] = [
  ['Community', '$0', 'UPGRADE'],
  ['Pro', '$39/mo', 'ADD_SEATS'],
  ['Team', '$199/mo', 'CONTACT'],
  ['Enterprise', 'book a demo', ''],
];
const tierMachine: Machine = {
  w: X0 + 3 * STEP + NW + 4,
  h: Y + NH + 8,
  nodes: tierChain.map(([label, evidence], i) => ({
    id: label,
    label,
    evidence,
    x: X0 + i * STEP,
    y: Y,
    w: NW,
    initial: i === 0,
    final: i === tierChain.length - 1,
  })),
  edges: tierChain.slice(0, -1).map(([label, , event], i) => ({
    from: label,
    to: tierChain[i + 1][0],
    label: event,
    points: [
      [X0 + i * STEP + NW, Y + NH / 2],
      [X0 + (i + 1) * STEP, Y + NH / 2],
    ],
  })),
};

export function PricingTeaser() {
  return (
    <Section id="pricing" event="UPGRADE">
      <SectionHeading
        title="Start free."
        lede="Community includes 2 projects and 3 machines. Pro adds private projects, AI generation, and code sync. Team shares it with up to 10 people. Enterprise runs on your infrastructure."
      />
      <div aria-hidden className="mt-12 hidden lg:block">
        <Statechart machine={tierMachine} className="w-full h-auto max-w-[64rem]" />
      </div>
      <DataTable
        className={`mt-12 lg:mt-8 ${stackOn3}`}
        head={['Plan', 'Includes', 'Price']}
        rows={tiers.map(([n, p, f]) => [n, <span key="f" className="block sm:min-w-[16rem]">{cell(f)}</span>, p])}
      />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link href="/pricing" className="sp-btn sp-btn-outline">
          See pricing
        </Link>
        <Link href="/registry/signup" className="sp-btn sp-btn-outline">
          Start free
        </Link>
      </div>
    </Section>
  );
}
