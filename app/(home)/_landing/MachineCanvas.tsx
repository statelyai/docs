// Slot for the embeddable Stately editor (transparent background, minimal
// visualization). Until the embed/React component ships, renders the static
// SVG statechart in editor styling. Swap the body of this component only.
// Find every slot with: [data-embed-slot]
import { Statechart, checkoutMachine, type Machine } from './Statechart';

export function MachineCanvas({
  slot,
  machine = checkoutMachine,
  sim,
  inspect,
  selected,
  showEvidence,
  label,
  className = '',
  svgClassName = 'block w-full h-auto',
}: {
  /** data-embed-slot name, for finding placeholders later */
  slot: string;
  machine?: Machine;
  /** node id shown as simulating (solid runtime outline) */
  sim?: string;
  /** node id shown as inspected live (dashed orange outline) */
  inspect?: string;
  /** node id shown as selected */
  selected?: string;
  showEvidence?: boolean;
  /** accessible name for the chart (required: say what this slot shows) */
  label: string;
  className?: string;
  svgClassName?: string;
}) {
  // Runtime state comes from props only, so each slot says what it is running.
  const live: Machine = {
    ...machine,
    nodes: machine.nodes.map((n) => ({
      ...n,
      active: n.id === sim ? 'sim' : n.id === inspect ? 'inspect' : undefined,
      selected: n.id === selected,
    })),
  };
  // TODO(embed): replace with <StatelyEmbed machine={...} transparent minimal />
  return (
    <div data-embed-slot={slot} className={className}>
      <Statechart machine={live} showEvidence={showEvidence} label={label} className={svgClassName} />
    </div>
  );
}
