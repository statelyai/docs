'use client';
// §2 Set up your agent: per-client install line + the MCP capability table.
import { useState } from 'react';
import { DataTable, Edge, Pane, Section, SectionHeading, Stability } from '../shared';
import { CopyLine, TextLink, stackOn3 } from './CopyLine';

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
const tools: [string, string, Level][] = [
  ['validate_machine', 'Check syntax and graph structure: missing targets, unreachable states, invalid config.', 'stable'],
  ['convert_machine', 'Translate a machine between XState, SCXML, XGraph, Mermaid, and D2.', 'stable'],
  ['diff_machines', 'List added, removed, and changed states and transitions between two machines.', 'stable'],
  ['apply_machine_patches', 'Apply structured edits to a machine and return the result.', 'stable'],
  ['generate_graph_paths', 'Enumerate shortest and simple paths between states.', 'stable'],
  ['simulate_machine', 'Step a machine through a sequence of events and report each state.', 'stable'],
  ['visualize_machine', 'Render a machine as a diagram.', 'beta'],
  ['extract_machines_from_code', 'Statically extract every XState machine from JavaScript or TypeScript source.', 'beta'],
  ['review_machine_implementation', 'Compare a machine to its implementation and list mismatches.', 'beta'],
  ['verify', 'Run a verification report through a host adapter and return matches or drifted.', 'beta'],
  ['generate_test_paths', 'Return the recorded paths from a verification report.', 'beta'],
  ['coverage_report', 'Report model and executed coverage from a verification report.', 'beta'],
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
            <div className="p-4 space-y-4">
              <div>
                <p className="sp-mono text-[11px] text-[var(--sp-muted-2)] mb-2">1 · add the server · {client.note}</p>
                <CopyLine text={client.cmd} prompt={client.prompt} />
              </div>
              <div>
                <p className="sp-mono text-[11px] text-[var(--sp-muted-2)] mb-2">2 · sign in</p>
                {'cmd' in client.login ? (
                  <CopyLine text={client.login.cmd} prompt />
                ) : (
                  <p className="text-[13px] text-[var(--sp-muted)]">{client.login.text}</p>
                )}
              </div>
              <div>
                <p className="sp-mono text-[11px] text-[var(--sp-muted-2)] mb-2">3 · add the skills · terminal</p>
                <CopyLine text="npx skills add statelyai/skills" />
              </div>
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
        <div className="min-w-0">
          <DataTable
            className={stackOn3}
            head={['Tool', 'What it does', 'Stability']}
            rows={tools.map(([name, what, level]) => [
              <code key="n" className="sp-mono text-[12px] font-normal whitespace-normal">
                {name.split('_').map((part, i) => (
                  <span key={i}>
                    {i > 0 && '_'}
                    {i > 0 && <wbr />}
                    {part}
                  </span>
                ))}
              </code>,
              <span key="w" className="text-[13px] leading-snug block sm:min-w-[14rem]">{what}</span>,
              <span key="s" className="whitespace-nowrap"><Stability level={level} /></span>,
            ])}
          />
          <p className="sp-mono text-[11px] text-[var(--sp-muted-2)] mt-3">
            12 tools · stability labeled per tool
          </p>
        </div>
      </div>
    </Section>
  );
}
