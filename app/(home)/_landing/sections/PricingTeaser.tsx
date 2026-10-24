// §10 Pricing teaser. Tiers and lines mirror app/(home)/pricing/page.tsx.
import Link from 'next/link';
import { Statechart, type Machine } from '../Statechart';
import { DataTable, Section, SectionHeading } from '../shared';
import { stackOn3 } from '../classes';

const cell = (s: React.ReactNode) => <span className="text-[13px] leading-snug block">{s}</span>;
const price = (main: string, sub?: string) => (
  <span className="block whitespace-nowrap">
    <span className="text-[var(--sp-fg)]">{main}</span>
    {sub && <span className="block text-[12px] text-[var(--sp-muted-2)]">{sub}</span>}
  </span>
);

const tiers: [string, React.ReactNode, string][] = [
  ['Community', price('$0', 'free'), 'Editor and code export, 2 projects, 3 machines.'],
  ['Pro', price('$33 / mo', 'annual · $39 monthly'), 'Private projects, version history, live simulation, codebase sync.'],
  ['Team', price('$167 / mo', 'annual · $199 monthly'), 'Pro for up to 10 members, shared projects.'],
  ['Enterprise', price('Contact us'), 'Cloud or self-hosted, SSO, audit logs, priority support.'],
];

// The tiers as one chain of states; evidence lines match the table.
const NW = 120;
const NH = 56;
const X0 = 40;
const STEP = NW + 140;
const Y = 8;
const tierChain: [string, string, string][] = [
  ['Community', '$0', 'UPGRADE'],
  ['Pro', '$33/mo', 'ADD_SEATS'],
  ['Team', '$167/mo', 'CONTACT'],
  ['Enterprise', 'contact us', ''],
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
    <Section id="pricing" event="PRICE">
      <SectionHeading
        title="XState is free. The editor starts free."
        lede="XState and the open-source packages are free, and the editor has a free Community plan. Pro and Team add private projects, version history, and team features. Enterprise adds self-hosting, SSO, and audit logs."
      />
      <div aria-hidden className="mt-12 hidden lg:block">
        <Statechart machine={tierMachine} className="w-full h-auto max-w-[60rem]" />
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
        <Link href="/registry/signup" className="sp-btn text-[var(--sp-muted)] hover:text-[var(--sp-fg)]">
          Start free
        </Link>
      </div>
    </Section>
  );
}
