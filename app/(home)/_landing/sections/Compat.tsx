// §6 Compat: sources converge into one statechart, which fans out to outputs.
// One editor-styled diagram; a wide layout from md, a stacked one below.
import { Statechart, type Edge, type Machine, type Node } from '../Statechart';
import { Section, SectionHeading } from '../shared';

const sources = ['XState', 'Redux', 'Zustand', 'LangGraph', 'Step Functions', 'running app'];
const outputs = ['XState', 'SCXML', 'Mermaid', 'tests'];
const H = 45;
const SW = 184; // source node width (fits "Step Functions")
const OW = 128;
const CW = 150;

const srcId = (i: number) => `src-${i}`;
const outId = (i: number) => `out-${i}`;

/** Sources in a column, edges merging on a bus into `statechart`, then fanning out. */
function wide(): Machine {
  const top = 8;
  const cy = (i: number) => top + i * 60 + H / 2;
  const mid = (cy(0) + cy(sources.length - 1)) / 2;
  const BX = 4 + SW + 40;
  const CX = BX + 120;
  const OX = CX + CW + 130;
  const TX = OX + 40;
  const nodes: Node[] = [
    ...sources.map((label, i) => ({ id: srcId(i), label, x: 4, y: cy(i) - H / 2, w: SW, h: H })),
    { id: 'statechart', label: 'statechart', x: CX, y: mid - H / 2, w: CW, h: H },
    ...outputs.map((label, j) => ({ id: outId(j), label, x: TX, y: mid + (j - 1.5) * 60 - H / 2, w: OW, h: H })),
  ];
  const edges: Edge[] = [
    ...sources.map((_, i): Edge => ({
      from: srcId(i),
      to: 'statechart',
      label: 'MAP',
      labelHidden: i > 0,
      labelSeg: 2,
      points: [[4 + SW, cy(i)], [BX, cy(i)], [BX, mid], [CX, mid]],
    })),
    ...outputs.map((_, j): Edge => {
      const y = mid + (j - 1.5) * 60;
      return { from: 'statechart', to: outId(j), label: 'EXPORT', labelHidden: j > 0, labelSeg: 0, points: [[CX + CW, mid], [OX, mid], [OX, y], [TX, y]] };
    }),
  ];
  return { w: TX + OW + 4, h: cy(sources.length - 1) + H / 2 + 8, nodes, edges };
}

/** Phones: sources in a 2x3 grid feeding a center bus, outputs in a 2x2 grid below. */
function tall(): Machine {
  const BX = 4 + SW + 28; // bus between the two columns
  const colB = BX + 28;
  const row = (r: number) => 4 + r * 57 + H / 2;
  const mapFrom = row(2) + H / 2 + 8; // label segment starts below the last source row
  const CY = mapFrom + 80; // center node top
  const outTop = CY + H + 90;
  const orow = (r: number) => outTop + r * 57 + H / 2;
  const nodes: Node[] = [
    ...sources.map((label, i) => ({ id: srcId(i), label, x: i % 2 ? colB : 4, y: row(Math.floor(i / 2)) - H / 2, w: SW, h: H })),
    { id: 'statechart', label: 'statechart', x: BX - CW / 2, y: CY, w: CW, h: H },
    ...outputs.map((label, j) => ({ id: outId(j), label, x: j % 2 ? colB : 4 + SW - OW, y: orow(Math.floor(j / 2)) - H / 2, w: OW, h: H })),
  ];
  const edges: Edge[] = [
    ...sources.map((_, i): Edge => {
      const y = row(Math.floor(i / 2));
      const x = i % 2 ? colB : 4 + SW;
      return { from: srcId(i), to: 'statechart', label: 'MAP', labelHidden: i > 0, labelSeg: 2, points: [[x, y], [BX, y], [BX, mapFrom], [BX, CY]] };
    }),
    ...outputs.map((_, j): Edge => {
      const y = orow(Math.floor(j / 2));
      const x = j % 2 ? colB : 4 + SW;
      return { from: 'statechart', to: outId(j), label: 'EXPORT', labelHidden: j > 0, labelSeg: 0, points: [[BX, CY + H], [BX, outTop - 10], [BX, y], [x, y]] };
    }),
  ];
  return { w: colB + SW + 4, h: orow(1) + H / 2 + 4, nodes, edges };
}

const label =
  'Sources (XState, Redux, Zustand, LangGraph, Step Functions, a running app) map into one statechart, which exports to XState, SCXML, Mermaid, and tests';

export function Compat() {
  return (
    <Section id="compat" event="IMPORT">
      <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-12 lg:gap-16 items-start">
        <SectionHeading
          className="min-w-0"
          title="Works with any code."
          lede="Point it at Redux, LangGraph, Step Functions, XState, or a running app. Get back XState, SCXML, Mermaid, D2, or tests."
        />
        <div className="min-w-0 lg:pt-2">
          <Statechart machine={wide()} label={label} className="hidden md:block w-full h-auto" />
          <Statechart machine={tall()} label={label} className="md:hidden block w-full max-w-[28rem] h-auto" />
          <p className="mt-6 text-[15px] leading-relaxed text-[var(--sp-muted)]">
            Also reads XState Store, Mermaid, SCXML, D2, Inngest, Restate. Sits
            above Temporal, Inngest, Restate, and LangGraph; it does not replace
            them.
          </p>
        </div>
      </div>
    </Section>
  );
}
