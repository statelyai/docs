// Compact CTA strip between sections: one sentence, then the two CTAs.
import { CtaRow } from '../shared';

export function CtaBand({ text }: { text: string }) {
  return (
    <div className="border-t border-[var(--sp-border)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <p className="text-[1.25rem] leading-snug font-semibold tracking-tight text-[var(--sp-fg)]">{text}</p>
        <CtaRow />
      </div>
    </div>
  );
}
