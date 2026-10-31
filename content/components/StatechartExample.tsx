'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  name: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  embedURL: string;
};

export function StatechartExample({
  name,
  src,
  alt,
  width,
  height,
  caption,
  embedURL,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-6">
      <figure>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          className="h-auto w-full rounded-lg bg-white"
        />
        <figcaption className="mt-2 text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      </figure>
      <details
        className="mt-3 rounded-lg border p-3"
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary className="cursor-pointer">
          Explore {name} in Stately (sign-in required)
        </summary>
        <p className="text-sm">
          This hosted example is read-only and requires Stately sign-in. The
          diagram above stays available without an account or if the interactive
          view cannot load.{' '}
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
            className="block h-[480px] w-full border-0"
            allowFullScreen
          />
        )}
      </details>
    </div>
  );
}
