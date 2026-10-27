// A real machine render from the Stately editor's chrome-free, transparent view.
// Static (no simulated state). Find every slot with: [data-embed-slot]
import { EmbedFrame } from './EmbedFrame';

export type EmbedTheme = 'light' | 'dark';

/** base64url of a UTF-8 string; works on the server and in the browser. */
export function encodeMachine(source: string) {
  const bytes = new TextEncoder().encode(source);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function embedUrl(source: string, theme: EmbedTheme = 'dark', extra = '') {
  return `https://editor.stately.ai/viz?chrome=plain&theme=${theme}${extra}#machine=${encodeMachine(source)}&format=xstate`;
}

export function EmbedMachine({
  source,
  title,
  description,
  className = '',
  height,
  slot,
}: {
  /** XState source string (see machines.ts) */
  source: string;
  /** iframe title */
  title: string;
  /** visually hidden text alternative: states and transitions */
  description: string;
  className?: string;
  /** px; or size it with className */
  height?: number;
  /** data-embed-slot name */
  slot: string;
}) {
  return (
    <div data-embed-slot={slot} style={{ height }} className={`relative ${className}`}>
      {/* followTheme swaps theme=dark for the site's resolved theme on the client */}
      <EmbedFrame src={embedUrl(source)} title={title} followTheme />
      <p className="sr-only">{description}</p>
    </div>
  );
}
