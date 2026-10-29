// Example machines as Statechart data: editor-styled layouts with nodes sized
// from their text, placed on a small grid; edge waypoints are derived from
// the node boxes. Wide variants read left to right; tall variants are for phones.
import { nodeWidth, type Edge, type Machine, type Node } from './Statechart';

type Variant = 'wide' | 'tall';
type Box = Node & { w: number; h: number; r: number; b: number; cx: number; cy: number };

const H = 45;
const box = (n: Node): Box => {
  const w = n.w ?? nodeWidth(n.label, n.final);
  return { ...n, w, h: H, r: n.x + w, b: n.y + H, cx: n.x + w / 2, cy: n.y + H / 2 };
};

/** checkout: 7 states, 8 transitions; refund has no way in. */
function checkout(v: Variant, opts: { diff?: boolean } = {}): Machine {
  const wide = v === 'wide';
  // Columns: the left edge of each is the previous column's widest node plus a gap.
  const gap = wide ? 160 : 104;
  const x0 = wide ? 40 : 44;
  const x1 = x0 + Math.max(nodeWidth('idle'), nodeWidth('refund'), wide ? 0 : nodeWidth('confirmed', true)) + gap;
  const x2 = x1 + Math.max(nodeWidth('cart'), nodeWidth('declined')) + gap;
  const at = (col: number, row: number) => (wide ? { x: [x0, x1, x2][col], y: 40 + row * 180 } : { x: col ? x1 : x0, y: 30 + row * 140 });
  const n = {
    idle: box({ id: 'idle', label: 'idle', initial: true, ...at(0, 0) }),
    cart: box({ id: 'cart', label: 'cart', ...(wide ? at(1, 0) : at(0, 1)) }),
    address: box({ id: 'address', label: 'address', ...(wide ? at(2, 0) : at(0, 2)) }),
    payment: box({ id: 'payment', label: 'payment', color: 'purple', ...(wide ? at(2, 1) : at(0, 3)) }),
    declined: box({ id: 'declined', label: 'declined', color: 'red', ...(wide ? at(1, 1) : at(1, 3)) }),
    confirmed: box({ id: 'confirmed', label: 'confirmed', final: true, color: 'green', ...(wide ? { x: x2 - 10, y: 400 } : at(0, 4)) }),
    refund: box({ id: 'refund', label: 'refund', unreachable: true, color: 'yellow', ...(wide ? at(0, 1) : at(1, 4)) }),
  };
  const { idle, cart, address, payment, declined, confirmed, refund } = n;
  let edges: Edge[];
  if (wide) {
    const cancelX = cart.r - 16; // inside both cart and declined
    edges = [
      { from: 'idle', to: 'cart', label: 'ADD_ITEM', points: [[idle.r, idle.cy], [cart.x, idle.cy]] },
      { from: 'cart', to: 'idle', label: 'EMPTY', points: [[cart.x + 16, cart.b], [cart.x + 16, cart.b + 65], [idle.cx, cart.b + 65], [idle.cx, idle.b]], labelSeg: 1 },
      { from: 'cart', to: 'address', label: 'CHECKOUT', points: [[cart.r, cart.cy], [address.x, cart.cy]] },
      { from: 'address', to: 'payment', label: 'SUBMIT', points: [[address.x + 74, address.b], [address.x + 74, payment.y]] },
      { from: 'payment', to: 'confirmed', label: 'PAID', points: [[payment.x + 94, payment.b], [payment.x + 94, confirmed.y]] },
      { from: 'payment', to: 'declined', label: 'FAIL', points: [[payment.x, payment.cy], [declined.r, payment.cy]] },
      { from: 'declined', to: 'payment', label: 'RETRY', points: [[declined.x + 74, declined.b], [declined.x + 74, declined.b + 65], [payment.x + 34, declined.b + 65], [payment.x + 34, payment.b]], labelSeg: 1 },
      { from: 'declined', to: 'cart', label: 'CANCEL', points: [[cancelX, declined.y], [cancelX, cart.b]] },
    ];
  } else {
    const spine = x0 + 30; // a vertical run that fits the narrowest node
    const emptyX = Math.max(idle.r, cart.r) + 72; // clear of the ADD_ITEM label
    edges = [
      { from: 'idle', to: 'cart', label: 'ADD_ITEM', points: [[spine, idle.b], [spine, cart.y]] },
      { from: 'cart', to: 'idle', label: 'EMPTY', points: [[cart.r, cart.y + 12], [emptyX, cart.y + 12], [emptyX, idle.cy], [idle.r, idle.cy]], labelSeg: 1 },
      { from: 'cart', to: 'address', label: 'CHECKOUT', points: [[spine, cart.b], [spine, address.y]] },
      { from: 'address', to: 'payment', label: 'SUBMIT', points: [[spine, address.b], [spine, payment.y]] },
      { from: 'payment', to: 'confirmed', label: 'PAID', points: [[spine, payment.b], [spine, confirmed.y]] },
      { from: 'payment', to: 'declined', label: 'FAIL', points: [[payment.r, payment.cy], [declined.x, payment.cy]] },
      { from: 'declined', to: 'payment', label: 'RETRY', points: [[declined.x + 36, declined.b], [declined.x + 36, declined.b + 45], [payment.x + 90, declined.b + 45], [payment.x + 90, payment.b]], labelSeg: 1 },
      { from: 'declined', to: 'cart', label: 'CANCEL', points: [[declined.x + 65, declined.y], [declined.x + 65, cart.y + 33], [cart.r, cart.y + 33]], labelSeg: 0 },
    ];
  }
  if (opts.diff) {
    // The PR: RETRY is new, and the only way into refund is gone.
    for (const e of edges) if (e.label === 'RETRY') e.tone = 'added';
    edges.push({
      from: 'declined',
      to: 'refund',
      label: 'REFUND',
      tone: 'removed',
      points: wide ? [[declined.x, declined.cy], [refund.r, declined.cy]] : [[declined.x + 80, declined.b], [declined.x + 80, refund.y]],
    });
  }
  const nodes = Object.values(n);
  const w = Math.max(...nodes.map((b) => b.r), wide ? 0 : Math.max(idle.r, cart.r) + 72 + 50) + 40;
  const h = Math.max(...nodes.map((b) => b.b)) + 40;
  return { w, h, nodes, edges };
}

/** Hero: 7 states, 8 transitions, refund unreachable; simulated live. */
export const checkoutMachine = { wide: checkout('wide'), tall: checkout('tall') };

/** Fig 2: the same checkout after the PR. RETRY added, REFUND removed. */
export const checkoutAfterMachine = { wide: checkout('wide', { diff: true }), tall: checkout('tall', { diff: true }) };

/** payment, confirmed (final), declined. */
export const paymentMachine: Machine = {
  w: 370,
  h: 235,
  nodes: [
    { id: 'payment', label: 'payment', initial: true, x: 90, y: 20, w: 130 },
    { id: 'confirmed', label: 'confirmed', final: true, x: 20, y: 170, w: 168 },
    { id: 'declined', label: 'declined', x: 230, y: 170, w: 120 },
  ],
  edges: [
    { from: 'payment', to: 'confirmed', label: 'PAID', color: 'green', points: [[120, 65], [120, 170]] },
    { from: 'payment', to: 'declined', label: 'FAIL', color: 'red', points: [[220, 42.5], [290, 42.5], [290, 170]], labelSeg: 1 },
    { from: 'declined', to: 'payment', label: 'RETRY', color: 'orange', points: [[230, 192.5], [205, 192.5], [205, 65]], labelSeg: 1 },
  ],
};
