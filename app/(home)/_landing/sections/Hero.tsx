// Hero: copy on the editor's dot grid; the example checkout machine, drawn in
// the editor's styling and simulated on a loop, to the right; an editor-style
// status bar closes it.
import { HeroMachine } from '../HeroMachine';
import { CtaRow, InitialMarker, InstallPill } from '../shared';

const heroTitle = 'Statechart of an example checkout flow';
const heroDescription =
  'Example checkout statechart, simulated on a loop: an order is added, checked out, submitted, declined, cancelled, and then paid. States: idle (initial), cart, address, payment, declined, confirmed (final), refund (unreachable). Transitions: idle on ADD_ITEM to cart; cart on CHECKOUT to address; cart on EMPTY to idle; address on SUBMIT to payment; payment on PAID to confirmed; payment on FAIL to declined; declined on RETRY to payment; declined on CANCEL to cart.';

export function Hero() {
  return (
    <section className="relative sp-grid border-b border-[var(--sp-border)] overflow-hidden">
      {/* copy layer */}
      <div className="relative z-20 mx-auto max-w-6xl px-6 sm:px-10 pt-16 lg:pt-28 pb-10 lg:pb-28">
        <div className="max-w-[40rem] lg:max-w-[36rem] xl:max-w-[40rem]">
          <h1 className="relative text-[2.75rem] sm:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.5rem] leading-[1.04] font-semibold tracking-tight text-[var(--sp-fg)]">
            <InitialMarker className="absolute right-[calc(100%+4px)] top-0 hidden sm:block" />
            See what your software{' '}
            <br className="hidden xl:inline" />
            actually does.
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-[var(--sp-muted)] max-w-[32rem]">
            Your coding agent reads the code. Stately draws the statechart
            humans can see and agents can reason about, and every part of it
            can be checked against the code.
          </p>
          <CtaRow className="mt-9" />
          <div className="mt-6 max-w-[29rem]">
            <InstallPill />
            <p className="mt-2 text-[12px] text-[var(--sp-muted)]">
              Hosted setup for Claude Code, Codex, Cursor, and VS Code below
            </p>
          </div>
        </div>
      </div>

      {/* graph layer (stacks under the copy below lg) and the status bar */}
      <HeroMachine label={heroTitle} description={heroDescription} />
    </section>
  );
}
