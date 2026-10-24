// §12 Final CTA and machine-readable resources.
import Link from 'next/link';
import { FinalFrame, InstallPill, Pane, Transition } from '../shared';
import { TextLink } from './CopyLine';

const resources: [string, string, string | null][] = [
  ['/llms.txt', 'Site summary for agents', '/llms.txt'],
  ['/llms-full.txt', 'Full docs as plain text', '/llms-full.txt'],
  ['https://mcp.stately.ai/mcp', 'Hosted MCP server', null],
  ['npx skills add statelyai/skills', 'Agent skills', null],
  ['/docs/packages/mcp.mdx', 'MCP docs as markdown', '/docs/packages/mcp.mdx'],
  ['https://github.com/statelyai', 'Source', 'https://github.com/statelyai'],
];

export function FinalCta() {
  return (
    <section id="start" className="sp-grid border-t border-[var(--sp-border)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 pb-20 lg:pb-28">
        <Transition event="START" />
        {/* The page ends in a final state. Narrow phones: tighter inline padding so the install pill fits. */}
        <FinalFrame className="max-w-[44rem] max-sm:-mx-2 max-sm:[&>div]:px-3">
          <h2 className="max-w-[40rem] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] font-semibold tracking-tight text-[var(--sp-fg)]">
            Map your first repo.
          </h2>
          <div className="mt-8 [&_.inline-flex]:max-w-full">
            <div className="max-w-[32rem]"><InstallPill /></div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="https://cal.com/statelyai/enterprise-calls"
              target="_blank"
              className="sp-btn sp-btn-outline"
            >
              Book a demo
            </Link>
            <span className="text-[14px]">
              <TextLink href="https://editor.stately.ai/?source=landing-page">Open the editor</TextLink>
            </span>
          </div>
        </FinalFrame>

        <Pane title="machine-readable" className="mt-16 max-w-[44rem]">
          <ul className="divide-y divide-[var(--sp-border)]">
            {resources.map(([path, what, href]) => (
              <li key={path} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-4 py-2.5">
                <span className="sp-mono text-[12px] text-[var(--sp-fg)] sm:w-[17rem] shrink-0 break-all">
                  {href ? (
                    <a
                      href={href}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="underline decoration-[var(--sp-border-strong)] underline-offset-4 hover:decoration-[var(--sp-fg)]"
                    >
                      {path}
                    </a>
                  ) : (
                    path
                  )}
                </span>
                <span className="text-[13px] text-[var(--sp-muted)]">{what}</span>
              </li>
            ))}
          </ul>
        </Pane>
      </div>
    </section>
  );
}
