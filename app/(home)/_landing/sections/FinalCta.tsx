// §12 Final CTA: the page ends in a final state.
import Link from 'next/link';
import { DEMO_URL, NewTab } from '../lib';
import { FinalFrame, InstallPill, Transition } from '../shared';
import { TextLink } from './CopyLine';

export function FinalCta() {
  return (
    <section id="start" className="sp-grid border-t border-[var(--sp-border)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 pb-20 lg:pb-28">
        <Transition event="START" />
        {/* Narrow phones: tighter inline padding so the install pill fits. */}
        <FinalFrame className="max-w-[44rem] max-sm:-mx-2 max-sm:[&>div]:px-3">
          <h2 className="max-w-[40rem] text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] leading-[1.05] font-semibold tracking-tight text-[var(--sp-fg)]">
            Map your first repo.
          </h2>
          <div className="mt-8 max-w-[32rem]">
            <InstallPill />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="sp-btn sp-btn-outline">
              Book a demo
              <NewTab />
            </Link>
            <span className="text-[14px] font-medium">
              <TextLink href="https://editor.stately.ai/?source=landing-page">Open the editor</TextLink>
            </span>
          </div>
        </FinalFrame>
      </div>
    </section>
  );
}
