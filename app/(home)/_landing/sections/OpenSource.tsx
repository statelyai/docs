'use client';
// §7 Open source anchor: XState install, packages with stability, when to use,
// plus XState users (logos are old page assets) and permitted testimonials.
import { DataTable, Edge, Pane, Section, SectionHeading, Stability } from '../shared';
import { Chip, CopyLine, TextLink, stackOn3 } from './CopyLine';

type Level = 'stable' | 'beta' | 'alpha';
const packages: [string, string, Level][] = [
  ['xstate', 'v5 · state machines, statecharts, and actors', 'stable'],
  ['xstate', 'v6 · next major', 'alpha'],
  ['@xstate/store', 'small event-driven store', 'stable'],
  ['@xstate/graph', 'paths, shortest paths, and adjacency over any machine', 'stable'],
  ['@xstate/test', 'model-based tests from the graph', 'stable'],
  ['@statelyai/agent', 'agents whose decisions run through a state machine', 'alpha'],
];

const use = [
  'Multi-step flows',
  'Async orchestration',
  'Anything with modes, retries, or timeouts',
  'Behavior that must be reviewed',
];
const skip = ['A single boolean', 'Pure derived state', 'Forms with no sequencing'];

const companies = [
  { name: 'AWS', src: '/landing-page/assets/aws.svg', width: 65 },
  { name: 'Netflix', src: '/landing-page/assets/netflix.svg', width: 122 },
  { name: 'Lyft', src: '/landing-page/assets/lyft.svg', width: 58 },
  { name: 'Microsoft', src: '/landing-page/assets/microsoft.svg', width: 154 },
  { name: 'Epic Games', src: '/landing-page/assets/epic-games.svg', width: 45 },
  { name: 'Cisco', src: '/landing-page/assets/cisco.svg', width: 74 },
];

const quotes = [
  {
    quote:
      'We use XState to implement business workflows as statecharts. The visualizer helps us collaborate more closely with customers, the ability to externalize workflows as JSON configuration makes complex workflow changes surprisingly simple to roll out, and test case generation makes it easier than ever to move forward with confidence. XState makes it all possible!',
    name: 'James Tharpe',
    company: 'T-Mobile',
    avatar: '/landing-page/assets/james.png',
  },
  {
    quote:
      "XState naturally separates the logic and makes it simple to mock out API calls, so it's easier to test the code and organize it!",
    name: 'Presley Pizzo',
    company: 'Coder',
    avatar: '/landing-page/assets/presley.png',
  },
  {
    quote:
      'Advantages of XState: Visually clear view of the code flow, code reusability, test coverage, easy to debug/ spot bugs, code scalability & maintenance, and better code design & planning.',
    name: 'Maya Shavin',
    company: 'Microsoft',
    avatar: '/landing-page/assets/maya.png',
  },
];

function List({ title, items, mark }: { title: string; items: string[]; mark: string }) {
  return (
    <div>
      <p className="sp-mono text-[11px] uppercase tracking-[0.06em] text-[var(--sp-muted)] mb-3">{title}</p>
      <ul className="space-y-2 text-[15px] text-[var(--sp-fg)]">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="sp-mono text-[var(--sp-muted-2)] select-none w-3 shrink-0">{mark}</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OpenSource() {
  return (
    <Section id="xstate" event="BUILD">
      <SectionHeading
        title="Build with XState."
        lede={
          <>
            XState runs the machine you reviewed, in the browser or on Node.
            MIT licensed,{' '}
            <TextLink href="https://github.com/statelyai/xstate">on GitHub</TextLink>.
          </>
        }
      />
      <div className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start">
        <div className="min-w-0 space-y-6">
          <Pane title="install" right={<Stability level="stable" />}>
            <div className="p-4">
              <CopyLine text="npm install xstate" />
              <div className="mt-4 flex flex-wrap gap-2">
                {['React', 'Vue', 'Svelte', 'Solid'].map((f) => (
                  <Chip key={f}>{f}</Chip>
                ))}
              </div>
            </div>
          </Pane>
          <DataTable
            className={stackOn3}
            head={['Package', 'What it is', 'Stability']}
            rows={packages.map(([name, what, level]) => [
              <code key="n" className="sp-mono text-[12px] font-normal">{name}</code>,
              <span key="w" className="text-[13px] leading-snug block sm:min-w-[12rem]">{what}</span>,
              <span key="s" className="whitespace-nowrap"><Stability level={level} /></span>,
            ])}
          />
        </div>
        <div className="my-1 lg:my-0 lg:mx-1 lg:mt-[11px]">
          <Edge dir="down" label="INSPECT" length={76} className="lg:hidden" />
          <Edge dir="right" label="INSPECT" length={128} className="hidden lg:block" />
        </div>
        <div className="min-w-0 space-y-10">
          <Pane title="inspector">
            <div className="p-5">
              <p className="text-[16px] font-semibold text-[var(--sp-fg)]">
                Inspect a running XState app.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--sp-muted)]">
                Attach the inspector to a running app and watch states,
                events, and actors as they happen.
              </p>
              <a href="/docs/inspector" className="sp-btn sp-btn-outline mt-5">
                Open the inspector docs
              </a>
            </div>
          </Pane>
          <div className="grid sm:grid-cols-2 gap-8">
            <List title="Use it for" items={use} mark="+" />
            <List title="Skip it for" items={skip} mark="−" />
          </div>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-[var(--sp-border)]">
        <p className="sp-mono text-[11px] text-[var(--sp-muted-2)]">XState is used by engineers at</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6 sm:gap-x-14">
          {companies.map((c) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={c.name}
              src={c.src}
              alt={c.name}
              width={c.width}
              className="h-10 sm:h-12 w-auto opacity-50"
            />
          ))}
        </div>
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-6 items-start">
        {quotes.map((t) => (
          <Pane key={t.name}>
            <figure className="p-5">
              <blockquote className="text-[14px] leading-relaxed text-[var(--sp-fg)]">{t.quote}</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.avatar} alt="" width={36} height={36} className="size-9 rounded-full" />
                <span className="text-[13px] leading-tight">
                  <span className="block font-medium text-[var(--sp-fg)]">{t.name}</span>
                  <span className="block text-[var(--sp-muted-2)]">{t.company}</span>
                </span>
              </figcaption>
            </figure>
          </Pane>
        ))}
      </div>
    </Section>
  );
}
