'use client';
// Bordered mono command line with a copy button (InstallPill pattern, one line).
import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { NewTab, breakable } from '../lib';

/** Copy button with visible, announced "Copied" feedback for 1.2 s. */
export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1200);
        } catch {
          setCopied(false);
        }
      }}
      className={`shrink-0 flex items-center px-3 text-[var(--sp-muted)] hover:text-[var(--sp-fg)] transition-colors ${className}`}
      aria-label={`Copy ${text}`}
    >
      {copied ? <Check size={14} className="text-[var(--sp-success)]" /> : <Copy size={14} />}
      <span aria-live="polite" className={`sp-mono text-[11.5px] text-[var(--sp-success)] ${copied ? 'ml-1.5' : ''}`}>
        {copied ? 'Copied' : ''}
      </span>
    </button>
  );
}

export function CopyLine({
  text,
  prompt = true,
  flush = false,
  className = '',
}: {
  text: string;
  prompt?: boolean;
  /** Inside a Pane: no own border or background (no card-in-card). */
  flush?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-stretch ${
        flush
          ? ''
          : 'rounded-[var(--sp-radius)] border border-[var(--sp-border-strong)] bg-[var(--sp-canvas)] overflow-hidden'
      } ${className}`}
    >
      <code
        className={`sp-mono flex-1 min-w-0 py-2.5 text-[12px] sm:text-[12.5px] text-[var(--sp-fg)] whitespace-normal break-words ${
          flush ? 'px-0' : 'px-3'
        }`}
      >
        {prompt && <span className="text-[var(--sp-muted-2)] select-none">$ </span>}
        {breakable(text)}
      </code>
      <CopyButton text={text} className={flush ? 'pr-0' : 'border-l border-[var(--sp-border)]'} />
    </div>
  );
}

/** Small bordered mono chip. */
export function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`sp-mono inline-flex items-center h-6 px-2 rounded-[calc(var(--sp-radius)-2px)] border border-[var(--sp-border)] text-[11.5px] text-[var(--sp-muted)] ${className}`}>
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
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="text-[var(--sp-fg)] underline decoration-[var(--sp-border-strong)] underline-offset-4 hover:decoration-[var(--sp-fg)] transition-colors"
    >
      {children}
      {external && <NewTab />}
    </a>
  );
}
