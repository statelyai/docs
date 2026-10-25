// A real machine render from the Stately editor's chrome-free, transparent view.
// Static (no simulated state). Find every slot with: [data-embed-slot]
import { EmbedFrame } from './EmbedFrame';

export function embedUrl(source: string) {
  const machine = Buffer.from(source, 'utf8').toString('base64url');
  return `https://editor.stately.ai/viz?chrome=plain&theme=dark#machine=${machine}&format=xstate`;
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
    <div data-embed-slot={slot} style={{ colorScheme: 'dark', height }} className={`relative ${className}`}>
      <EmbedFrame src={embedUrl(source)} title={title} />
      <p className="sr-only">{description}</p>
    </div>
  );
}
