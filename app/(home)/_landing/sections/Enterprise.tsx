// §9 Enterprise & trust. No price.
import { DEMO_URL, NewTab } from '../lib';
import { Pane, Section, SectionHeading } from '../shared';
import { TextLink } from './CopyLine';

const bullets = [
  'Self-host the editor on your own network. No database required.',
  'Sign in through your identity provider: an SSO proxy or your OAuth issuer.',
  'Turn AI off with one flag. No traffic leaves your network.',
  'The same REST API and MCP endpoint on your host.',
  'Commercial license, with MIT-licensed SDK and CLI.',
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
        title="Enterprise-ready."
        lede="Self-host it, sign in through your identity provider, and keep the model inside your boundary."
      />
      <div className="mt-12 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 lg:gap-16 items-start">
        <ul className="border-t border-[var(--sp-border)]">
          {bullets.map((b) => (
            <li key={b} className="py-4 border-b border-[var(--sp-border)] text-[15px] leading-relaxed text-[var(--sp-fg)]">
              {b}
            </li>
          ))}
        </ul>
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
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="sp-btn sp-btn-primary !min-h-12 !px-6 !text-[15px]">
          Book a demo
          <NewTab />
        </a>
        <span className="text-[14px] font-medium">
          <TextLink href="/docs/self-hosting">Self-hosting guide</TextLink>
        </span>
      </div>
    </Section>
  );
}
