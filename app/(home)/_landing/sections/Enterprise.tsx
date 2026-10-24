// §8 Enterprise & trust. No price.
import { Section, SectionHeading } from '../shared';

const facts = [
  { k: 'Self-hosted', v: 'Run Stately inside your infrastructure. With AI features and hosted comments turned off, no traffic leaves your network.' },
  { k: 'SSO', v: 'Single sign-on through your identity provider, with audit logs.' },
  { k: 'Models in your git', v: 'Keep machines as files in your repo with CLI sync, so they are versioned and reviewed like code.' },
  { k: 'SCXML export', v: 'The W3C statechart standard, for non-JS execution targets.' },
];

export function Enterprise() {
  return (
    <Section id="enterprise" event="SCALE">
      <SectionHeading
        title="Run Stately inside your network."
        lede="For teams whose changes need an auditor's sign-off."
      />
      <dl className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
        {facts.map((f) => (
          <div key={f.k} className="border-t border-[var(--sp-border-strong)] pt-4">
            <dt className="text-[15px] font-semibold text-[var(--sp-fg)]">{f.k}</dt>
            <dd className="mt-2 text-[15px] leading-relaxed text-[var(--sp-muted)]">{f.v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-10">
        <a
          href="https://cal.com/statelyai/enterprise-calls"
          target="_blank"
          rel="noreferrer"
          className="sp-btn sp-btn-outline"
        >
          Talk to us
        </a>
      </div>
    </Section>
  );
}
