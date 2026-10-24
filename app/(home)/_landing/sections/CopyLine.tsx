'use client';
// Bordered mono command line with a copy button (InstallPill pattern, one line).
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyLine({
  text,
  prompt = true,
  className = '',
}: {
  text: string;
  prompt?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className={`flex items-stretch rounded-[var(--sp-radius)] border border-[var(--sp-border-strong)] bg-[var(--sp-canvas)] overflow-hidden ${className}`}
    >
      <code className="sp-mono flex-1 min-w-0 px-3 py-2.5 text-[12px] sm:text-[12.5px] text-[var(--sp-fg)] whitespace-pre-wrap break-all">
        {prompt && <span className="text-[var(--sp-muted-2)] select-none">$ </span>}
        {text}
      </code>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="shrink-0 px-3 text-[var(--sp-muted)] hover:text-[var(--sp-fg)] border-l border-[var(--sp-border)] transition-colors"
        aria-label={`Copy ${text}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

/** Small bordered mono chip. */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="sp-mono inline-flex items-center h-6 px-2 rounded-[calc(var(--sp-radius)-2px)] border border-[var(--sp-border)] text-[11px] text-[var(--sp-muted)]">
      {children}
    </span>
  );
}

/** Underlined text link in muted fg, used for doc pointers. */
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="text-[var(--sp-fg)] underline decoration-[var(--sp-border-strong)] underline-offset-4 hover:decoration-[var(--sp-fg)] transition-colors"
    >
      {children}
    </a>
  );
}

/**
 * className for a 3-column DataTable that reflows on phones: header hidden,
 * row = [col 1 | col 3] on top, col 2 full width below. Same <table> markup.
 */
export const stackOn3 =
  'max-sm:[&_thead]:hidden max-sm:[&_tbody_tr]:grid max-sm:[&_tbody_tr]:grid-cols-[minmax(0,1fr)_auto] max-sm:[&_td:nth-child(2)]:col-span-2 max-sm:[&_td:nth-child(2)]:row-start-2 max-sm:[&_td:nth-child(2)]:pt-0';
