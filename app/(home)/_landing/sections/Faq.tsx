// §11 FAQ. faqItems also feeds FAQPage JSON-LD in page.tsx (a server component),
// so this file has no 'use client': a client module would export a reference,
// not the array. It still renders client-side via Landing. Answers: plain text.
import { NewTab, SCAN_CMD, breakable, clients } from '../lib';
import { Pane, Section, SectionHeading } from '../shared';
import { textLinkCls } from '../classes';
import Link from 'next/link';

export const faqItems: { q: string; a: string }[] = [
  {
    q: 'What is a state machine?',
    a: 'A state machine models behavior as states and transitions between them. Events can trigger transitions, changing the current state. Statecharts extend state machines with nested states and parallel regions for concurrent behavior.',
  },
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
    a: 'With the hosted service, the code you send is processed under the Stately privacy policy. With self-hosted Stately, and AI features and hosted comments turned off, no traffic leaves your network.',
  },
  {
    q: 'What does my agent actually do with Stately?',
    a: 'It calls the MCP tools to map code into a statechart with cited evidence, propose changes to that graph, and verify the implementation still matches. Each step produces an artifact a human can review and approve.',
  },
  {
    q: 'Where are the machine-readable docs?',
    a: 'Start with /llms.txt and /llms-full.txt. Docs pages are available as markdown by adding .mdx to the URL. The MCP server is at https://mcp.stately.ai/mcp, and npx skills add statelyai/skills installs the agent skills.',
  },
];

const byId = Object.fromEntries(clients.map((c) => [c.id, c]));

/** Plain list an agent can parse: [text, what it is, href or null]. */
const resources: [string, string, string | null][] = [
  ['/llms.txt', 'Site summary for agents', '/llms.txt'],
  ['/llms-full.txt', 'Full docs as plain text', '/llms-full.txt'],
  ['https://mcp.stately.ai/mcp', 'Hosted MCP server', null],
  [byId.claude.cmd, 'Add the MCP server to Claude Code', null],
  [byId.codex.cmd, 'Add the MCP server to Codex', null],
  [byId.cursor.cmd, 'Cursor: .cursor/mcp.json', null],
  [byId.vscode.cmd, 'Add the MCP server to VS Code', null],
  [SCAN_CMD, 'Find the machines in a repo', null],
  ['npx skills add statelyai/skills', 'Agent skills', null],
  ['/docs/packages/mcp.mdx', 'MCP docs as markdown', '/docs/packages/mcp.mdx'],
  ['https://github.com/statelyai', 'Source', 'https://github.com/statelyai'],
];

export function Faq() {
  return (
    <Section id="faq" event="ASK" color="yellow">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] gap-x-16 gap-y-10 items-start">
        <div className="lg:col-start-1 lg:row-start-1">
          <SectionHeading title="Questions." />
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--sp-muted)]">
            Start with{' '}
            <Link href="/blog/2023-10-02-what-is-a-state-machine" className={textLinkCls}>
              what a state machine is
            </Link>, then explore{' '}
            <Link href="/docs/state-machines-and-statecharts" className={textLinkCls}>
              state machines and statecharts
            </Link>{' '}
            and the <Link href="/docs/actor-model" className={textLinkCls}>actor model</Link>.
          </p>
        </div>
        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 border-t border-[var(--sp-border)]">
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
        <Pane title="machine-readable" className="min-w-0 lg:col-start-1 lg:row-start-2">
          <ul className="divide-y divide-[var(--sp-border)]">
            {resources.map(([path, what, href]) => (
              <li key={path} className="flex flex-col gap-1 px-4 py-2.5">
                <span className="sp-mono text-[12px] text-[var(--sp-fg)] break-words">
                  {href ? (
                    <a
                      href={href}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={textLinkCls}
                    >
                      {breakable(path)}
                      {href.startsWith('http') && <NewTab />}
                    </a>
                  ) : (
                    breakable(path)
                  )}
                </span>
                <span className="text-[13px] text-[var(--sp-muted)]">{what}</span>
              </li>
            ))}
          </ul>
        </Pane>
      </div>
    </Section>
  );
}
