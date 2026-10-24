// §6 Compat: what Stately reads, writes, and sits above, as chip rows joined by edges.
import { Edge, Section, SectionHeading } from '../shared';
import { Chip } from './CopyLine';

const columns: { term: string; items: string[] }[] = [
  {
    term: 'Reads',
    items: ['XState', 'Redux', 'Zustand', 'XState Store', 'Mermaid', 'SCXML', 'D2', 'ASL', 'Inngest', 'Restate', 'LangGraph', 'running apps'],
  },
  { term: 'Writes', items: ['XState', 'SCXML', 'Mermaid', 'D2', 'JSON', 'test paths', 'React scaffold'] },
  { term: 'Sits above', items: ['Temporal', 'Inngest', 'Restate', 'LangGraph'] },
];

/** Edge between two columns: down when stacked, right on lg (centered on the term line). */
function ColumnEdge({ label }: { label: string }) {
  return (
    <div className="my-2 lg:my-0 lg:ml-3 lg:mr-1 lg:mt-[3px]">
      <Edge dir="down" label={label} length={56} className="lg:hidden !ml-6" />
      <Edge dir="right" label={label} length={72} className="hidden lg:block" />
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
      <div className="mt-12 grid lg:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1fr)_auto_minmax(0,0.9fr)] items-start">
        {columns.map((c, i) => (
          <div key={c.term} className="contents">
            {i > 0 && <ColumnEdge label={i === 1 ? 'MAP' : 'RUN'} />}
            <dl className="min-w-0">
              <dt className="text-[14px] leading-5 font-semibold text-[var(--sp-fg)]">{c.term}</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-1.5">
                  {c.items.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-[38rem] text-[15px] leading-relaxed text-[var(--sp-muted)]">
        Stately is the correctness layer for Temporal, Inngest, Restate, and
        LangGraph. It does not replace them.
      </p>
    </Section>
  );
}
