// §9 Enterprise & trust. No price.
import { DEMO_URL, NewTab } from '../lib';
import { Pane, Section, SectionHeading } from '../shared';

const facts = [
  { k: 'Self-hosted', v: 'Run Stately inside your infrastructure. With AI features and hosted comments turned off, no traffic leaves your network.' },
  { k: 'SSO', v: 'Single sign-on through your identity provider, with audit logs.' },
  { k: 'Models in your git', v: 'Keep machines as files in your repo with CLI sync, so they are versioned and reviewed like code.' },
  { k: 'SCXML export', v: 'The W3C statechart standard, for non-JS execution targets.' },
];

const audit = [
  'Versioned behavior records',
  'Immutable proposals with review trail',
  'Verify verdicts',
  'SCXML export',
];

export function Enterprise() {
  return (
    <Section id="enterprise" event="DEPLOY_PRIVATE">
      <SectionHeading
        title="Run Stately inside your network."
        lede="For teams whose changes need an auditor's sign-off."
      />
      <div className="mt-12 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-16 items-start">
        <dl className="border-t border-[var(--sp-border)]">
          {facts.map((f) => (
            <div key={f.k} className="grid sm:grid-cols-[11rem_minmax(0,1fr)] gap-x-6 gap-y-1 py-4 border-b border-[var(--sp-border)]">
              <dt className="text-[15px] font-semibold text-[var(--sp-fg)]">{f.k}</dt>
              <dd className="text-[15px] leading-relaxed text-[var(--sp-muted)]">{f.v}</dd>
            </div>
          ))}
        </dl>
        <div className="min-w-0">
          <Pane title="self-hosted">
            <pre className="sp-mono px-4 py-3 text-[12.5px] leading-[1.7] text-[var(--sp-fg)] overflow-x-auto">
              {'AI_ENABLED=false\n'}
              <span className="text-[var(--sp-muted)]">{'# hosted comments off\n# no traffic leaves your network'}</span>
            </pre>
          </Pane>
          <h3 className="mt-6 text-[14px] font-semibold text-[var(--sp-fg)]">What an audit gets</h3>
          <ul className="mt-2 text-[14px] leading-relaxed text-[var(--sp-muted)] divide-y divide-[var(--sp-border)]">
            {audit.map((a) => (
              <li key={a} className="py-1.5">{a}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10">
        <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="sp-btn sp-btn-outline">
          Book a demo
          <NewTab />
        </a>
      </div>
    </Section>
  );
}
