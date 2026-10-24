// §11 FAQ. faqItems also feeds FAQPage JSON-LD in page.tsx (a server component),
// so this file has no 'use client': a client module would export a reference,
// not the array. It still renders client-side via Landing. Answers: plain text.
import { Section, SectionHeading } from '../shared';

export const faqItems: { q: string; a: string }[] = [
  {
    q: 'Does Stately replace my workflow runtime?',
    a: 'No. Temporal, Inngest, Restate, and LangGraph keep running your workflows. Stately models, analyzes, and verifies the behavior they run.',
  },
  {
    q: 'Do I need XState?',
    a: 'No. Stately maps existing code from many libraries and formats, and can capture behavior from a running app. Use XState when you want to execute the model directly.',
  },
  {
    q: 'Does my code leave my network?',
    a: 'With the hosted service, the code you send is processed under the Stately privacy policy. With self-hosted Stately, no traffic leaves your network.',
  },
  {
    q: 'What does my agent actually do with Stately?',
    a: 'It calls the MCP tools to map code into a statechart with cited evidence, propose changes to that graph, and verify the implementation still matches. Each step produces an artifact a human can review and approve.',
  },
  {
    q: 'Which clients are supported? Which parts are alpha?',
    a: 'Any MCP client works, including Claude Code, Codex, Cursor, and VS Code. Every tool and package is labeled stable, beta, or alpha; XState v6 and @statelyai/agent are alpha.',
  },
  {
    q: 'Is it free? What is paid?',
    a: 'XState and the open-source packages are free, and the editor has a free Community plan. Pro and Team add private projects, version history, and team features; Enterprise adds cloud or self-hosted, SSO, and audit logs. Details are on the pricing page.',
  },
  {
    q: 'Where is the machine-readable version of this page?',
    a: 'Start with /llms.txt and /llms-full.txt. Docs pages are available as markdown by adding .md to the URL. The MCP server is at https://mcp.stately.ai/mcp, and npx skills add statelyai/skills installs the agent skills.',
  },
];

export function Faq() {
  return (
    <Section id="faq" event="ASK">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-start">
        <SectionHeading title="Questions." />
        <div className="border-t border-[var(--sp-border)]">
          {faqItems.map((f) => (
            <details key={f.q} className="group border-b border-[var(--sp-border)]">
              <summary className="flex items-start gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="flex-1 text-[15px] sm:text-[16px] font-medium text-[var(--sp-fg)]">{f.q}</span>
                <span
                  aria-hidden
                  className="sp-mono text-[15px] leading-6 text-[var(--sp-muted)] transition-transform duration-150 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-8 text-[15px] leading-relaxed text-[var(--sp-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
