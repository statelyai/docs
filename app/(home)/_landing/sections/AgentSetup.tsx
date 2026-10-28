'use client';
// §2 Set up your agent: per-client install line + the MCP tools as four capability cards.
import { EdgeLayer } from '../EdgeLayer';
import { Pane, Section, SectionHeading, Stability, tabCls, useTabs } from '../shared';
import { MCP_URL, clients } from '../lib';
import { CopyLine, TextLink } from './CopyLine';

const clientIds = clients.map((c) => c.id);

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
  const { active, tabProps, panelProps } = useTabs(clientIds, 'claude');
  return (
    <Section id="agent-setup" event="CONNECT_AGENT" color="blue">
      <SectionHeading
        title="Connect once. Your agent maps the rest."
        lede="A hosted MCP server with 12 tools. Your agent reads the repo, draws the statechart, diffs it, lists its paths, and checks it against the source. You don't draw anything."
      />
      {/* CONNECT is routed between the real boxes by EdgeLayer (right→left on lg, down below). */}
      <div className="relative mt-12 grid lg:grid-cols-[minmax(0,5fr)_auto_minmax(0,7fr)] items-start">
        <div className="min-w-0 flex flex-col">
          <div data-edge-id="mcp-pane">
          <Pane
            title="stately mcp"
            right={<Stability level="stable" />}
          >
            <div
              role="tablist"
              aria-label="MCP client"
              className="flex flex-wrap px-1 border-b border-[var(--sp-border)]"
            >
              {clients.map((c) => (
                <button key={c.id} {...tabProps(c.id)} className={`h-9 px-2.5 ${tabCls(c.id === active)}`}>
                  {c.label}
                </button>
              ))}
            </div>
            {clients.map((c) => (
              <div key={c.id} {...panelProps(c.id)} className="px-4 pt-3 pb-1">
                <p className="sp-mono text-[11.5px] text-[var(--sp-muted-2)]">{c.note}</p>
                <CopyLine flush text={c.cmd} prompt={c.prompt} />
                <p className="text-[13px] leading-snug text-[var(--sp-muted)]">
                  {'cmd' in c.login ? (
                    <>
                      Sign in with <code className="sp-mono text-[12px] text-[var(--sp-fg)]">{c.login.cmd}</code>.
                    </>
                  ) : (
                    c.login.text
                  )}
                </p>
              </div>
            ))}
            <p className="px-4 pt-2 pb-4 text-[13px] leading-snug text-[var(--sp-muted)]">
              Add the skills with{' '}
              <code className="sp-mono text-[12px] text-[var(--sp-fg)] whitespace-nowrap">npx skills add statelyai/skills</code>.
            </p>
          </Pane>
          </div>
          {/* Below lg the URL and docs sit above the pane so CONNECT runs straight down from it. */}
          <dl className="max-lg:order-first max-lg:mb-6 lg:mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-[14px]">
            <dt className="sp-mono text-[11.5px] uppercase tracking-[0.06em] text-[var(--sp-muted-2)] pt-0.5">MCP URL</dt>
            <dd className="sp-mono text-[12.5px] text-[var(--sp-fg)] break-words">{MCP_URL}</dd>
            <dt className="sp-mono text-[11.5px] uppercase tracking-[0.06em] text-[var(--sp-muted-2)] pt-0.5">Docs</dt>
            <dd className="text-[var(--sp-muted)]">
              <TextLink href="/docs/packages/mcp">MCP server</TextLink>
              <span className="text-[var(--sp-muted-2)]"> · </span>
              <TextLink href="/llms.txt">llms.txt</TextLink>
            </dd>
          </dl>
        </div>
        <div aria-hidden className="h-[104px] lg:h-auto lg:w-[160px]" />
        <div className="min-w-0 grid sm:grid-cols-2 gap-3">
          {groups.map((g, i) => (
            <div key={g.title} data-edge-id={i === 0 ? 'cap-validate' : undefined} className="min-w-0 flex flex-col">
            <Pane className="flex-1 p-4 flex flex-col">
              <div className="flex items-baseline gap-3">
                <h3 className="text-[14px] font-semibold text-[var(--sp-fg)]">{g.title}</h3>
                <span className="ml-auto shrink-0"><Stability level={g.level} /></span>
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-[var(--sp-muted)]">{g.body}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {g.tools.map(([name, level]) => (
                  <li
                    key={name}
                    className="sp-mono inline-flex items-center gap-1.5 h-6 px-2 max-w-full rounded-[calc(var(--sp-radius)-2px)] border border-[var(--sp-border)] bg-[var(--sp-canvas)] text-[11.5px] text-[var(--sp-fg)]"
                  >
                    <span className="truncate">{name}</span>
                    {level && level !== g.level && (
                      <span className="text-[11.5px] uppercase" style={{ color: 'var(--sp-info)' }}>{level}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Pane>
            </div>
          ))}
        </div>
        <EdgeLayer edges={[{ id: 'connect', from: 'mcp-pane', to: 'cap-validate', label: 'CONNECT' }]} />
      </div>
    </Section>
  );
}
