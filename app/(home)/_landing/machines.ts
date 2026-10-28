// Example machines as Statechart data: hand-placed, editor-styled layouts.
// Wide variants read left to right; tall variants are for phones.
import type { Edge, Machine, Node } from './Statechart';

type Variant = 'wide' | 'tall';

/** checkout: 7 states, 8 transitions; refund has no way in. */
function checkout(v: Variant, opts: { active?: boolean; diff?: boolean } = {}): Machine {
  const wide = v === 'wide';
  const at = (wx: number, wy: number, tx: number, ty: number) => (wide ? { x: wx, y: wy } : { x: tx, y: ty });
  const nodes: Node[] = [
    { id: 'idle', label: 'idle', initial: true, ...at(40, 40, 44, 30), w: wide ? 148 : 120 },
    { id: 'cart', label: 'cart', ...at(348, 40, 44, 170), w: wide ? 148 : 120 },
    { id: 'address', label: 'address', ...at(656, 40, 44, 310), w: wide ? 148 : 120 },
    { id: 'payment', label: 'payment', ...at(656, 220, 44, 450), w: wide ? 148 : 120, active: opts.active ? 'sim' : undefined },
    { id: 'declined', label: 'declined', ...at(348, 220, 264, 450), w: wide ? 148 : 130 },
    { id: 'confirmed', label: 'confirmed', final: true, ...at(646, 400, 44, 590), w: 168 },
    { id: 'refund', label: 'refund', unreachable: true, ...at(40, 220, 264, 590), w: wide ? 148 : 130 },
  ];
  const edges: Edge[] = wide
    ? [
        { from: 'idle', to: 'cart', label: 'ADD_ITEM', points: [[188, 62.5], [348, 62.5]] },
        { from: 'cart', to: 'idle', label: 'EMPTY', points: [[380, 85], [380, 150], [114, 150], [114, 85]], labelSeg: 1 },
        { from: 'cart', to: 'address', label: 'CHECKOUT', points: [[496, 62.5], [656, 62.5]] },
        { from: 'address', to: 'payment', label: 'SUBMIT', points: [[730, 85], [730, 220]] },
        { from: 'payment', to: 'confirmed', label: 'PAID', points: [[750, 265], [750, 400]] },
        { from: 'payment', to: 'declined', label: 'FAIL', points: [[656, 242.5], [496, 242.5]] },
        { from: 'declined', to: 'payment', label: 'RETRY', points: [[422, 265], [422, 330], [690, 330], [690, 265]], labelSeg: 1 },
        { from: 'declined', to: 'cart', label: 'CANCEL', points: [[460, 220], [460, 85]] },
      ]
    : [
        { from: 'idle', to: 'cart', label: 'ADD_ITEM', points: [[104, 75], [104, 170]] },
        { from: 'cart', to: 'idle', label: 'EMPTY', points: [[164, 180], [214, 180], [214, 52.5], [164, 52.5]], labelSeg: 1 },
        { from: 'cart', to: 'address', label: 'CHECKOUT', points: [[104, 215], [104, 310]] },
        { from: 'address', to: 'payment', label: 'SUBMIT', points: [[104, 355], [104, 450]] },
        { from: 'payment', to: 'confirmed', label: 'PAID', points: [[84, 495], [84, 590]] },
        { from: 'payment', to: 'declined', label: 'FAIL', points: [[164, 472.5], [264, 472.5]] },
        { from: 'declined', to: 'payment', label: 'RETRY', points: [[300, 495], [300, 540], [134, 540], [134, 495]], labelSeg: 1 },
        { from: 'declined', to: 'cart', label: 'CANCEL', points: [[329, 450], [329, 205], [164, 205]], labelSeg: 0 },
      ];
  if (opts.diff) {
    // The PR: RETRY is new, and the only way into refund is gone.
    for (const e of edges) if (e.label === 'RETRY') e.tone = 'added';
    edges.push({
      from: 'declined',
      to: 'refund',
      label: 'REFUND',
      tone: 'removed',
      points: wide ? [[348, 242.5], [188, 242.5]] : [[364, 495], [364, 590]],
    });
  }
  return wide ? { w: 854, h: 485, nodes, edges } : { w: 420, h: 655, nodes, edges };
}

/** Hero: 7 states, 8 transitions, refund unreachable; simulation paused in payment. */
export const checkoutMachine = { wide: checkout('wide', { active: true }), tall: checkout('tall', { active: true }) };

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
    { from: 'payment', to: 'confirmed', label: 'PAID', points: [[120, 65], [120, 170]] },
    { from: 'payment', to: 'declined', label: 'FAIL', points: [[220, 42.5], [290, 42.5], [290, 170]], labelSeg: 1 },
    { from: 'declined', to: 'payment', label: 'RETRY', points: [[230, 192.5], [205, 192.5], [205, 65]], labelSeg: 1 },
  ],
};
