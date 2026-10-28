// §6 Compat: one graph model in the middle, every format, library, and runtime
// around it. Each spoke converts both ways, so any two convert to each other.
// The graph is a draggable force layout (HubGraph); brand marks come from
// simple-icons and are resolved here on the server so the client bundle only
// carries the paths in use.
import type { LucideIcon } from 'lucide-react';
import { AppWindow, Boxes, CodeXml, FlaskConical, History, Layers, PawPrint, Shapes, Waypoints, Workflow, Zap } from 'lucide-react';
import { siLanggraph, siMermaid, siRedux, siTemporal, siTypescript, siXstate, type SimpleIcon } from 'simple-icons';
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
      { id: 'sfn', title: 'Step Functions', meta: 'AWS', icon: glyph(Workflow) },
      { id: 'temporal', title: 'Temporal', meta: 'workflows', icon: brand(siTemporal) },
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
      { id: 'c4', title: 'C4', meta: 'Structurizr', icon: glyph(Layers) },
    ],
  },
  {
    label: 'Outputs',
    ramp: 'orange',
    spokes: [
      { id: 'tests', title: 'Tests', meta: 'Playwright, Vitest', icon: glyph(FlaskConical) },
      { id: 'app', title: 'Running app', meta: 'inspector', icon: glyph(AppWindow) },
      { id: 'ts', title: 'TypeScript', meta: 'source', icon: brand(siTypescript) },
    ],
  },
];

const spokes: HubNode[] = groups.flatMap((g) => g.spokes.map((s) => ({ ...s, ramp: g.ramp })));
const hub: HubNode = { id: 'model', title: 'Graph model', meta: 'statecharts · workflows · architecture', ramp: 'blue', icon: glyph(Waypoints) };

export function Compat() {
  return (
    <Section id="compat" event="IMPORT">
      <SectionHeading
        title="Works with any code."
        lede="Everything here reads into one graph model and writes back out of it, so any two convert to each other. Bring in a Redux reducer and get an XState machine, or turn a Step Functions workflow into Playwright tests."
      />
      <HubGraph hub={hub} spokes={spokes} className="mt-12 aspect-[9/18] sm:aspect-[4/3] lg:aspect-[16/10]" />
      <div className="sr-only">
        <p>The graph model converts to and from each of these:</p>
        <ul>
          {groups.map((g) => (
            <li key={g.label}>
              {g.label}: {g.spokes.map((s) => s.title).join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 max-w-[44rem] text-[15px] leading-relaxed text-[var(--sp-muted)]">
        With Temporal, Inngest, Restate, and LangGraph, Stately reads the
        workflows you already run and models the behavior around them. It sits
        above those runtimes and does not replace them.
      </p>
    </Section>
  );
}
