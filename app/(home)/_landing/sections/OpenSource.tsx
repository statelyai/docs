// §8 Open source anchor: XState facts, install, one package line,
// plus XState users (logos are old page assets) and permitted testimonials.
import { xstateFacts } from '../facts';
import { EdgeLayer } from '../EdgeLayer';
import { Pane, Section, SectionHeading, Stability } from '../shared';
import { Chip, CopyLine } from './CopyLine';

// Logos are white-filled SVGs; drawn as masks so they take the theme's ink.
// w/h: the SVG's intrinsic size, so each keeps its aspect at 32px tall.
const companies = [
  { name: 'AWS', src: '/landing-page/assets/aws.svg', w: 335 },
  { name: 'Netflix', src: '/landing-page/assets/netflix.svg', w: 630 },
  { name: 'Lyft', src: '/landing-page/assets/lyft.svg', w: 297 },
  { name: 'Microsoft', src: '/landing-page/assets/microsoft.svg', w: 796 },
  { name: 'Epic Games', src: '/landing-page/assets/epic-games.svg', w: 234 },
  { name: 'Cisco', src: '/landing-page/assets/cisco.svg', w: 380 },
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
];

function Quote({ t }: { t: (typeof quotes)[number] }) {
  return (
    <figure className="border-t border-[var(--sp-border)] pt-5">
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
  );
}

export function OpenSource() {
  return (
    <Section id="xstate" event="BUILD">
      <SectionHeading
        title="Built on XState."
        lede="The open-source state machine library under every Stately diagram. It runs the machine you reviewed, in the browser or on Node, MIT licensed."
      />
      <dl className="mt-12 grid grid-cols-2 lg:grid-cols-4 rounded-[var(--sp-radius)] border border-[var(--sp-border)] overflow-hidden">
        {xstateFacts.map((f, i) => (
          <div
            key={f.label}
            title={`${f.source} · as of ${f.asOf}`}
            className={`flex flex-col-reverse justify-end px-4 py-4 sm:px-5 border-[var(--sp-border)] ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
          >
            <dt className="mt-1 text-[13px] text-[var(--sp-muted)]">{f.label}</dt>
            <dd className="text-[30px] leading-none font-semibold tracking-tight tabular-nums text-[var(--sp-sim)]">{f.value}</dd>
          </div>
        ))}
      </dl>
      {/* lg: install | INSPECT | inspector, with the quotes and logos in a second row. Below lg the two panes stack first, so the edge spans only the gap. */}
      <div className="relative mt-8 grid gap-y-6 lg:grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)] items-start">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <div data-edge-id="xstate-install">
          <Pane title="install" right={<Stability level="stable" />}>
            <div className="px-4 pt-1 pb-4">
              <CopyLine flush text="npm install xstate" />
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--sp-muted)]">
                For multi-step flows, async orchestration, retries and timeouts,
                and any behavior that must be reviewed.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['React', 'Vue', 'Svelte', 'Solid'].map((f) => (
                  <Chip key={f} className="!border-[var(--sp-sim)]/50">{f}</Chip>
                ))}
              </div>
            </div>
          </Pane>
          </div>
        </div>
        <div className="h-[56px] lg:h-auto lg:col-start-2 lg:row-start-1" aria-hidden />
        <div className="min-w-0 lg:col-start-3 lg:row-start-1">
          <div data-edge-id="xstate-inspector">
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
          </div>
        </div>
        <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-2">
          <p className="sp-mono text-[12px] text-[var(--sp-muted)]">
            xstate 5 · xstate/graph · @xstate/store · xstate 6 <span className="text-[var(--sp-warn)]">alpha</span>
          </p>
          <Quote t={quotes[1]} />
          <div className="border-t border-[var(--sp-border)] pt-5">
            <p className="sp-mono text-[11.5px] text-[var(--sp-muted-2)]">XState is used by engineers at</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
              {companies.map((c) => (
                <span
                  key={c.name}
                  role="img"
                  aria-label={c.name}
                  className="block h-8 bg-[var(--sp-muted)]"
                  style={{
                    width: Math.round((c.w * 32) / 330),
                    mask: `url(${c.src}) center / contain no-repeat`,
                    WebkitMask: `url(${c.src}) center / contain no-repeat`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="min-w-0 lg:col-start-3 lg:row-start-2">
          <Quote t={quotes[0]} />
        </div>
        <EdgeLayer decorative edges={[{ id: 'inspect', from: 'xstate-install', to: 'xstate-inspector', label: 'INSPECT' }]} />
      </div>
    </Section>
  );
}
