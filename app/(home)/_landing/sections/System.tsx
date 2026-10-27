// §5 System level: one parallel state, three dashed regions. Architecture,
// live inspection, and two-way editing, each drawn in the editor's styling.
import { Statechart } from '../Statechart';
import { paymentMachine, servicesMachine } from '../machines';
import { parallelRegionCls } from '../classes';
import { Edge, Section, SectionHeading } from '../shared';
import { TextLink } from './CopyLine';

const paymentDescription =
  'Payment statechart. States: payment (initial), declined, confirmed (final). Transitions: payment on PAID to confirmed; payment on FAIL to declined; declined on RETRY to payment.';

const log = [
  ['FAIL', 'declined'],
  ['RETRY', 'payment'],
  ['PAID', 'confirmed'],
];

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
      <div className="h-[420px] flex flex-col">{children}</div>
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
              <Statechart
                machine={servicesMachine}
                label="Four services and the messages between them"
                description="Services. States: api (initial), checkout, payments, email (final). Transitions: api on ORDER to checkout; checkout on CHARGE to payments; checkout on NOTIFY to email; payments on RECEIPT to email; payments on REFUND to api."
                className="w-full h-full max-w-[22rem]"
              />
            </div>
          </Region>
          <Region
            title="Inspection"
            body="Attach to a running app and watch states, events, and actors as they happen. Sequence diagrams show who sent what to whom."
            href="/docs/inspector"
            link="Inspector"
          >
            <div data-machine-slot="system-inspection" className="flex-1 min-h-0 flex items-center justify-center">
              <Statechart machine={paymentMachine} label="Payment statechart" description={paymentDescription} className="w-full h-full max-w-[22rem]" />
            </div>
            <ol className="mt-2 shrink-0 rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-canvas)] px-3 py-2 sp-mono text-[11.5px] leading-[1.7] text-[var(--sp-muted)]">
              {log.map(([event, state], i) => (
                <li key={event} className="flex gap-3">
                  <span className="text-[var(--sp-muted-2)]">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className={i === log.length - 1 ? 'text-[var(--sp-sim)]' : 'text-[var(--sp-fg)]'}>{event}</span>
                    {' → '}
                    {state}
                  </span>
                </li>
              ))}
            </ol>
          </Region>
          <Region
            title="Edit in either direction"
            body="Change the diagram and the source changes. Change the source and the diagram follows. In the editor, in VS Code, or through your agent."
            href="/docs/xstate-vscode-extension"
            link="VS Code extension"
          >
            <div
              data-machine-slot="system-edit"
              className="flex-1 min-h-0 flex items-center justify-center p-3 rounded-[var(--sp-radius)] border border-[var(--sp-border)] sp-grid overflow-hidden"
            >
              <Statechart machine={paymentMachine} label="Payment statechart in the editor" description={paymentDescription} className="w-full h-full max-w-[22rem]" />
            </div>
            <Edge dir="down" label="SYNC" length={88} bidirectional className="shrink-0" />
            <pre className="shrink-0 rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-canvas)] px-3 py-2 sp-mono text-[11.5px] leading-[1.5] text-[var(--sp-muted)] overflow-hidden">
              {'states: {\n  declined: {\n    on: { '}
              <span className="text-[var(--sp-fg)] underline decoration-[var(--sp-primary)] decoration-2 underline-offset-[3px]">RETRY: &apos;payment&apos;</span>
              {' },\n  },'}
            </pre>
          </Region>
        </div>
      </div>
    </Section>
  );
}
