// XState v5 source strings rendered by the editor's plain embed (EmbedMachine).
// The editor parses these as code, so keep them valid XState.

const checkout = (id: string) => `import { createMachine } from 'xstate';

export const machine = createMachine({
  id: '${id}',
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

/** Hero: 7 states, 8 transitions, refund unreachable. */
export const checkoutSource = checkout('checkout');

/** Fig 2: the same checkout after the PR; refund can no longer be reached. */
export const checkoutAfterSource = checkout('checkout');

export const loopSource = `import { createMachine } from 'xstate';

export const machine = createMachine({
  id: 'review',
  initial: 'mapped',
  states: {
    mapped: { on: { PROPOSE: 'proposed' } },
    proposed: { on: { REVIEW: 'approved' } },
    approved: { on: { IMPLEMENT: 'implemented' } },
    implemented: { on: { VERIFY: 'verified' } },
    verified: { type: 'final' },
  },
});
`;

export const servicesSource = `import { createMachine } from 'xstate';

export const machine = createMachine({
  id: 'system',
  initial: 'api',
  states: {
    api: { on: { ORDER: 'checkout' } },
    checkout: { on: { CHARGE: 'payments', NOTIFY: 'email' } },
    payments: { on: { RECEIPT: 'email', REFUND: 'api' } },
    email: { type: 'final' },
  },
});
`;

export const paymentSource = `import { createMachine } from 'xstate';

export const machine = createMachine({
  id: 'payment',
  initial: 'payment',
  states: {
    payment: { on: { PAID: 'confirmed', FAIL: 'declined' } },
    declined: { on: { RETRY: 'payment' } },
    confirmed: { type: 'final' },
  },
});
`;
