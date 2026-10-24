// Hero: "inside the canvas". Copy sits on the editor's dot grid; a running
// machine lives to the right (embed slot); an editor-style status bar closes it.
import { MachineCanvas } from '../MachineCanvas';
import { CtaRow, InitialMarker, InstallPill } from '../shared';

export function Hero() {
  return (
    <section className="relative sp-grid border-b border-[var(--sp-border)] overflow-hidden">
      {/* copy layer */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 sm:px-10 pt-16 lg:pt-32 pb-16 lg:pb-36">
        <div className="max-w-[40rem]">
          <h1 className="relative text-[2.75rem] sm:text-[3.5rem] lg:text-[3.5rem] leading-[1.04] font-semibold tracking-tight text-[var(--sp-fg)]">
            <InitialMarker className="absolute -left-12 top-[27px] hidden lg:block" />
            See what your software{' '}
            <br className="hidden lg:inline" />
            actually does.
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-[var(--sp-muted)] max-w-[32rem]">
            Your coding agent reads the code. Stately draws the statechart humans
            can see and agents can reason about. Each state cites its file and line,
            and verify checks that the chart still matches the source.
          </p>
          <CtaRow className="mt-9" />
          <div className="mt-5 [&_.inline-flex]:max-w-full">
            <div className="max-w-[29rem]"><InstallPill /></div>
          </div>
        </div>
      </div>

      {/* graph layer: embed slot. Stacks under copy on small screens. */}
      <div className="pointer-events-none relative lg:absolute lg:inset-y-0 lg:left-[47%] lg:-right-[3%] flex items-center -mt-12 lg:mt-0 pb-10 lg:pb-0">
        <div className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-[var(--sp-canvas)] to-transparent z-10 hidden lg:block" />
        <MachineCanvas slot="hero" sim="payment" className="w-full px-4 lg:px-0" />
      </div>

      {/* status bar */}
      <div className="relative h-8 border-t border-[var(--sp-border)] bg-[var(--sp-canvas)] flex items-center gap-5 px-6 sm:px-10 sp-mono text-[11px] text-[var(--sp-muted-2)] whitespace-nowrap overflow-hidden">
        <span className="flex items-center gap-2 text-[var(--sp-sim)]">
          <span className="inline-block size-1.5 rounded-full bg-current" />
          simulating · payment
        </span>
        <span>7 states</span>
        <span>8 transitions</span>
        <span className="text-[var(--sp-warn)]">1 unreachable</span>
        <span className="ml-auto hidden sm:inline">source: src/checkout/*.ts · sha 9f3c1e2</span>
      </div>
    </section>
  );
}
