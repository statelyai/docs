'use client';
// §5 Compat matrix. Real <table> markup so agents can parse it.
import { DataTable, Edge, Section, SectionHeading } from '../shared';

const cell = (s: string) => <span className="text-[13px] leading-snug block min-w-[7rem]">{s}</span>;

const imports: [string, string][] = [
  ['XState', 'v4 and v5 machines'],
  ['Redux', 'reducers and actions'],
  ['Zustand', 'stores'],
  ['XState Store', 'stores'],
  ['Mermaid', 'state diagrams'],
  ['SCXML', 'W3C statecharts'],
  ['D2', 'diagrams'],
  ['ASL', 'AWS Step Functions'],
  ['Inngest', 'functions and steps'],
  ['Restate', 'workflows and handlers'],
  ['LangGraph', 'Python, JS, TS graphs'],
  ['Live app captures', 'running apps, no XState needed'],
];

const exports: [string, string][] = [
  ['XState', 'executable TypeScript or JavaScript'],
  ['SCXML', 'non-JS execution targets'],
  ['Mermaid', 'docs, READMEs, PRs'],
  ['D2', 'architecture diagrams'],
  ['JSON', 'structured graph for tools and agents'],
  ['Test paths', 'one test per path, generated'],
  ['React scaffold', 'components wired to the machine'],
];

const runtimes: [string, string][] = [
  ['Temporal', 'no importer yet; model and verify by hand'],
  ['Inngest', 'import, map, and verify functions'],
  ['Restate', 'import, map, and verify handlers'],
  ['LangGraph', 'import, map, and verify agent graphs'],
];

/** Edge between two tables: down when stacked, right on lg (centered on the header row). */
function TableEdge({ label }: { label: string }) {
  return (
    <div className="my-1 lg:my-0 lg:mx-1 lg:mt-[11px]">
      <Edge dir="down" label={label} length={64} className="lg:hidden" />
      <Edge dir="right" label={label} length={80} className="hidden lg:block" />
    </div>
  );
}

export function Compat() {
  return (
    <Section id="compat" event="IMPORT">
      <SectionHeading
        title="Point it at the code you have."
        lede="Import Redux, LangGraph, Step Functions, XState, or a running app. Export XState, SCXML, Mermaid, D2, or generated tests."
      />
      <div className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-start">
        <DataTable
          head={['Import from', 'Reads']}
          rows={imports.map(([a, b]) => [a, cell(b)])}
        />
        <TableEdge label="MAP" />
        <DataTable
          head={['Export to', 'For']}
          rows={exports.map(([a, b]) => [a, cell(b)])}
        />
        <TableEdge label="RUN" />
        <div className="min-w-0">
          <DataTable
            head={['Runtime', 'Stately’s role']}
            rows={runtimes.map(([a, b]) => [a, cell(b)])}
          />
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--sp-muted)]">
            Stately is the correctness layer for Temporal, Inngest, Restate,
            and LangGraph. It does not replace them.
          </p>
        </div>
      </div>
    </Section>
  );
}
