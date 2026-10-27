'use client';
// PROTOTYPE — bits shared by hero variants.
import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { CopyButton } from './sections/CopyLine';
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

/** Guarded event label: diamond, event name, then `IF guard`. */
export function GuardLabel({ event, guard }: { event: string; guard: string }) {
  return (
    <span
      className="relative shrink-0 grid w-max grid-cols-[20px_auto] items-center gap-x-2 rounded-[15.2px] border-2 px-3 py-2 whitespace-nowrap"
      style={{ borderColor: EDGE, background: 'var(--sp-label-bg)' }}
    >
      <span className="row-span-2 grid size-5 place-items-center">
        <span className="block size-[14px] rotate-45 rounded-[2px] bg-[var(--sp-fg)]" />
      </span>
      <span className="text-[14px] leading-5 font-semibold text-[var(--sp-fg)]">{event}</span>
      <span className="leading-5">
        <span className="text-[14px] font-semibold text-[var(--sp-muted)]">IF</span>{' '}
        <span className="text-[12px] font-semibold text-[var(--sp-fg)] opacity-80">{guard}</span>
      </span>
    </span>
  );
}

/** Vertical dashed segment (5 5, offset 2.5) that fills its flex slot. */
function DashedV({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-[6px] overflow-visible ${className}`} aria-hidden>
      <line x1="3" y1="0" x2="3" y2="100%" stroke="var(--sp-edge-halo)" strokeWidth="6" />
      <line x1="3" y1="0" x2="3" y2="100%" stroke={EDGE} strokeWidth="2" strokeDasharray="5 5" strokeDashoffset="2.5" />
    </svg>
  );
}

/**
 * A transition into the section, routed like the editor would: from the
 * section's top hairline down 24px, a 10px-radius corner right for 40px, a
 * corner down, then the label on that final segment and the arrow tip 8px
 * above the heading. Guarded: the source half is dashed and the label shows
 * the guard. The edge is split at the label; no line runs under it.
 */
export function Transition({ event, guard, className = '' }: { event: string; guard?: string; className?: string }) {
  const guarded = !!guard;
  // Route head: start x=2, final x=42 (the column center), 24px drop.
  const route = 'M2,0 L2,14 C2,14 2,24 12,24 L32,24 C32,24 42,24 42,34';
  return (
    <div className={`relative ${guarded ? 'h-[136px] lg:h-[144px]' : 'h-[112px] lg:h-[128px]'} ${className}`} aria-hidden>
      {/* Column centered on the final segment: heading left + 12px where the gutter allows. */}
      <div className="absolute top-0 bottom-[8px] left-0 xl:left-[12px] xl:-translate-x-1/2 flex flex-col items-center w-max">
        <svg width="84" height="34" viewBox="0 0 84 34" className="shrink-0 overflow-visible">
          <path d={route} fill="none" stroke="var(--sp-edge-halo)" strokeWidth="6" />
          <path d={route} fill="none" stroke={EDGE} strokeWidth="2" strokeDasharray={guarded ? '5 5' : undefined} strokeDashoffset={guarded ? 2.5 : undefined} />
        </svg>
        {guarded ? <DashedV className="flex-1 min-h-0" /> : <span className={`flex-1 w-[2px] ${segCls}`} />}
        {guarded ? <GuardLabel event={event} guard={guard} /> : <EventLabel>{event}</EventLabel>}
        <span className={`flex-1 w-[2px] -mb-[5px] ${segCls}`} />
        <Arrowhead dir="down" />
      </div>
    </div>
  );
}

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
      <div className={bleed ? '' : 'mx-auto max-w-6xl px-6 sm:px-10 pb-20 lg:pb-28'}>
        {event ? <Transition event={event} guard={guard} /> : <div className="h-20 lg:h-28" />}
        {children}
      </div>
    </section>
  );
}

/** Section heading: title + optional lede. No eyebrow; the Transition above carries the label. */
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
    <div className={`max-w-[44rem] ${className}`}>
      <h2 className="text-[2rem] sm:text-[2.25rem] lg:text-[2.5rem] leading-[1.1] font-semibold tracking-tight text-[var(--sp-fg)]">
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
  dir?: 'down' | 'right' | 'left';
  /** arrowheads at both ends (e.g. two-way sync) */
  bidirectional?: boolean;
  label?: string;
  /** px along the axis */
  length?: number;
  className?: string;
}) {
  const down = dir === 'down';
  const seg = <span className={`flex-1 ${down ? 'w-[2px]' : 'h-[2px]'} ${segCls}`} />;
  const head = down ? 'down' : dir;
  const tail = down ? 'up' : dir === 'right' ? 'left' : 'right';
  const parts = (
    <>
      {bidirectional && <Arrowhead dir={tail} className={down ? 'mt-[5px] -mb-[5px]' : 'ml-[5px] -mr-[5px]'} />}
      {seg}
      {label && <EventLabel>{label}</EventLabel>}
      {label && seg}
      <Arrowhead dir={head} className={down ? '-mt-[5px] mb-[5px]' : '-ml-[5px] mr-[5px]'} />
    </>
  );
  return (
    <div
      className={`${down ? 'flex-col mx-auto w-max' : 'flex-row h-max'} flex items-center ${dir === 'left' ? 'flex-row-reverse' : ''} ${className}`}
      style={down ? { height: length } : { width: length }}
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

