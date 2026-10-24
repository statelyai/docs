'use client';
// PROTOTYPE — bits shared by hero variants.
import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { CopyButton, TextLink } from './sections/CopyLine';
import { DEMO_URL, SCAN_CMD, breakable, clients } from './lib';

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
  { id: 'agent', label: 'For your agent', short: 'For your agent', cmd: clients[0].cmd },
  { id: 'scan', label: 'Scan a repo', short: 'Scan', cmd: SCAN_CMD },
] as const;
const installIds = installTabs.map((t) => t.id);

export function InstallPill() {
  const { active, tabProps, panelProps } = useTabs(installIds, 'agent');
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

export function CtaRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      <Link href="https://editor.stately.ai/?source=landing-page" className="plausible-event-name=Editor+CTA sp-btn sp-btn-outline">
        Open the editor
      </Link>
      <span className="text-[14px] font-medium">
        <TextLink href={DEMO_URL}>Book a demo</TextLink>
      </span>
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

/* ---------- section primitives ---------- */

/**
 * A transition into the section: the hairline divider drops a vertical edge
 * with an event label and arrowhead onto the heading. This is the page's
 * state-machine motif; each section is a state, each divider an edge.
 */
export function Transition({
  event,
  accent = 'blue',
  variant = 'default',
  guard,
  className = '',
}: {
  event: string;
  /** blue: Stately product (default). orange: XState and runtime. */
  accent?: 'blue' | 'orange';
  /** guarded: dashed edge, `EVENT [guard]` pill with a warn border. */
  variant?: 'default' | 'guarded';
  guard?: string;
  className?: string;
}) {
  const orange = accent === 'orange';
  const guarded = variant === 'guarded';
  const edge = orange ? 'var(--sp-orange)' : 'var(--sp-edge)';
  return (
    <div className={`relative h-20 lg:h-28 ${className}`} aria-hidden>
      <div
        className="absolute left-[39px] top-0 bottom-[8px] w-[2px]"
        style={guarded ? { borderLeft: `2px dashed ${edge}` } : { background: edge }}
      />
      <svg className="absolute left-[33px] bottom-0" width="14" height="9" viewBox="0 0 14 9">
        <path d="M0 0 L14 0 L7 9 Z" fill={edge} />
      </svg>
      <span
        className={`absolute top-1/2 -translate-y-1/2 ${guarded ? 'left-[22px]' : 'left-[22px] sm:left-[40px] sm:-translate-x-1/2'} sp-mono text-[11.5px] uppercase tracking-[0.05em] font-medium border-2 rounded-2xl px-3 py-[3px] bg-[var(--sp-bg)] whitespace-nowrap ${
          orange ? 'text-[var(--sp-orange)]' : 'text-[var(--sp-muted)]'
        }`}
        style={{ borderColor: guarded ? 'var(--sp-warn)' : edge }}
      >
        {event}
        {guarded && guard && <span className="normal-case tracking-normal text-[var(--sp-warn)]"> [{guard}]</span>}
      </span>
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
  accent,
  guard,
}: {
  id?: string;
  event?: string;
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
  accent?: 'blue' | 'orange';
  /** guarded entry transition: `EVENT [guard]` on a dashed edge */
  guard?: string;
}) {
  return (
    <section id={id} className={`border-t border-[var(--sp-border)] ${className}`}>
      <div className={bleed ? '' : 'mx-auto max-w-6xl px-6 sm:px-10 pb-20 lg:pb-28'}>
        {event ? <Transition event={event} accent={accent} variant={guard ? 'guarded' : 'default'} guard={guard} /> : <div className="h-20 lg:h-28" />}
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

/** Stability chip: stable / beta / alpha. */
export function Stability({ level }: { level: 'stable' | 'beta' | 'alpha' }) {
  const color =
    level === 'stable' ? 'var(--sp-success)' : level === 'beta' ? 'var(--sp-info)' : 'var(--sp-warn)';
  return (
    <span className="sp-mono inline-flex items-center gap-1.5 text-[11.5px] uppercase tracking-[0.06em]" style={{ color }}>
      <span className="inline-block size-1.5 rounded-full bg-current" />
      {level}
    </span>
  );
}

/**
 * A connector edge between two page elements, drawn like a statechart
 * transition: 2px stroke, optional event label pill centered on the edge,
 * filled arrowhead at the end. `dir` picks the axis; use `lg:` variants via
 * two instances (one `lg:hidden`, one `hidden lg:block`) when the layout
 * changes orientation at a breakpoint.
 */
export function Edge({
  dir = 'down',
  label,
  length = 56,
  accent = false,
  bidirectional = false,
  className = '',
}: {
  dir?: 'down' | 'right' | 'left';
  /** arrowheads at both ends (e.g. two-way sync) */
  bidirectional?: boolean;
  label?: string;
  /** px along the axis */
  length?: number;
  accent?: boolean;
  className?: string;
}) {
  const color = accent ? 'var(--sp-primary)' : 'var(--sp-edge)';
  const pill = label ? (
    <span
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sp-mono text-[11.5px] uppercase tracking-[0.05em] font-medium border-2 rounded-2xl px-3 py-[3px] bg-[var(--sp-bg)] whitespace-nowrap"
      style={{ borderColor: color, color: accent ? 'var(--sp-fg)' : 'var(--sp-muted)' }}
    >
      {label}
    </span>
  ) : null;
  if (dir === 'down') {
    return (
      <div className={`relative mx-auto w-[14px] ${className}`} style={{ height: length }} aria-hidden>
        <div className="absolute left-[6px] bottom-[8px] w-[2px]" style={{ background: color, top: bidirectional ? 8 : 0 }} />
        {bidirectional && (
          <svg className="absolute left-0 top-0" width="14" height="9" viewBox="0 0 14 9">
            <path d="M0 9 L14 9 L7 0 Z" fill={color} />
          </svg>
        )}
        <svg className="absolute left-0 bottom-0" width="14" height="9" viewBox="0 0 14 9">
          <path d="M0 0 L14 0 L7 9 Z" fill={color} />
        </svg>
        {pill}
      </div>
    );
  }
  const left = dir === 'left';
  return (
    <div className={`relative h-[14px] ${className}`} style={{ width: length }} aria-hidden>
      <div
        className="absolute top-[6px] h-[2px]"
        style={{ background: color, left: left || bidirectional ? 8 : 0, right: left && !bidirectional ? 0 : 8 }}
      />
      {bidirectional && (
        <svg className={`absolute top-0 ${left ? 'right-0' : 'left-0'}`} width="9" height="14" viewBox="0 0 9 14">
          <path d={left ? 'M0 0 L0 14 L9 7 Z' : 'M9 0 L9 14 L0 7 Z'} fill={color} />
        </svg>
      )}
      <svg
        className={`absolute top-0 ${left ? 'left-0' : 'right-0'}`}
        width="9"
        height="14"
        viewBox="0 0 9 14"
      >
        <path d={left ? 'M9 0 L9 14 L0 7 Z' : 'M0 0 L0 14 L9 7 Z'} fill={color} />
      </svg>
      {pill}
    </div>
  );
}

/** Initial-state marker: filled dot with a short edge, like the chart's. */
export function InitialMarker({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="40" height="14" viewBox="0 0 40 14" aria-hidden>
      <circle cx="7" cy="7" r="5" fill="var(--sp-edge)" />
      <path d="M12 7 L30 7" stroke="var(--sp-edge)" strokeWidth="2" />
      <path d="M30 1 L30 13 L39 7 Z" fill="var(--sp-edge)" />
    </svg>
  );
}

/** Final-state frame: the double border statecharts use for a final state. */
export function FinalFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border-2 border-[var(--sp-node-stroke)] p-1 ${className}`}>
      <div className="rounded-md border border-[var(--sp-node-stroke)] p-6 sm:p-8">{children}</div>
    </div>
  );
}
