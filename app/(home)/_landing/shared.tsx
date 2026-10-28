'use client';
// PROTOTYPE — bits shared by hero variants.
import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { CopyButton } from './sections/CopyLine';
import { EdgeLayer } from './EdgeLayer';
import { DEMO_URL, MCP_CMD, NewTab, SCAN_CMD, breakable } from './lib';

/**
 * ARIA tabs with roving tabindex: ArrowLeft/ArrowRight/Home/End move focus
 * and selection. Every panel stays in the DOM (`hidden` when inactive) so the
 * server HTML carries every command.
 */
export function useTabs<T extends string>(ids: readonly T[], initial: T) {
  const [active, setActive] = useState<T>(initial);
  const base = useId();
  const refs = useRef<Partial<Record<T, HTMLButtonElement | null>>>({});
  const tabId = (id: T) => `${base}-tab-${id}`;
  const panelId = (id: T) => `${base}-panel-${id}`;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = ids.indexOf(active);
    const n =
      e.key === 'ArrowRight' ? (i + 1) % ids.length
      : e.key === 'ArrowLeft' ? (i - 1 + ids.length) % ids.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? ids.length - 1
      : -1;
    if (n < 0) return;
    e.preventDefault();
    setActive(ids[n]);
    refs.current[ids[n]]?.focus();
  };
  return {
    active,
    tabProps: (id: T) => ({
      id: tabId(id),
      type: 'button' as const,
      role: 'tab' as const,
      'aria-selected': id === active,
      'aria-controls': panelId(id),
      tabIndex: id === active ? 0 : -1,
      onClick: () => setActive(id),
      onKeyDown,
      ref: (el: HTMLButtonElement | null) => {
        refs.current[id] = el;
      },
    }),
    panelProps: (id: T) => ({
      id: panelId(id),
      role: 'tabpanel' as const,
      'aria-labelledby': tabId(id),
      hidden: id !== active,
    }),
  };
}

const tabCls = (on: boolean) =>
  `sp-mono text-[11.5px] uppercase tracking-[0.06em] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
    on
      ? 'text-[var(--sp-fg)] border-[var(--sp-primary)]'
      : 'text-[var(--sp-muted-2)] border-transparent hover:text-[var(--sp-muted)]'
  }`;
export { tabCls };

const installTabs = [
  { id: 'scan', label: 'Scan a repo', short: 'Scan', cmd: SCAN_CMD },
  { id: 'mcp', label: 'MCP server', short: 'MCP', cmd: MCP_CMD },
] as const;
const installIds = installTabs.map((t) => t.id);

export function InstallPill() {
  const { active, tabProps, panelProps } = useTabs(installIds, 'scan');
  return (
    <div className="flex flex-col w-full max-w-full rounded-[var(--sp-radius)] border border-[var(--sp-border-strong)] bg-[var(--sp-surface)] overflow-hidden">
      <div role="tablist" aria-label="Install command" className="flex border-b border-[var(--sp-border)]">
        {installTabs.map((t) => (
          <button key={t.id} {...tabProps(t.id)} className={`px-3 py-1.5 ${tabCls(active === t.id)}`}>
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>
      {installTabs.map((t) => (
        <div key={t.id} {...panelProps(t.id)} className="flex items-stretch [&[hidden]]:hidden">
          <code className="sp-mono flex-1 min-w-0 px-3 sm:px-4 py-2.5 text-[12px] sm:text-[12.5px] leading-snug text-[var(--sp-fg)] whitespace-normal break-words self-center">
            <span className="text-[var(--sp-muted-2)] select-none">$ </span>
            {breakable(t.cmd)}
          </code>
          <CopyButton text={t.cmd} className="border-l border-[var(--sp-border)]" />
        </div>
      ))}
    </div>
  );
}

/** Primary: open the editor. Secondary: book a demo. */
export function CtaRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link href="https://editor.stately.ai/?source=landing-page" className="plausible-event-name=Editor+CTA sp-btn sp-btn-primary">
        Open the editor
      </Link>
      <Link href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="sp-btn sp-btn-outline">
        Book a demo
        <NewTab />
      </Link>
    </div>
  );
}

export function FigCaption({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="sp-mono text-[11.5px] text-[var(--sp-muted-2)] mt-3">
      <span className="text-[var(--sp-muted)]">Fig {n}</span> — {children}
    </p>
  );
}

/* ---------- motif: edges, labels, nodes (values copied from the editor) ---------- */

const EDGE = 'var(--sp-edge)';
/** 2px edge with the editor's 6px translucent black halo. */
const segCls = 'bg-[var(--sp-edge)] shadow-[0_0_0_2px_var(--sp-edge-halo)]';

/** Filled 10x10 triangle (M0,0 L0,10 L10,5 z), rotated to point along the edge. */
export function Arrowhead({ dir, className = '' }: { dir: 'down' | 'up' | 'right' | 'left'; className?: string }) {
  const deg = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className={`shrink-0 block ${className}`} aria-hidden>
      <path d="M0,0 L0,10 L10,5 z" fill={EDGE} transform={`rotate(${deg} 5 5)`} />
    </svg>
  );
}

/** Event label: Inter 14/20 600, 2px edge-colored border, translucent fill. */
export function EventLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`relative shrink-0 block w-max rounded-[15.2px] border-2 px-3 py-2 text-[14px] leading-5 font-semibold text-[var(--sp-fg)] whitespace-nowrap ${className}`}
      style={{ borderColor: EDGE, background: 'var(--sp-label-bg)' }}
    >
      {children}
    </span>
  );
}

/**
 * The transition into a section, routed by EdgeLayer like any other edge:
 * from a 4px anchor on the section's top hairline (in the gutter on xl) to
 * the top of the heading's own box, so the label can be dragged along it and
 * the edge re-routes.
 * Guarded: the source half is dashed and the label shows the guard. The
 * spacer keeps the heading where it was while the edge is measured.
 */
export function TransitionIn({ event, guard }: { event: string; guard?: string }) {
  return (
    <>
      <div className={`relative ${guard ? 'h-[136px] lg:h-[144px]' : 'h-[112px] lg:h-[128px]'}`} aria-hidden>
        {/* Below md the edge drops straight onto the title so wide labels stay inside the viewport. */}
        <span data-edge-id="section-in" className="absolute -top-1 left-[88px] md:left-[2px] xl:left-[-28px] size-1" />
      </div>
      <EdgeLayer
        decorative
        edges={[{ id: 'in', from: 'section-in', to: '[data-section-title]', label: event, guard, fromSide: 'bottom', toSide: 'top' }]}
      />
    </>
  );
}

// `data-section-title` marks the box TransitionIn lands on. It goes on the
// heading itself, sized to its text (`w-fit`) rather than the column, so the
// arrow can be dragged anywhere along its top.

/** Standard section shell: hairline top border, transition edge in, container. */
export function Section({
  id,
  event,
  children,
  className = '',
  bleed = false,
  guard,
}: {
  id?: string;
  event?: string;
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
  /** guarded entry transition: dashed source half, `IF guard` label */
  guard?: string;
}) {
  return (
    <section id={id} className={`border-t border-[var(--sp-border)] ${className}`}>
      <div className={`relative ${bleed ? '' : 'mx-auto max-w-6xl px-6 sm:px-10 pb-20 lg:pb-28'}`}>
        {event ? <TransitionIn event={event} guard={guard} /> : <div className="h-20 lg:h-28" />}
        {children}
      </div>
    </section>
  );
}

/** Section heading: title + optional lede. No eyebrow; the TransitionIn edge lands on it. */
export function SectionHeading({
  title,
  lede,
  className = '',
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative max-w-[44rem] ${className}`}>
      <h2 data-section-title="" className="w-fit text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-[1.1] font-semibold tracking-tight text-[var(--sp-fg)]">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-[var(--sp-muted)] max-w-[38rem]">{lede}</p>
      )}
    </div>
  );
}

/** Bordered panel that reads as an editor pane: optional mono title strip. */
export function Pane({
  title,
  right,
  children,
  className = '',
  grid = false,
}: {
  title?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  grid?: boolean;
}) {
  return (
    <div className={`rounded-[var(--sp-radius)] border border-[var(--sp-border)] overflow-hidden ${grid ? 'sp-grid' : 'bg-[var(--sp-surface)]'} ${className}`}>
      {title !== undefined && (
        <div className="flex items-center gap-3 px-4 h-9 border-b border-[var(--sp-border)] bg-[var(--sp-canvas)]">
          <span className="sp-mono text-[11.5px] text-[var(--sp-fg)]">{title}</span>
          {right && <span className="ml-auto sp-mono text-[11.5px] uppercase tracking-[0.06em]">{right}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/** Plain, agent-parseable table in editor density. */
export function DataTable({
  head,
  rows,
  className = '',
}: {
  head: string[];
  rows: React.ReactNode[][];
  className?: string;
}) {
  return (
    <div className={`rounded-[var(--sp-radius)] border border-[var(--sp-border)] overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--sp-canvas)]">
            {head.map((h) => (
              <th key={h} className="sp-mono text-left text-[11.5px] uppercase tracking-[0.06em] font-medium text-[var(--sp-muted)] px-4 py-2.5 border-b border-[var(--sp-border)] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--sp-border)] last:border-b-0">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-3 align-top ${j === 0 ? 'text-[var(--sp-fg)] font-medium whitespace-nowrap' : 'text-[var(--sp-muted)]'}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Stability label: stable / beta / alpha, as colored text. */
export function Stability({ level }: { level: 'stable' | 'beta' | 'alpha' }) {
  const color =
    level === 'stable' ? 'var(--sp-success)' : level === 'beta' ? 'var(--sp-info)' : 'var(--sp-warn)';
  return (
    <span className="sp-mono text-[11.5px] uppercase tracking-[0.06em]" style={{ color }}>
      {level}
    </span>
  );
}

/**
 * A connector edge between two page elements, drawn like an editor
 * transition: 2px stroke with halo, optional event label splitting the edge,
 * arrow tip 5px off the target. `dir` picks the axis; use two instances
 * (`lg:hidden` / `hidden lg:flex`) when the layout changes orientation.
 */
export function Edge({
  dir = 'down',
  label,
  length = 96,
  bidirectional = false,
  className = '',
}: {
  dir?: 'down' | 'up' | 'right' | 'left';
  /** arrowheads at both ends (e.g. two-way sync) */
  bidirectional?: boolean;
  label?: string;
  /** px along the axis */
  length?: number;
  className?: string;
}) {
  const vertical = dir === 'down' || dir === 'up';
  const seg = <span className={`flex-1 ${vertical ? 'w-[2px]' : 'h-[2px]'} ${segCls}`} />;
  const opposite = { down: 'up', up: 'down', right: 'left', left: 'right' } as const;
  // The arrowhead overlaps the end of its run by 5px, so the tip sits 5px off the target.
  const pull = { down: '-mt-[5px] mb-[5px]', up: '-mb-[5px] mt-[5px]', right: '-ml-[5px] mr-[5px]', left: '-mr-[5px] ml-[5px]' } as const;
  // One-way edges get an arrow-sized spacer at the tail, so a label sits at
  // the same point on an edge whichever way it runs.
  const parts = (
    <>
      {bidirectional ? <Arrowhead dir={opposite[dir]} className={pull[opposite[dir]]} /> : <span className={vertical ? 'h-[10px]' : 'w-[10px]'} />}
      {seg}
      {label && <EventLabel>{label}</EventLabel>}
      {label && seg}
      <Arrowhead dir={dir} className={pull[dir]} />
    </>
  );
  const flow = { down: 'flex-col', up: 'flex-col-reverse', right: 'flex-row', left: 'flex-row-reverse' } as const;
  return (
    <div
      className={`${flow[dir]} ${vertical ? 'mx-auto w-max' : 'h-max'} flex items-center ${className}`}
      style={vertical ? { height: length } : { width: length }}
      aria-hidden
    >
      {parts}
    </div>
  );
}

/** Initial-state marker: dot plus hook into an 8px arrow. Place at right: calc(100% + 4px). */
export function InitialMarker({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <circle cx="4" cy="4" r="4" fill={EDGE} />
      <path d="M4,10 Q4,15 10,15 L11,15" fill="none" stroke={EDGE} strokeWidth="2" strokeLinecap="round" />
      <path d="M11,11 L11,19 L19,15 z" fill={EDGE} />
    </svg>
  );
}

/** The editor's final-state icon: ring plus dot. */
export function FinalIcon({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg className={`shrink-0 overflow-visible ${className}`} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="none" stroke="var(--sp-final-icon)" strokeWidth="3" />
      <circle cx="10" cy="10" r="4" fill="var(--sp-final-icon)" />
    </svg>
  );
}

/** A state node card in editor styling. `final` adds the final-state icon before the title. */
export function StateNode({
  title,
  final = false,
  iconSize = 20,
  children,
  className = '',
  headerClassName = '',
}: {
  title: React.ReactNode;
  final?: boolean;
  iconSize?: number;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
}) {
  return (
    <div className={`rounded-[5.2px] border-2 border-[var(--sp-node-stroke)] bg-[var(--sp-node)] ${className}`}>
      <div className={`flex items-center gap-2 px-3 py-2 ${headerClassName}`}>
        {final && <FinalIcon size={iconSize} />}
        {title}
      </div>
      {children}
    </div>
  );
}

