'use client';
// Slot for the embeddable Stately editor (transparent background, minimal
// visualization). Until the embed/React component ships, renders the static
// SVG statechart in editor styling. Swap the body of this component only.
import { Statechart, checkoutMachine, type Machine } from './Statechart';

export function MachineCanvas({
  machine = checkoutMachine,
  className,
}: {
  machine?: Machine;
  className?: string;
}) {
  // TODO(embed): replace with <StatelyEmbed machine={...} transparent minimal />
  return <Statechart machine={machine} className={className} />;
}
