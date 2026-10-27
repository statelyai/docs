'use client';
// Live demo: the editor, read-only, on the checkout machine. Nothing loads
// from editor.stately.ai until the visitor asks for it.
import { useState } from 'react';
import { EmbedFrame, useSiteTheme } from '../EmbedFrame';
import { embedUrl } from '../EmbedMachine';
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
        lede="The same editor, read-only, running the checkout machine. Drag states, follow transitions, see the unreachable state."
      />
      <div className="mt-12 h-[640px] rounded-[var(--sp-radius)] border border-[var(--sp-border)] overflow-hidden sp-grid">
        {live ? (
          <div className="h-full" style={{ colorScheme: theme }}>
            <EmbedFrame src={embedUrl(checkoutSource, theme, '&interactive=1')} title="Stately editor, live" />
          </div>
        ) : (
          <div className="h-full grid place-items-center px-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <button type="button" onClick={() => setLive(true)} className="sp-btn sp-btn-primary">
                Load the live editor
              </button>
              <p className="text-[12px] text-[var(--sp-muted)]">Loads editor.stately.ai in a frame</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-[14px] text-[var(--sp-muted)]">Prefer a recording? A short demo video will replace this.</p>
    </Section>
  );
}
