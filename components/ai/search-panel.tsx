'use client';

import dynamic from 'next/dynamic';

export const AISearchPanel = dynamic(
  () => import('./search').then((mod) => mod.AISearchPanel),
  {
    ssr: false,
  },
);
