// §6 Compat: one graph model in the middle, with supported source formats,
// runtimes, and outputs around it. Conversion support varies by format.
// The graph is a draggable force layout (HubGraph); brand marks come from
// simple-icons and are resolved here on the server so the client bundle only
// carries the paths in use.
import type { LucideIcon } from 'lucide-react';
import { AppWindow, Boxes, CodeXml, FlaskConical, History, PawPrint, Shapes, Waypoints, Zap } from 'lucide-react';
import { siLanggraph, siMermaid, siRedux, siTypescript, siXstate, type SimpleIcon } from 'simple-icons';
import { HubGraph, type HubNode, type HubRamp } from '../HubGraph';
import { Section, SectionHeading } from '../shared';

const brand = (icon: SimpleIcon) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="block size-full p-[11%]" aria-hidden>
    <path d={icon.path} />
  </svg>
);
const glyph = (Icon: LucideIcon) => <Icon strokeWidth={2} className="block size-full" aria-hidden />;

type Spoke = Omit<HubNode, 'ramp'>;
const groups: { label: string; ramp: HubRamp; spokes: Spoke[] }[] = [
  {
    label: 'Libraries',
    ramp: 'blue',
    spokes: [
      { id: 'xstate', title: 'XState', meta: 'machines', icon: brand(siXstate) },
      { id: 'store', title: 'XState Store', meta: '@xstate/store', mono: true, icon: glyph(Boxes) },
      { id: 'redux', title: 'Redux', meta: 'reducers', icon: brand(siRedux) },
      { id: 'zustand', title: 'Zustand', meta: 'stores', icon: glyph(PawPrint) },
    ],
  },
  {
    label: 'Workflow and agent runtimes',
    ramp: 'purple',
    spokes: [
      { id: 'langgraph', title: 'LangGraph', meta: 'agent graphs', icon: brand(siLanggraph) },
      { id: 'inngest', title: 'Inngest', meta: 'functions', icon: glyph(Zap) },
      { id: 'restate', title: 'Restate', meta: 'durable handlers', icon: glyph(History) },
    ],
  },
  {
    label: 'Diagram and model formats',
    ramp: 'green',
    spokes: [
      { id: 'mermaid', title: 'Mermaid', meta: 'state diagrams', icon: brand(siMermaid) },
      { id: 'scxml', title: 'SCXML', meta: 'W3C', icon: glyph(CodeXml) },
      { id: 'd2', title: 'D2', meta: 'diagrams', icon: glyph(Shapes) },
    ],
  },
  {
    label: 'Outputs',
    ramp: 'orange',
    spokes: [
      { id: 'tests', title: 'Test paths', meta: 'model-based', icon: glyph(FlaskConical) },
      { id: 'app', title: 'Running app', meta: 'inspector', icon: glyph(AppWindow) },
      { id: 'ts', title: 'TypeScript', meta: 'source', icon: brand(siTypescript) },
    ],
  },
];

const spokes: HubNode[] = groups.flatMap((g) => g.spokes.map((s) => ({ ...s, ramp: g.ramp })));
const hub: HubNode = { id: 'model', title: 'Graph model', meta: 'statecharts · workflows · architecture', ramp: 'blue', icon: glyph(Waypoints) };

export function Compat() {
  return (
    <Section id="compat" event="IMPORT" color="pink">
      <SectionHeading
        title="Connect behavior across your stack."
        lede="Stately imports supported machine, store, workflow, and diagram formats into one graph model. Conversion and write-back depend on the format; the graph can also drive test paths and inspection."
      />
      <HubGraph hub={hub} spokes={spokes} className="mt-12 aspect-[9/18] sm:aspect-[4/3] lg:aspect-[16/10]" />
      <div className="sr-only">
        <p>The graph model can represent behavior from these sources and outputs:</p>
        <ul>
          {groups.map((g) => (
            <li key={g.label}>
              {g.label}: {g.spokes.map((s) => s.title).join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 max-w-[44rem] text-[15px] leading-relaxed text-[var(--sp-muted)]">
        With Inngest, Restate, and LangGraph, Stately reads the workflows you
        already run and models the behavior around them. It sits above those
        runtimes and does not replace them.
      </p>
    </Section>
  );
}
