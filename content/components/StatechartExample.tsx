'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  statechartExamples,
  statechartExampleURL,
  type StatechartExampleId,
} from '@/lib/statechart-examples';

type Props = {
  name: string;
  example: StatechartExampleId;
  alt: string;
  caption: string;
};

export function StatechartExample({ name, example, alt, caption }: Props) {
  const [expanded, setExpanded] = useState(false);
  const entry = statechartExamples[example];
  const { width, height } = entry;
  const image =
    'image' in entry ? entry.image : `/assets/statecharts/${example}.jpg`;
  const embedURL = statechartExampleURL(example);

  return (
    <div className="my-6">
      <figure>
        <Image
          src={image}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className="mx-auto h-auto max-w-full rounded-lg bg-white"
        />
        <figcaption className="mt-2 text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      </figure>
      <details
        className="mt-3 rounded-lg border p-3"
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary className="cursor-pointer">Explore {name} in Stately</summary>
        <p className="text-sm">
          Simulate events, expand or collapse parent states, and pan or zoom this
          read-only example. The screenshot stays available if the editor cannot
          load.{' '}
          <a href={embedURL} target="_blank" rel="noopener noreferrer">
            Open the example in a new tab
          </a>
          .
        </p>
        {expanded && (
          <iframe
            src={embedURL}
            title={`${name} read-only statechart`}
            loading="lazy"
            className="block h-[640px] w-full border-0"
            allowFullScreen
          />
        )}
      </details>
    </div>
  );
}
