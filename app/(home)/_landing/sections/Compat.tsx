// §6 Compat: what Stately reads, writes, and sits above, as chip groups joined by edges.
import { Fragment } from 'react';
import { Edge, Section, SectionHeading } from '../shared';
import { Chip } from './CopyLine';

const groups: { term: string; items: string[] }[] = [
  {
    term: 'Reads',
    items: ['XState', 'Redux', 'Zustand', 'XState Store', 'Mermaid', 'SCXML', 'D2', 'Step Functions (ASL)', 'Inngest', 'Restate', 'LangGraph', 'running apps'],
  },
  { term: 'Writes', items: ['XState', 'SCXML', 'Mermaid', 'D2', 'JSON', 'test paths', 'React scaffold'] },
  { term: 'Sits above', items: ['Temporal', 'Inngest', 'Restate', 'LangGraph'] },
];

export function Compat() {
  return (
    <Section id="compat" event="IMPORT">
      <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-12 lg:gap-16 items-start">
        <div className="min-w-0">
          <SectionHeading
            title="Point it at the code you have."
            lede="Import Redux, LangGraph, Step Functions, XState, or a running app. Export XState, SCXML, Mermaid, D2, or generated tests."
          />
          <p className="mt-6 max-w-[38rem] text-[15px] leading-relaxed text-[var(--sp-muted)]">
            Stately is the correctness layer for Temporal, Inngest, Restate, and
            LangGraph. It does not replace them.
          </p>
        </div>
        <div className="min-w-0 lg:pt-2">
          {groups.map((g, i) => (
            <Fragment key={g.term}>
              {i > 0 && <Edge dir="down" label={i === 1 ? 'MAP' : 'RUN'} length={56} className="my-2 !ml-8" />}
              <dl className="min-w-0">
                <dt className="text-[14px] leading-5 font-semibold text-[var(--sp-fg)]">{g.term}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-1.5">
                    {g.items.map((item) => (
                      <li key={item}>
                        <Chip>{item}</Chip>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </Fragment>
          ))}
        </div>
      </div>
    </Section>
  );
}
