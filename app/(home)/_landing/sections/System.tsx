// §5 System level: one parallel state, three dashed regions. Architecture,
// live inspection, and two-way editing, each with a running placeholder machine.
import { MachineCanvas } from '../MachineCanvas';
import { type Machine } from '../Statechart';
import { parallelRegionCls } from '../classes';
import { Edge, Section, SectionHeading } from '../shared';
import { TextLink } from './CopyLine';

const W = 96;

// Services and the messages between them.
const architecture: Machine = {
  w: 336,
  h: 182,
  nodes: [
    { id: 'api', label: 'api', x: 40, y: 20, w: W, h: 44 },
    { id: 'checkout', label: 'checkout', x: 224, y: 20, w: W, h: 44 },
    { id: 'payments', label: 'payments', x: 224, y: 128, w: W, h: 44 },
    { id: 'email', label: 'email', x: 40, y: 128, w: W, h: 44 },
  ],
  edges: [
    { from: 'api', to: 'checkout', label: 'ORDER', points: [[40 + W, 42], [224, 42]] },
    { from: 'checkout', to: 'payments', label: 'CHARGE', points: [[272, 64], [272, 128]] },
    { from: 'payments', to: 'email', label: 'RECEIPT', points: [[224, 150], [40 + W, 150]] },
  ],
};

// The payment part of the checkout machine.
const payment = (accentRetry = false): Machine => ({
  w: 336,
  h: 182,
  nodes: [
    { id: 'payment', label: 'payment', x: 40, y: 20, w: W, h: 52, initial: true },
    { id: 'declined', label: 'declined', x: 224, y: 20, w: W, h: 52 },
    { id: 'confirmed', label: 'confirmed', x: 40, y: 128, w: W, h: 44, final: true },
  ],
  edges: [
    { from: 'payment', to: 'declined', label: 'FAIL', points: [[40 + W, 32], [224, 32]] },
    { from: 'declined', to: 'payment', label: 'RETRY', accent: accentRetry, points: [[224, 61], [40 + W, 61]] },
    { from: 'payment', to: 'confirmed', label: 'PAID', points: [[88, 72], [88, 128]] },
  ],
});

const log = [
  ['FAIL', 'declined'],
  ['RETRY', 'payment'],
  ['PAID', 'confirmed'],
];

const graphCls = 'max-w-[22rem]';

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
      <div>{children}</div>
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
    <Section id="system" event="SYSTEM">
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
            <MachineCanvas
              slot="system-architecture"
              machine={architecture}
              sim="checkout"
              showEvidence={false}
              label="Architecture diagram of four services and the messages between them"
              className={graphCls}
            />
          </Region>
          <Region
            title="Inspection"
            body="Attach to a running app and watch states, events, and actors as they happen. Sequence diagrams show who sent what to whom."
            href="/docs/inspector"
            link="Inspector"
          >
            <MachineCanvas
              slot="system-inspection"
              machine={payment()}
              inspect="confirmed"
              showEvidence={false}
              label="Payment statechart with the live state outlined"
              className={graphCls}
            />
            <ol className={`mt-2 rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-canvas)] px-3 py-2 sp-mono text-[11px] leading-[1.7] text-[var(--sp-muted)] ${graphCls}`}>
              {log.map(([event, state], i) => (
                <li key={event} className="flex gap-3">
                  <span className="text-[var(--sp-muted-2)]">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className={i === log.length - 1 ? 'text-[var(--sp-inspect)]' : 'text-[var(--sp-fg)]'}>{event}</span>
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
            <MachineCanvas
              slot="system-edit"
              machine={payment(true)}
              sim="declined"
              showEvidence={false}
              label="Payment statechart with the RETRY transition highlighted"
              className={`rounded-[var(--sp-radius)] border border-[var(--sp-border)] sp-grid p-2 ${graphCls}`}
            />
            <div className={graphCls}>
              <Edge dir="down" label="SYNC" length={52} bidirectional accent />
            </div>
            <pre className={`rounded-[var(--sp-radius)] border border-[var(--sp-border)] bg-[var(--sp-canvas)] px-3 py-2 sp-mono text-[11px] leading-[1.7] text-[var(--sp-muted)] overflow-hidden ${graphCls}`}>
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
