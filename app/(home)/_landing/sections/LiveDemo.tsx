'use client';
// Live demo: the full editor in viewing mode on the checkout machine, with
// its toolbar, command palette, and simulation. Nothing loads from
// editor.stately.ai until the visitor asks for it.
import { useState } from 'react';
import { EmbedFrame, useSiteTheme } from '../EmbedFrame';
import { vizUrl } from '../lib';
import { Section, SectionHeading } from '../shared';

// Valid XState: the editor parses it as code. refund has no way in.
const checkoutSource = `import { createMachine } from 'xstate';

export const machine = createMachine({
  id: 'checkout',
  initial: 'idle',
  states: {
    idle: { on: { ADD_ITEM: 'cart' } },
    cart: { on: { CHECKOUT: 'address', EMPTY: 'idle' } },
    address: { on: { SUBMIT: 'payment' } },
    payment: { on: { PAID: 'confirmed', FAIL: 'declined' } },
    declined: { on: { RETRY: 'payment', CANCEL: 'cart' } },
    confirmed: { type: 'final' },
    refund: {},
  },
});
`;

export function LiveDemo() {
  const theme = useSiteTheme();
  const [live, setLive] = useState(false);
  return (
    <Section id="live" event="OPEN_EDITOR">
      <SectionHeading
        title="Try it live."
        lede="The editor in viewing mode, on the checkout machine. Run a simulation, step through events, open the command palette, and find the unreachable state."
      />
      <div className="mt-12 h-[640px] rounded-[var(--sp-radius)] border border-[var(--sp-border)] overflow-hidden sp-grid">
        {live ? (
          <div className="h-full" style={{ colorScheme: theme }}>
            <EmbedFrame src={vizUrl(checkoutSource, theme)} title="Stately editor, viewing the checkout machine" />
          </div>
        ) : (
          <div className="h-full grid place-items-center px-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <button type="button" onClick={() => setLive(true)} className="sp-btn sp-btn-primary">
                Load the editor
              </button>
              <p className="text-[12px] text-[var(--sp-muted)]">Loads editor.stately.ai in a frame</p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
