'use client';
// §2 Set up your agent: per-client install line + the MCP tools as four capability cards.
import { useState } from 'react';
import { Edge, Pane, Section, SectionHeading, Stability } from '../shared';
import { CopyLine, TextLink } from './CopyLine';

const MCP_URL = 'https://mcp.stately.ai/mcp';

type Client = {
  id: string;
  label: string;
  note: string;
  cmd: string;
  prompt: boolean;
  /** Step 3: how to complete Stately sign-in. A command (prompt) or a sentence. */
  login: { cmd: string } | { text: string };
};

const clients: Client[] = [
  { id: 'claude', label: 'Claude Code', note: 'terminal', cmd: `claude mcp add --transport http stately ${MCP_URL}`, prompt: true, login: { text: 'In Claude Code, run /mcp and complete Stately sign-in.' } },
  { id: 'codex', label: 'Codex', note: 'terminal', cmd: `codex mcp add stately --url ${MCP_URL}`, prompt: true, login: { cmd: 'codex mcp login stately' } },
  { id: 'cursor', label: 'Cursor', note: '.cursor/mcp.json', cmd: `{"mcpServers":{"stately":{"url":"${MCP_URL}"}}}`, prompt: false, login: { text: 'Enable the server in Cursor Settings → MCP and complete Stately sign-in.' } },
  { id: 'vscode', label: 'VS Code', note: 'terminal', cmd: `code --add-mcp '{"name":"stately","type":"http","url":"${MCP_URL}"}'`, prompt: true, login: { text: 'Run MCP: List Servers, start stately, and complete Stately sign-in.' } },
  { id: 'any', label: 'Any MCP client', note: 'server URL (streamable HTTP)', cmd: MCP_URL, prompt: false, login: { text: 'Start the server in your client and complete Stately sign-in (OAuth).' } },
];

type Level = 'stable' | 'beta' | 'alpha';
/** 12 tools in four groups. A tool whose level differs from its group's is marked on its chip. */
const groups: { title: string; body: string; level: Level; tools: [string, Level?][] }[] = [
  {
    title: 'Validate and convert',
    body: 'Find missing targets, unreachable states, and invalid config, then translate between XState, SCXML, Mermaid, and D2.',
    level: 'stable',
    tools: [['validate_machine'], ['convert_machine']],
  },
  {
    title: 'Diff and patch',
    body: 'List the states and transitions that changed between two machines, and apply structured edits.',
    level: 'stable',
    tools: [['diff_machines'], ['apply_machine_patches']],
  },
  {
    title: 'Paths and simulation',
    body: 'Enumerate paths between states, step a machine through events, and render it as a diagram.',
    level: 'stable',
    tools: [['generate_graph_paths'], ['simulate_machine'], ['visualize_machine', 'beta']],
  },
  {
    title: 'Extract, review, verify',
    body: 'Pull machines out of source, compare them to the implementation, and report matches or drifted with coverage.',
    level: 'beta',
    tools: [['extract_machines_from_code'], ['review_machine_implementation'], ['verify'], ['generate_test_paths'], ['coverage_report']],
  },
];

export function AgentSetup() {
  const [active, setActive] = useState<string>('claude');
  const client = clients.find((c) => c.id === active)!;
  return (
    <Section id="agent-setup" event="SET_UP">
      <SectionHeading
        title="Give your agent the graph."
        lede="A hosted MCP server with 12 tools. Your agent maps code into a statechart, diffs it, lists its paths, and checks it against the source."
      />
      <div className="mt-12 grid lg:grid-cols-[minmax(0,4fr)_auto_minmax(0,8fr)] items-start">
        <div className="min-w-0">
          <Pane
            title="stately mcp"
            right={<Stability level="stable" />}
          >
            <div
              role="tablist"
              aria-label="MCP client"
              className="flex overflow-x-auto border-b border-[var(--sp-border)]"
            >
              {clients.map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={c.id === active}
                  onClick={() => setActive(c.id)}
                  className={`sp-mono shrink-0 h-9 px-3 text-[11px] uppercase tracking-[0.06em] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    c.id === active
                      ? 'text-[var(--sp-fg)] border-[var(--sp-primary)]'
                      : 'text-[var(--sp-muted-2)] border-transparent hover:text-[var(--sp-muted)]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="p-3 space-y-2.5">
              <p className="sp-mono text-[11px] text-[var(--sp-muted-2)]">{client.note}</p>
              <CopyLine text={client.cmd} prompt={client.prompt} />
              <p className="text-[13px] leading-snug text-[var(--sp-muted)]">
                {'cmd' in client.login ? (
                  <>
                    Sign in with <code className="sp-mono text-[12px] text-[var(--sp-fg)]">{client.login.cmd}</code>.
                  </>
                ) : (
                  client.login.text
                )}
              </p>
              <p className="text-[13px] leading-snug text-[var(--sp-muted)]">
                Add the skills with{' '}
                <code className="sp-mono text-[12px] text-[var(--sp-fg)] whitespace-nowrap">npx skills add statelyai/skills</code>.
              </p>
            </div>
          </Pane>
          <dl className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px]">
            <dt className="sp-mono text-[11px] uppercase tracking-[0.06em] text-[var(--sp-muted-2)] pt-0.5">MCP URL</dt>
            <dd className="sp-mono text-[12.5px] text-[var(--sp-fg)] break-all">{MCP_URL}</dd>
            <dt className="sp-mono text-[11px] uppercase tracking-[0.06em] text-[var(--sp-muted-2)] pt-0.5">Docs</dt>
            <dd className="text-[var(--sp-muted)]">
              <TextLink href="/docs/packages/mcp">MCP server</TextLink>
              <span className="text-[var(--sp-muted-2)]"> · </span>
              <TextLink href="/llms.txt">llms.txt</TextLink>
            </dd>
          </dl>
        </div>
        <div className="my-1 lg:my-0 lg:mx-1 lg:mt-[11px]">
          <Edge dir="down" label="CONNECT" length={76} className="lg:hidden" />
          <Edge dir="right" label="CONNECT" length={128} className="hidden lg:block" />
        </div>
        <div className="min-w-0 grid sm:grid-cols-2 gap-3">
          {groups.map((g) => (
            <Pane key={g.title} className="p-4 flex flex-col">
              <div className="flex items-baseline gap-3">
                <h3 className="text-[14px] font-semibold text-[var(--sp-fg)]">{g.title}</h3>
                <span className="ml-auto shrink-0"><Stability level={g.level} /></span>
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-[var(--sp-muted)]">{g.body}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {g.tools.map(([name, level]) => (
                  <li
                    key={name}
                    className="sp-mono inline-flex items-center gap-1.5 h-6 px-2 max-w-full rounded-[calc(var(--sp-radius)-2px)] border border-[var(--sp-border)] bg-[var(--sp-canvas)] text-[11px] text-[var(--sp-fg)]"
                  >
                    <span className="truncate">{name}</span>
                    {level && level !== g.level && (
                      <span className="text-[10px] uppercase" style={{ color: 'var(--sp-info)' }}>{level}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Pane>
          ))}
        </div>
      </div>
    </Section>
  );
}
