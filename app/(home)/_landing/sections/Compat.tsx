// §6 Compat: sources map into one statechart, which exports to outputs.
// Architecture-view nodes (HTML) with editor-style `sends` edges (inline SVG,
// dashed 5 5). Three columns on lg; stacked with vertical connectors below.
import type { LucideIcon } from 'lucide-react';
import {
  AppWindow,
  Box,
  Component,
  FileCode,
  FlaskConical,
  GitBranch,
  Layers,
  Network,
  Workflow,
} from 'lucide-react';
import { Section, SectionHeading } from '../shared';

type Ramp = 'blue' | 'green' | 'purple';
type ArchNode = { title: string; icon: LucideIcon; description?: string };

const sources: ArchNode[] = [
  { title: 'XState', icon: Component },
  { title: 'Redux', icon: Layers },
  { title: 'Zustand', icon: Box },
  { title: 'LangGraph', icon: Workflow },
  { title: 'Step Functions', icon: Network },
  { title: 'Running app', icon: AppWindow },
];
const center: ArchNode = { title: 'Statechart', icon: Component, description: 'the model' };
const outputs: ArchNode[] = [
  { title: 'XState', icon: Component },
  { title: 'SCXML', icon: FileCode },
  { title: 'Mermaid', icon: GitBranch },
  { title: 'Tests', icon: FlaskConical },
];

/** The editor's architecture node: 1px ramp border, r6, p16, 48px icon column. */
function Node({ node, ramp }: { node: ArchNode; ramp: Ramp }) {
  const Icon = node.icon;
  return (
    <div
      className="grid h-20 min-w-[200px] grid-cols-[48px_minmax(0,1fr)] items-center gap-x-3 rounded-[6px] border p-4"
      style={{
        background: `var(--sp-arch-${ramp})`,
        borderColor: `var(--sp-ramp-${ramp}-border)`,
        color: `var(--sp-ramp-${ramp}-title)`,
      }}
    >
      <Icon size={48} strokeWidth={2} aria-hidden className="block" />
      <div className="min-w-0">
        <p className="text-[20px] leading-6 font-semibold tracking-[-0.01em]">{node.title}</p>
        {node.description && <p className="text-[12px] leading-4 text-[var(--sp-muted)]">{node.description}</p>}
      </div>
    </div>
  );
}

/* ---------- edges (geometry in px; nodes are h-20 with 16px gaps) ---------- */

const H = 560; // 6 sources x 80 + 5 x 16
const W = 160; // connector column
const MID = H / 2;
const srcY = sources.map((_, i) => 40 + i * 96);
const outTop = (H - (outputs.length * 80 + (outputs.length - 1) * 16)) / 2;
const outY = outputs.map((_, j) => outTop + 40 + j * 96);

/** Corner helper: the editor's 10px cubic corner (control point at the corner). */
const C = (cx: number, cy: number, ex: number, ey: number) => `C${cx},${cy} ${cx},${cy} ${ex},${ey}`;

function Paths({ d }: { d: string[] }) {
  return (
    <>
      {d.map((p) => (
        <path key={`h${p}`} d={p} fill="none" stroke="var(--sp-edge-halo)" strokeWidth="6" />
      ))}
      {d.map((p) => (
        <path key={p} d={p} fill="none" stroke="var(--sp-edge)" strokeWidth="2" strokeDasharray="5 5" strokeDashoffset="2.5" />
      ))}
    </>
  );
}

/** Filled 10x10 arrowhead whose tip sits at (x, y), pointing right or down. */
function Arrow({ x, y, dir = 'right' }: { x: number; y: number; dir?: 'right' | 'down' }) {
  const d = dir === 'right' ? `M${x - 10},${y - 5} L${x - 10},${y + 5} L${x},${y} z` : `M${x - 5},${y - 10} L${x + 5},${y - 10} L${x},${y} z`;
  return <path d={d} fill="var(--sp-edge)" />;
}

/** Event label, editor style. Fixed width so the edge can split around it. */
function Label({ text, x, y, w }: { text: string; x: number; y: number; w: number }) {
  return (
    <span
      className="absolute block rounded-[15.2px] border-2 py-2 text-center text-[14px] leading-5 font-semibold text-[var(--sp-fg)]"
      style={{ left: x - w / 2, top: y - 20, width: w, borderColor: 'var(--sp-edge)', background: 'var(--sp-label-bg)' }}
    >
      {text}
    </span>
  );
}

/** Sources merge on a bus at x=40, then MAP into the statechart. */
function MapEdges() {
  const BX = 40;
  const top = srcY[0];
  const bot = srcY[srcY.length - 1];
  const d = [
    `M0,${top} L${BX - 10},${top} ${C(BX, top, BX, top + 10)} L${BX},${MID - 10} ${C(BX, MID, BX + 10, MID)} L68,${MID}`,
    `M0,${bot} L${BX - 10},${bot} ${C(BX, bot, BX, bot - 10)} L${BX},${MID + 10} ${C(BX, MID, BX + 10, MID)}`,
    ...srcY.slice(1, -1).map((y) => `M0,${y} L${BX - 10},${y} ${C(BX, y, BX, y + (y < MID ? 10 : -10))}`),
    `M132,${MID} L${W - 15},${MID}`,
  ];
  return (
    <div className="relative" style={{ width: W, height: H }} aria-hidden>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible">
        <Paths d={d} />
        <Arrow x={W - 5} y={MID} />
      </svg>
      <Label text="MAP" x={100} y={MID} w={64} />
    </div>
  );
}

/** EXPORT out of the statechart, then a bus at x=130 fans out to the outputs. */
function ExportEdges() {
  const BX = 130;
  const top = outY[0];
  const bot = outY[outY.length - 1];
  const d = [
    `M0,${MID} L16,${MID}`,
    `M108,${MID} L${BX - 10},${MID} ${C(BX, MID, BX, MID - 10)} L${BX},${top + 10} ${C(BX, top, BX + 10, top)} L${W - 15},${top}`,
    `M${BX - 10},${MID} ${C(BX, MID, BX, MID + 10)} L${BX},${bot - 10} ${C(BX, bot, BX + 10, bot)} L${W - 15},${bot}`,
    ...outY.slice(1, -1).map((y) => `M${BX},${y + (y < MID ? 10 : -10)} ${C(BX, y, BX + 10, y)} L${W - 15},${y}`),
  ];
  return (
    <div className="relative" style={{ width: W, height: H }} aria-hidden>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible">
        <Paths d={d} />
        {outY.map((y) => (
          <Arrow key={y} x={W - 5} y={y} />
        ))}
      </svg>
      <Label text="EXPORT" x={62} y={MID} w={92} />
    </div>
  );
}

/** Below lg: one vertical edge between stacked groups, label splitting it. */
function VEdge({ label, w }: { label: string; w: number }) {
  const seg = (h: number, arrow = false) => (
    <svg width="10" height={h} viewBox={`0 0 10 ${h}`} className="block overflow-visible">
      <path d={`M5,0 L5,${arrow ? h - 10 : h}`} fill="none" stroke="var(--sp-edge-halo)" strokeWidth="6" />
      <path d={`M5,0 L5,${arrow ? h - 10 : h}`} fill="none" stroke="var(--sp-edge)" strokeWidth="2" strokeDasharray="5 5" strokeDashoffset="2.5" />
      {arrow && <path d={`M0,${h - 10} L10,${h - 10} L5,${h} z`} fill="var(--sp-edge)" />}
    </svg>
  );
  return (
    <div className="mx-auto flex w-max flex-col items-center py-[5px]" aria-hidden>
      {seg(24)}
      <span
        className="block rounded-[15.2px] border-2 py-2 text-center text-[14px] leading-5 font-semibold text-[var(--sp-fg)]"
        style={{ width: w, borderColor: 'var(--sp-edge)', background: 'var(--sp-label-bg)' }}
      >
        {label}
      </span>
      {seg(32, true)}
    </div>
  );
}

function Group({ label, nodes, ramp, className = '' }: { label: string; nodes: ArchNode[]; ramp: Ramp; className?: string }) {
  return (
    <ul aria-label={label} className={className}>
      {nodes.map((n) => (
        <li key={n.title}>
          <Node node={n} ramp={ramp} />
        </li>
      ))}
    </ul>
  );
}

export function Compat() {
  return (
    <Section id="compat" event="IMPORT">
      <SectionHeading
        title="Works with any code."
        lede="Point it at Redux, LangGraph, Step Functions, XState, or a running app. Get back XState, SCXML, Mermaid, D2, or tests."
      />
      {/* lg: sources | MAP | statechart | EXPORT | outputs */}
      <div className="mt-12 hidden lg:grid grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)_160px_minmax(0,1fr)]">
        <Group label="Sources" nodes={sources} ramp="blue" className="flex flex-col gap-4" />
        <MapEdges />
        <div className="flex flex-col justify-center" style={{ height: H }}>
          <Node node={center} ramp="green" />
        </div>
        <ExportEdges />
        <Group label="Outputs" nodes={outputs} ramp="purple" className="flex flex-col justify-center gap-4" />
      </div>
      {/* below lg: stacked groups */}
      <div className="mt-12 lg:hidden max-w-[44rem]">
        <Group label="Sources" nodes={sources} ramp="blue" className="grid sm:grid-cols-2 gap-3" />
        <VEdge label="MAP" w={64} />
        <div className="sm:mx-auto sm:max-w-[calc(50%-6px)]">
          <Node node={center} ramp="green" />
        </div>
        <VEdge label="EXPORT" w={92} />
        <Group label="Outputs" nodes={outputs} ramp="purple" className="grid sm:grid-cols-2 gap-3" />
      </div>
      <p className="mt-8 max-w-[44rem] text-[15px] leading-relaxed text-[var(--sp-muted)]">
        Also reads XState Store, Mermaid, SCXML, D2, Inngest, Restate. Sits
        above Temporal, Inngest, Restate, and LangGraph; it does not replace
        them.
      </p>
    </Section>
  );
}
