// §10 Pricing teaser. Tiers and lines mirror app/(home)/pricing/page.tsx.
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Statechart, type Machine } from '../Statechart';
import { DataTable, Section, SectionHeading } from '../shared';
import { stackOn3, textLinkCls } from '../classes';
import { DEMO_URL, NewTab } from '../lib';

const price = (main: string, sub?: string) => (
  <span className="block whitespace-nowrap">
    <span className="text-[var(--sp-fg)]">{main}</span>
    {sub && <span className="block text-[12px] text-[var(--sp-muted-2)]">{sub}</span>}
  </span>
);

/** The plan's features, as on /pricing: one line each, the ones people upgrade for first. */
const features = (items: string[]) => (
  <ul className="sm:min-w-[18rem] space-y-1 text-[13px] leading-snug">
    {items.map((f) => (
      <li key={f} className="flex gap-2">
        <Check size={14} strokeWidth={2.5} aria-hidden className="mt-[2px] shrink-0 text-[var(--sp-sim)]" />
        <span>{f}</span>
      </li>
    ))}
  </ul>
);

const tiers: [string, React.ReactNode, string[]][] = [
  ['Community', price('$0'), ['Editor and simulation', 'Export to JavaScript and TypeScript', '2 projects, 3 machines']],
  [
    'Pro',
    price('$39 / mo', '$33 / mo billed yearly'),
    ['Unlimited private projects', 'AI generation, 1,000 a month', 'Codebase sync via GitHub or the CLI', 'Version history and live simulation', 'Figma embeds, colored states'],
  ],
  ['Team', price('$199 / mo', '$167 / mo billed yearly'), ['Everything in Pro for up to 10 people', 'Shared team projects', 'Admins, editors, and unlimited viewers']],
  [
    'Enterprise',
    <a key="demo" href={DEMO_URL} target="_blank" rel="noopener noreferrer" className={`whitespace-nowrap ${textLinkCls}`}>
      Book a demo
      <NewTab />
    </a>,
    ['Cloud or self-hosted, custom server locations', 'SSO and audit logs', 'Custom export formats and effect collections', 'Embed Stately in your own apps', 'Dedicated priority support'],
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
        lede="Community is the editor, simulation, and code export. Pro adds private projects, AI generation, and codebase sync. Team shares all of it with up to 10 people. Enterprise runs where you need it to."
      />
      <div aria-hidden className="mt-12 hidden lg:block">
        <Statechart machine={tierMachine} className="w-full h-auto max-w-[64rem]" />
      </div>
      <DataTable
        className={`mt-12 lg:mt-8 ${stackOn3}`}
        head={['Plan', 'Features', 'Price']}
        rows={tiers.map(([n, p, f]) => [n, features(f), p])}
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
