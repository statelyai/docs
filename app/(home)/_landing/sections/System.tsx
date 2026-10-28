// §5 System level: one parallel state, three dashed regions. Architecture
// (the editor's architecture view: component nodes, `sends` relationships
// dashed), live inspection, and two-way editing, each in the editor's styling.
import type { LucideIcon } from 'lucide-react';
import { BoxIcon, DatabaseIcon, ListOrderedIcon, ServerIcon } from 'lucide-react';
import { EdgeLayer, type EdgeSpec } from '../EdgeLayer';
import { Statechart } from '../Statechart';
import { paymentMachine } from '../machines';
import { parallelRegionCls } from '../classes';
import { Section, SectionHeading } from '../shared';
import { TextLink } from './CopyLine';

const paymentDescription =
  'Payment statechart. States: payment (initial), declined, confirmed (final). Transitions: payment on PAID to confirmed; payment on FAIL to declined; declined on RETRY to payment.';

/* ---------- inspection: the editor attached to a running checkout actor ---------- */

const inspectionAlt =
  'The editor inspecting a running checkout actor. The payment state is active with a double outline; the CHECKOUT transition it just took is highlighted. The inspection panel shows state payment, context orderId order-42, items 3, total 4200, the CHECKOUT event, and the actions reserveInventory and startPayment.';

/** Two slices of one inspection screenshot: the canvas column and the inspection panel, per theme. */
function Inspection() {
  const slice = (part: 'canvas' | 'panel', theme: 'dark' | 'light', w: number) => (
    <img
      src={`/landing-page/inspection-${part}-${theme}.png`}
      width={w}
      height={1040}
      alt=""
      loading="lazy"
      className={`block h-auto ${part === 'canvas' ? 'w-[44%]' : 'w-[56%]'} ${theme === 'dark' ? 'hidden dark:block' : 'dark:hidden'}`}
    />
  );
  return (
    <figure className="m-0 w-full max-w-[22rem] overflow-hidden rounded-[var(--sp-radius)] border border-[var(--sp-border)]">
      <div className="flex">
        {slice('canvas', 'dark', 400)}
        {slice('canvas', 'light', 400)}
        {slice('panel', 'dark', 512)}
        {slice('panel', 'light', 512)}
      </div>
      <figcaption className="sr-only">{inspectionAlt}</figcaption>
    </figure>
  );
}

/* ---------- architecture view: components and relationships ---------- */

type Ramp = 'blue' | 'green' | 'purple';
type Component = { id: string; title: string; technology: string; icon: LucideIcon; ramp: Ramp; cell: string };

// Two columns; rows leave 72px for a relationship label between stacked nodes.
const components: Component[] = [
  { id: 'storefront', title: 'Storefront', technology: 'Next.js', icon: BoxIcon, ramp: 'blue', cell: 'col-start-1 row-start-1' },
  { id: 'checkout', title: 'Checkout', technology: 'Node service', icon: ServerIcon, ramp: 'blue', cell: 'col-start-1 row-start-2' },
  { id: 'orders', title: 'Orders', technology: 'Postgres', icon: DatabaseIcon, ramp: 'green', cell: 'col-start-2 row-start-2' },
  { id: 'payments', title: 'Payments', technology: 'Node service', icon: ServerIcon, ramp: 'blue', cell: 'col-start-1 row-start-3' },
  { id: 'email', title: 'Email', technology: 'Queue', icon: ListOrderedIcon, ramp: 'purple', cell: 'col-start-2 row-start-4' },
];

// `sends` relationships are dashed with the event as a bare label; a plain
// relationship (Checkout writes Orders) is a solid, unlabeled edge.
const relationships: EdgeSpec[] = [
  { id: 'order', from: 'arch-storefront', to: 'arch-checkout', label: 'ORDER', dashed: true, labelStyle: 'text' },
  { id: 'writes', from: 'arch-checkout', to: 'arch-orders' },
  { id: 'charge', from: 'arch-checkout', to: 'arch-payments', label: 'CHARGE', dashed: true, labelStyle: 'text' },
  { id: 'receipt', from: 'arch-payments', to: 'arch-email', label: 'RECEIPT', dashed: true, labelStyle: 'text' },
];

/* ---------- two-way editing: one transition each way, side by side ---------- */

const editEdges: EdgeSpec[] = [
  { id: 'graph', from: 'edit-graph', to: 'edit-code', label: 'EDIT_GRAPH', fromSide: 'bottom', toSide: 'top', offset: -72 },
  { id: 'code', from: 'edit-code', to: 'edit-graph', label: 'EDIT_CODE', fromSide: 'top', toSide: 'bottom', offset: 72 },
];

const architectureDescription =
  'Architecture view. Components: Storefront (Next.js), Checkout (Node service), Orders (Postgres), Payments (Node service), Email (queue). Relationships: Storefront sends ORDER to Checkout; Checkout writes Orders; Checkout sends CHARGE to Payments; Payments sends RECEIPT to Email.';

/** The editor's architecture node at two-thirds scale: 1px ramp border, r6, icon column. */
function ComponentNode({ c }: { c: Component }) {
  const Icon = c.icon;
  return (
    <div
      data-edge-id={`arch-${c.id}`}
      className={`grid min-w-0 grid-cols-[28px_minmax(0,1fr)] items-center gap-x-2 rounded-[6px] border p-2.5 ${c.cell}`}
      style={{
        background: `var(--sp-arch-${c.ramp})`,
        borderColor: `var(--sp-ramp-${c.ramp}-border)`,
        color: `var(--sp-ramp-${c.ramp}-title)`,
      }}
    >
      <Icon size={28} strokeWidth={2} aria-hidden className="block" />
      <div className="min-w-0">
        <p className="break-words text-[14px] leading-[18px] font-semibold tracking-[-0.01em]">{c.title}</p>
        <p className="break-words text-[11px] leading-4 opacity-80">{c.technology}</p>
      </div>
    </div>
  );
}

function Architecture() {
  return (
    <figure className="relative m-0 w-full max-w-[22rem]">
      <div className="relative grid grid-cols-2 gap-x-7 gap-y-[72px]">
        {components.map((c) => (
          <ComponentNode key={c.id} c={c} />
        ))}
        <EdgeLayer edges={relationships} />
      </div>
      <figcaption className="sr-only">{architectureDescription}</figcaption>
    </figure>
  );
}

function Region({
  title,
  body,
  href,
  link,
  first = false,
  children,
}: {
  title: string;
  body: string;
  href: string;
  link: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`min-w-0 flex flex-col px-5 pt-4 pb-6 lg:px-6 ${first ? '' : `border-t lg:border-t-0 lg:border-l ${parallelRegionCls}`}`}>
      {/* Fixed chart area so the three titles share a baseline. */}
      <div className="h-[460px] flex flex-col">{children}</div>
      <h3 className="mt-6 text-[17px] font-semibold text-[var(--sp-fg)]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--sp-muted)]">{body}</p>
      <p className="mt-3 text-[14px]">
        <TextLink href={href}>{link}</TextLink>
      </p>
    </div>
  );
}

export function System() {
  return (
    <Section id="system" event="INSPECT">
      <SectionHeading title="Understand the whole system." />
      {/* One parallel state: three orthogonal regions, dashed dividers. */}
      <div className="mt-12 rounded-md border-2 border-[var(--sp-node-stroke)]">
        <div className="px-3 py-2 text-[13px] font-semibold text-[var(--sp-fg)]">system</div>
        <div className="grid lg:grid-cols-3">
          <Region
            first
            title="Architecture"
            body="Map how services, actors, and machines connect. Import C4, Structurizr, D2, or Mermaid, or let the agent draw the project from source."
            href="/docs/studio"
            link="The editor"
          >
            <div data-machine-slot="system-architecture" className="flex-1 min-h-0 flex items-center justify-center">
              <Architecture />
            </div>
          </Region>
          <Region
            title="Inspection"
            body="Attach to a running app and watch states, events, and actors as they happen. Sequence diagrams show who sent what to whom."
            href="/docs/inspector"
            link="Inspector"
          >
            <div data-machine-slot="system-inspection" className="flex-1 min-h-0 flex items-center justify-center">
              <Inspection />
            </div>
          </Region>
          <Region
            title="Edit in either direction"
            body="Change the diagram and the source changes. Change the source and the diagram follows. In the editor, in VS Code, or through your agent."
            href="/docs/xstate-vscode-extension"
            link="VS Code extension"
          >
            <div className="relative flex-1 min-h-0 flex flex-col">
              <div
                data-machine-slot="system-edit"
                data-edge-id="edit-graph"
                className="flex-1 min-h-0 flex items-center justify-center p-3 rounded-[var(--sp-radius)] border border-[var(--sp-border)] sp-grid overflow-hidden"
              >
                <Statechart machine={paymentMachine} label="Payment statechart in the editor" description={paymentDescription} className="w-full h-full max-w-[22rem]" />
              </div>
              {/* Room for the two transitions, one each way: the diagram writes the source, the source redraws the diagram. */}
              <div className="h-[88px] shrink-0" aria-hidden />
              <pre
                data-edge-id="edit-code"
                className="shrink-0 rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-canvas)] px-3 py-2 sp-mono text-[11.5px] leading-[1.5] text-[var(--sp-muted)] overflow-hidden"
              >
                {'states: {\n  declined: {\n    on: { '}
                <span className="text-[var(--sp-fg)] underline decoration-[var(--sp-primary)] decoration-2 underline-offset-[3px]">RETRY: &apos;payment&apos;</span>
                {' },\n  },'}
              </pre>
              <EdgeLayer decorative edges={editEdges} />
            </div>
          </Region>
        </div>
      </div>
    </Section>
  );
}
