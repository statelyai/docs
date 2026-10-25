// §12 Final CTA: the page ends in a final state.
import { CtaRow, InstallPill, StateNode, Transition } from '../shared';

export function FinalCta() {
  return (
    <section id="start" className="sp-grid border-t border-[var(--sp-border)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 pb-20 lg:pb-28">
        <Transition event="START" />
        <StateNode
          final
          iconSize={30}
          className="max-w-[44rem]"
          title={
            <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] font-semibold tracking-tight text-[var(--sp-fg)]">
              Map your first repo.
            </h2>
          }
        >
          <div className="px-3 pb-4">
            <div className="mt-4 max-w-[32rem]">
              <InstallPill />
            </div>
            <CtaRow className="mt-5" />
          </div>
        </StateNode>
      </div>
    </section>
  );
}
